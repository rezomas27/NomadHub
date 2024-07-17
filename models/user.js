const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    firstName: {
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required:true
    },
    Email:{
        type: String,
        required:true
    },
    Password:{
        type: String,
        required: true
    }
}, {timestamps:true});

//get the token
userSchema.methods.jwtGenerateToken = function() {
    const expiresIn = process.env.EXPIRE_TOKEN || '1h'; // Default to 1 hour
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn });
};


const User = mongoose.model('User',userSchema);

module.exports=User;