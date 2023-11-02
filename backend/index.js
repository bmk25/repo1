const express = require("express")
const app =express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const multer = require("multer");


// importing routes 
const authRoute = require('./routes/auth.js') 

const dotenv = require('dotenv') 
// const fileUpload = require('express-fileupload') 

dotenv.config();

app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Credentials",true)
    next()
})


app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
}))
app.use(cookieParser())


app.use("/api/auth",authRoute)

const PORT = process.env.PORT || 8800


app.listen(PORT,(req,res)=>{
    console.log(`server running on ${PORT}`)
})
