const mongoose = require('mongoose')

const citySchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'A city must have a name'],
            unique: true
        },
        description: String,
        mintemp: String,
        maxtemp: String,
        url: String
    }
)

const City = mongoose.model('City', citySchema)

module.exports = City;