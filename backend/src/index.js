import express from "express"
import path from "path"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"

import costs from "./routes/costs"

dotenv.config({
  path: path.resolve("../.env")
})
require("./db")
const PORT = process.env.PORT || 4000

const app = express()
app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({})
  }
  next()
})

app.use("/api/costs", costs)

app.use((req, res, next) => {
  const error = new Error("Not found")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.use(bodyParser())

app.use(cors())

app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}...`)
})
