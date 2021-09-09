const express=require("express");
const app=express();
require('dotenv').config();
const connectDB =require('./config/db')
const path=require('path');
const cors=require("cors");

// cors
const corsOptions={
    origin:process.env.ALLOWED.CLIENTS.split(',')
}

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json())


connectDB()

const PORT=process.env.PORT || 3000;
// Template engine
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs');


// Routes
app.use('/api/files',require("./routes/files"));
app.use('/files',require("./routes/show"));
app.use('/files/download',require("./routes/download.js"));


app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})