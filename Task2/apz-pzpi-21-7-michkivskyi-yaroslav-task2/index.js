const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.Port || 4000
const {connection} = require('./config.js')
const app = express()
app.use(cors())

app.use(express.json)

const start = async ()=>{
    try{
        await mongoose?.connect(connection)
        app.listen(PORT, ()=>console.log(`server started on port ${PORT}`))
    } catch (e){
        console.log(e)
    }
}

start()