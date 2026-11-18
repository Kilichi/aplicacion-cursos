const mongoose = require("mongoose")
exports.connectarMongoDB = async () => mongoose.connect(process.env.MONGODB_URI)
