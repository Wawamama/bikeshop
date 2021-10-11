const mongoose = require('mongoose')

const DB = 'mongodb+srv://<DB_INFO>'

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
