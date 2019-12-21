import express from "express"
import User from "../models/user"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router()

router.get("/", (req, res) => {
  User.find()
    .exec()
    .then(user => res.json({ success: true, user }))
    .catch(error => res.status(500).json({ success: false, error }))
})

router.post("/signin", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email }).exec()
  if (!existingUser) {
    res.status(400).json({ success: false, error: "You are not registered yet. Please, sign up :)" })
  }
  const { hash, _id, email } = existingUser

  const isPasswordValid = await bcrypt.compare(req.body.password, hash)
  if (!isPasswordValid) {
    res.status(400).json({ success: false, error: "Password is incorrect" })
  }
  res.json({
    success: true,
    user: existingUser,
    jwt: jwt.sign({ email, _id }, process.env.PRIVATE_RSA)
  })
})

router.post("/signup", async (req, res) => {
  const { email, password } = req.body
  const existingUser = await User.findOne({ email: email }).exec()
  if (existingUser) {
    res.status(400).json({ success: false, error: "You are already registered. Please, use log in :)" })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const newUser = new User({ _id: new mongoose.Types.ObjectId(), email: email, hash })
  const result = await newUser.save()
  return result.error
    ? res.json({ success: false, error: result.error })
    : res.json({
        success: true,
        user: { email, _id: newUser._id },
        jwt: jwt.sign({ email, _id: newUser._id }, process.env.PRIVATE_RSA)
      })
})

export default router
