const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({

    fname:
    {   type:String,
        required:true
    },

    lname:
    {
        type:String,
        required:true
    },

    
    email:
    {
        type:String,
        required:true,
        unique:true
    },
    
    password:
    {
        type:String,
        required:true
    },

    dateCreated:
    {
        type:Date,
        default:Date.now()
    },

    type:
    {
        type:String,
        default:"User"
    }
        

});

userSchema.pre("save", function(next)
{

    bcrypt.genSalt(10)
    .then((salt)=>{

        bcrypt.hash(this.password,salt)
        .then((encryptPassword)=>{
            this.password = encryptPassword;
            next();
        })
        .catch(err=>console.log(`Error occurred when hashing`))
    })
    .catch(err=>console.log(`Error occurred when salting`));

})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;