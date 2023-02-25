const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    studentId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    date:{
        type:Date,
        default:Date.now
    }

    
});

module.exports = mongoose.model('Answer',AnswerSchema);