import express from "express";
import mongoose from "mongoose";
import { addYears, startOfYear, endOfYear } from "date-fns";

import Cost from "../models/cost";

import { retrieveUserInfo } from "../../helpers";

const router = express.Router();

router.get("/years", (req, res) => {
  const { _id } = retrieveUserInfo(req, res);

  try {
    Cost.aggregate([
      { $match: { userId: _id } },
      { $project: { year: { $year: "$date" } } },
      { $group: { _id: "$year" } }
    ])
      .then(years => res.json({ success: true, years }))
      .catch(error => res.status(500).json({ success: false, error }));
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/:year", (req, res) => {
  let { year } = req.params;
  const { _id } = retrieveUserInfo(req, res);
  const conditions = { userId: _id };
  conditions.date = {
    $gte: startOfYear(new Date(year)),
    $lte: endOfYear(new Date(year))
  };

  try {
    Cost.find(conditions)
      .exec()
      .then(costs => res.json({ success: true, costs }))
      .catch(error => res.status(500).json({ success: false, error }));
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post("/", (req, res) => {
  const { _id } = retrieveUserInfo(req, res);

  const cost = new Cost(
    Object.assign(req.body, { _id: new mongoose.Types.ObjectId(), userId: _id, date: req.body.date })
  );
  cost.save(error => (error ? res.status(500).json({ success: false, error }) : res.json({ success: true, cost })));
});

export default router;
