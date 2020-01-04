import express from "express";
import mongoose from "mongoose";
import { addYears, startOfYear } from "date-fns";

import Cost from "../models/cost";

import { retrieveUserInfo } from "../../helpers";

const router = express.Router();

router.get("/", (req, res) => {
  let { year } = req.params;
  const { _id } = retrieveUserInfo(req, res);
  const conditions = { userId: _id };
  if (!year) {
    year = startOfYear(new Date());
  }
  conditions.date = {
    $gte: year,
    $lt: addYears(new Date(year), 1)
  };

  try {
    Cost.find()
      .exec()
      .then(costs => res.json({ success: true, costs }))
      .catch(error => res.status(500).json({ success: false, error }));
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

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

router.post("/", (req, res) => {
  const { _id } = retrieveUserInfo(req, res);

  const cost = new Cost(
    Object.assign(req.body, { _id: new mongoose.Types.ObjectId(), userId: _id, date: req.body.date })
  );
  cost.save(error => (error ? res.status(500).json({ success: false, error }) : res.json({ success: true, cost })));
});

export default router;
