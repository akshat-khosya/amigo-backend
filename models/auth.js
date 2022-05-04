const mongoose=require('mongoose');
const AuthSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    username:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    
    emailVerification:{
        type:Boolean,
        default:false
    },
    


},{timestamps:true});

module.exports=mongoose.model("Auth",AuthSchema);