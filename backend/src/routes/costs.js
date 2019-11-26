import express from "express"
import Cost from "../models/cost"
import mongoose from "mongoose"

const router = express.Router()

router.get("/", (req, res) => {
  Cost.find()
    .exec()
    .then(costs => res.json({ success: true, costs }))
    .catch(error => res.status(500).json({ success: false, error }))
})

router.post("/", (req, res) => {
  const cost = new Cost(Object.assign(req.body, { _id: new mongoose.Types.ObjectId() }))

  cost.save(error => (error ? res.status(500).json({ success: false, error }) : res.json({ success: true, cost })))
})

export default router
