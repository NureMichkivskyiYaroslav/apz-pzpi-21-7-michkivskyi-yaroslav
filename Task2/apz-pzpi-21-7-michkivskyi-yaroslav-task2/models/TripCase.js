const mongoose = require('mongoose')

const tripCaseSchema = new mongoose.Schema({
    tripId:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Trip'},
    caseId:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Case'},
    price:{type:Number, required: true},
    filling:{type:String, required: true},
    maxTemperature:{type:Number, required: true}
})

const TripCase = mongoose.model('TripCase', tripCaseSchema)

module.exports = TripCase