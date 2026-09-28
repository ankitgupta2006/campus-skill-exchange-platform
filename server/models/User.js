const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    college: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    skills: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    resetTokenHash: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
