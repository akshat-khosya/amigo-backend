const mongoose=require('mongoose');
const DiarySchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    title:{
        type:String,
    },
    about:{
        type:String
    },
    content:{
        type:String
    },
    cover:{
        type:String
    },
    color:{
        type:String
    }
    


},{timestamps:true});

module.exports=mongoose.model("Diary",DiarySchema);