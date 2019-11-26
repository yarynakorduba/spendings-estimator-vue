const mongoose = require("mongoose")

const { MONGO_URL } = process.env

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.once("open", function() {
  console.log("DB connection established successfully")
})
