const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
    question:{
        type:String,
        required:true
    },
    opt1:{
        type:String,
        required:true
    },
    opt2:{
        type:String,
        required:true
    },
    opt3:{
        type:String,
        required:true
    },
    opt4:{
        type:String,
        required:true
    },
    
});

module.exports = mongoose.model('Question',QuestionSchema);