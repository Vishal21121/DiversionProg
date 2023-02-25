const Answer = require('../models/Anwers')
const express = require('express')

const router = express.Router();

router.post('/add',async(req,res)=>{
    const {question,answer} = req.body;
    const val = await Answer.create({question,answer});
    console.log(val)
    res.status(200).json({success:true})
})

module.exports = router

