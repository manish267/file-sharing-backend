const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const File=require('./../models/file');
const {v4:uuidv4}=require("uuid");

let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}- ${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null,uniqueName);
    }
})

let upload =multer({storage,limits:{fileSize:2048*1024*1024}}).single('myfile');

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      console.log(req.file)
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        console.log(response)
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      });
});

router.post("/send",async (req,res)=>{
    const {uuid,emailTo,emailFrom}=req.body;
    // Validate request
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:"All fields are required"});
    }
    // Get data from database
    const file=await File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({error:"Email already sent"});
    }
    file.sender=emailFrom;
    file.recceiver=emailTo;
    
    const response=await file.save();

    // Send Email
    const sendMail=require("../services/emailService");
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:"File sharing app",
        text:`${emailFrom} shared a file with you.`,
        html:require("./../services/emailTemplate")({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000000)+'MB',
            expires:'24 hrs'
        })

    })
    return res.send({success:true})
})

module.exports=router;