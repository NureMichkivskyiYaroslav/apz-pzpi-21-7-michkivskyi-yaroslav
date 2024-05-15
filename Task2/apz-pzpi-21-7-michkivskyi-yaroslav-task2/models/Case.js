const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
    capacity:{type:String, required: true},
    inventoryNumber:{type:Number, required: true}
})

const Case = mongoose.model('Case', caseSchema)

module.exports = Case