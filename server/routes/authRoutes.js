const express = require("express");
const {
  register,
  login,
  me,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  deleteAccount,
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const r = express.Router();
r.post("/register", register);
r.post("/login", login);
r.post("/forgot-password", requestPasswordReset);
r.post("/reset-password", resetPassword);
r.get("/me", auth, me);
r.put("/profile", auth, updateProfile);
r.delete("/account", auth, deleteAccount);
module.exports = r;
