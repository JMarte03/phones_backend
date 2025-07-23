const express = require('express')
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

const generateId = () => {
    return String(Math.floor(Math.random() * 1000) + 1);
}

app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = persons.find(p => p.name === body.name)

    if (!body.name || !body.phone){
        return response.status(400).json({
            error: 'Must include a name and a phone number'
        })
    } 
    else if (name) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        phone: body.phone
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    /* persons = persons.filter(p => p.id !== id)
    response.status(204).end() */

    //optional
    const person = persons.find(p => p.id === id)
    if (person){
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        return response.status(400).json({
            error: 'person does not exist or has already been deleted'
        })
    }
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})