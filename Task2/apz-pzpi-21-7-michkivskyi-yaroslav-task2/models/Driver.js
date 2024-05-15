const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    phone:{type:String, required: true},
    name:{type:String, required: true},
})

const Driver = mongoose.model('Driver', driverSchema)

module.exports = Driver