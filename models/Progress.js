const mongoose = require('mongoose');


const progressSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    }
}, { timestamps: true })

const Progress = mongoose.model('Progress', progressSchema)
module.exports ={ Progress }