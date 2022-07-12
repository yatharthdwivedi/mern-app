const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { json } = require("express");
var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fetch = require("../middleware/fetch");
router.use(express.json());

// Create a user using : POST "/api/auth/createuser" . No login required

router.get("/register", function (req, res) {
  res.send("hey");
});

router.post(
  "/register",
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (user) {
        success = false;
        return res.status(400).json({ error: "This email exists" });
      }
      const saltRounds = 10;
      let secPass = await bcrypt.hash(req.body.password, saltRounds);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authToken, success });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error");
    }
  }
);

// Authenticate a user using : POST "/api/auth/login" . No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors then return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({
            error: "Please try to login again with correct credentials",
          });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            error: "Please try to login again with correct credentials",
          });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error");
    }
  }
);

// // Get logged in user details using : POST "/api/auth/getuser" . No login required

router.post("/fetch", fetch, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.send(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

module.exports = router;
