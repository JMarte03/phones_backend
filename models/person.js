const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to...')

mongoose.connect(url)
  .then(result => console.log('connected to MongoDB'))
  .catch(error => {
    console.log('Error connecting to MongoDB', error.message);
  })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    phone: {
        type: String,
        validate: {
            validator: function(v){
                return /^\d{2}-\d{6,}$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('Person', personSchema)