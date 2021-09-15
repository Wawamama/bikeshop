const mongoose = require('mongoose')

const DB = 'mongodb+srv://wawa:kornmuse@cluster0.jj3n6.mongodb.net/weatherapp?retryWrites=true&w=majority'

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
 }

mongoose.connect(DB, options)
    .then( () => {
    console.log('DB connection successful')
    })
    .catch(err => console.log(err))