const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    status:{type:String, required: true, default:"started"},
    start:{type:Date, required: true, default: new Date()},
    finishPlan:{type:Date, required: true},
    finishFact:{type:Date, required: false},
    driverId:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Driver'},
    clientId:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Client'},
    fridgeId:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Fridge'}
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip