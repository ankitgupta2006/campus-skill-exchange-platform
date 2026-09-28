const ExchangeRequest = require("../models/ExchangeRequest");
const User = require("../models/User");

function publicRequest(request, currentUserId) {
  const from = request.fromUser;
  const to = request.toUser;
  const other = from._id.toString() === currentUserId ? to : from;

  return {
    id: request._id,
    message: request.message,
    status: request.status,
    createdAt: request.createdAt,
    fromUserId: from._id,
    fromName: from.name,
    toUserId: to._id,
    toName: to.name,
    otherUser: {
      id: other._id,
      name: other.name,
      whatsappUnlocked: request.status === "accepted",
      whatsapp: request.status === "accepted" ? other.whatsapp : null,
    },
  };
}

async function listRequests(req, res) {
  try {
    const requests = await ExchangeRequest.find({
      $or: [{ fromUser: req.userId }, { toUser: req.userId }],
    })
      .populate("fromUser")
      .populate("toUser")
      .sort({ createdAt: -1 });

    res.json({ requests: requests.map((request) => publicRequest(request, req.userId)) });
  } catch (error) {
    res.status(500).json({ message: "Could not load exchange requests." });
  }
}

async function createRequest(req, res) {
  try {
    const toUserId = String(req.body.toUserId || "");
    const message = String(req.body.message || "").trim();

    if (!toUserId) return res.status(400).json({ message: "A recipient is required." });
    if (toUserId === String(req.userId)) {
      return res.status(400).json({ message: "You cannot request yourself." });
    }
    if (message.length > 1000) {
      return res
        .status(400)
        .json({ message: "The request message must be 1000 characters or fewer." });
    }

    const recipient = await User.findById(toUserId);
    if (!recipient) return res.status(404).json({ message: "Student not found." });

    const existingPending = await ExchangeRequest.findOne({
      status: "pending",
      $or: [
        { fromUser: req.userId, toUser: toUserId },
        { fromUser: toUserId, toUser: req.userId },
      ],
    });
    if (existingPending) {
      return res
        .status(409)
        .json({ message: "A pending request already exists between these students." });
    }

    const request = await ExchangeRequest.create({
      fromUser: req.userId,
      toUser: toUserId,
      message: message || "Would like to exchange skills with you.",
    });
    const populated = await request.populate(["fromUser", "toUser"]);
    res.status(201).json({
      message: "Exchange request sent.",
      request: publicRequest(populated, req.userId),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not send the exchange request." });
  }
}

async function updateRequest(req, res) {
  try {
    const request = await ExchangeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found." });
    if (request.toUser.toString() !== String(req.userId)) {
      return res.status(403).json({ message: "Only the recipient can respond to this request." });
    }

    const { status } = req.body;
    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    request.status = status;
    await request.save();
    const populated = await request.populate(["fromUser", "toUser"]);
    res.json({ message: "Request updated.", request: publicRequest(populated, req.userId) });
  } catch (error) {
    res.status(500).json({ message: "Could not update the request." });
  }
}

module.exports = { listRequests, createRequest, updateRequest };
