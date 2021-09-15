const mongoose = require('mongoose')

const bikeSchema = mongoose.Schema({
    name: {
        type: String,
        require:[true, 'A bike must have an name' ]
    },
    img: {
        type: String,
        require:[true, 'A bike must have an image' ]
    },
    price: {
        type: Number,
        require:[true, 'A bike must have an price' ]
    },
    mea: Boolean,
    deliveries: [String]
})

const Bike = mongoose.model('Bike', bikeSchema)

module.exports = Bike