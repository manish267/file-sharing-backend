const mongoose=require('mongoose');

function connectDB() {
    // Database connection 🥳
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true  }).then(()=>console.log("Database connected")).catch((err)=>console.log(err))
    
}
module.exports=connectDB;