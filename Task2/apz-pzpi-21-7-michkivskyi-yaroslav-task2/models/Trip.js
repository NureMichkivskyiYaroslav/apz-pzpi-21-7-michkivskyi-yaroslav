const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    status:{type:String, required: true},
    start:{type:Date, required: true},
    finishPlan:{type:Date, required: true},
    finishFact:{type:Date, required: false},
    driverId:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Driver'},
    clientId:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Client'},
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip