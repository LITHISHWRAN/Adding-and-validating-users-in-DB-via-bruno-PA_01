const express = require('express');
const { resolve } = require('path');
const mongoose = require("mongoose"); 
require("dotenv").config();
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());  

mongoose.connect(process.env.MONGO_URL)
.then(() => (console.log("Connected to MongoDB")))
.catch((error) => console.log(error));



app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
