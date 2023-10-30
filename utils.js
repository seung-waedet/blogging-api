const mongoose = require('mongoose')

function calculateReadingTime(text) {
    let reading_time = Math.round(text.split(" ").length / 200)
    reading_time = reading_time || 1
    return reading_time
}

function errorHandler(req, res, err) {
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({status: false, message: "Invalid id"})
    }
    next(err)
}

module.exports = {
    calculateReadingTime,
    errorHandler
}