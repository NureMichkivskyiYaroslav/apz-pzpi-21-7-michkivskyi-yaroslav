const express = require('express')
const mongoose = require('mongoose')
const AdminRouter = require('./routers/AdminRouter')
const ClientRouter = require('./routers/ClientRouter')
const CaseRouter = require('./routers/CaseRouter')
const DriverRouter = require('./routers/DriverRouter')
const FridgeRouter = require('./routers/FridgeRouter')
const TripCaseRouter = require('./routers/TripCaseRouter')
const TripRouter = require('./routers/TripRouter')
const cors = require('cors')
const PORT = process.env.Port || 4000
const {connection} = require('./config.js')
const app = express()
app.use(cors())

app.use(express.json())
app.use("/admin", AdminRouter);
app.use("/client", ClientRouter);
app.use("/driver", DriverRouter);
app.use("/fridge", FridgeRouter);
app.use("/tripCase", TripCaseRouter);
app.use("/case", CaseRouter);
app.use("/trip", TripRouter)

const start = async ()=>{
    try{
        await mongoose?.connect(connection)
        app.listen(PORT, ()=>console.log(`server started on port ${PORT}`))
    } catch (e){
        console.log(e)
    }
}

start()