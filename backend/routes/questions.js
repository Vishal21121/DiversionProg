const express = require('express')
const Question = require('../models/Questions')

const router = express.Router();

router.get('/get',async(req,res)=>{
    const data =  await Question.find({})
    // console.log(val)
    res.status(200).json({success:true,data:data})
})

module.exports = router