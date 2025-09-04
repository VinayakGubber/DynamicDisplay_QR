const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { ReturnDocument } = require("mongodb");

const router = express.Router();

//A I  -   G E N E R A T E D
/* ── Helper: protect routes ───────────────────── */
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ success: false, message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/* ── POST /api/auth/register ─────────────────────*/

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ success: false, message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/* ── POST /api/auth/register ───────────────────── */
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("username").matches(/^[a-zA-Z0-9_]{3,20}$/),
    body("password").isLength({ min: 6 }),
    body("termsAccepted").equals("true"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { email, username, password } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res
        .status(400)
        .json({ success: false, message: "Email or username exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashed,
      termsAccepted: true,
    });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(201).json({ success: true, token });
  }
);
