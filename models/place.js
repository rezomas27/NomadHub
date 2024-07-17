const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    Name: {
        type: String,
        required:true
    },
    Location: {
        type: String,
        required:true
    },
    Type:{
        type: String,
        required:true
    },
    PlaceID:{
        type: String,
        required: true
    }
}, {timestamps:true});

const Place = mongoose.model('Place',placeSchema);

module.exports=Place;