const File=require("./models/file");
const fs=require('fs');
const connectDB=require('./config/db');
connectDB();

async function deleteData(){
    // 24 hours
    const pastDate=new Date(Date.now()-24*60*60*1000);

    const files=File.find({createdAt:{$lt:pastDate}});

    if(files.length){
        try {
            
            for (const file of files) {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`)
            }
        } catch (error) {
            console.log(`Error while deleting file ${err}`)
        }
    }
    console.log("JOB DONE")
}

deleteData().then(process.exit);