import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
// request from user and response back to user

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // The bcrypt.genSalt() function is an asynchronous function that generates a salt. 
    // A salt is a random value used in the hashing process to ensure that
    //  even if two users have the same password, their hashed passwords will be different.

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    //     Math.random() generates a pseudo-random floating-point number in the range [0, 1), 
    //     where 0 is inclusive, and 1 is exclusive.
    //     Multiplying Math.random() by 10000 scales the random number to be in the range [0, 10000).
    //     Math.floor() rounds down the result to the nearest integer, ensuring that the final value is an integer.
    //     The result of this expression is a random integer between 0 (inclusive) and 10000 (exclusive).


    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
