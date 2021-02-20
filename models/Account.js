const mongoose = require('mongoose');


const accountSchema = mongoose.Schema({
    username: {
        type: String,
        
        default: []
    },
    
    password: {
        type: String,
        default: []
    }
}, { timestamps: true })

const Account = mongoose.model('Account', accountSchema)
module.exports ={ Account }