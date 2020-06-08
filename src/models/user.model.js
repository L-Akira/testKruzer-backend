const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    email: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true,
        select:false
    },
    birthday:{
        type: Date,
        required: true
    }
},{
    timestamps: true
});

module.exports = model('User',userSchema);