require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (req, res) =>  { 
    return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person){
            return response.json(person)
        }
        else {
            response.status(404).end()
        }
      })
      .catch (error => {
        next(error)
      })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Person ({
        name: body.name,
        phone: body.phone
    })
    
    person.save()
      .then(savedPerson => {
          response.json(savedPerson)
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch (error => {
        next(error)
      }) 
})

app.put('/api/persons/:id', (request, response, next) => {
    const phone = request.body.phone
    Person.findById(request.params.id)
      .then(person => {
        if (!person) {
            return response.status(404).end()
        }
        person.phone = phone
        return person.save().then((updatedPerson) => {
            response.json(updatedPerson)
        })
      })
      .catch (error => {
        next(error)
      }) 
})

app.get('/info', (request, response) => {
    const today = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${today}</p>`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)

const errorHandler = (error, resquest, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError'){
        return response.status(400).send({
            error: 'malformatted id'
        })
        next(error)
    }
    else if (error.name === 'ValidationError'){
      return response.status(400).json({
        error: error.message
      })
    }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})