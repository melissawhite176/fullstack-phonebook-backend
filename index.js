require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const morgan = require('morgan')
const { request, response } = require('express')
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-543235",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234234",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-632122",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    const info = persons.length
    const date = new Date()
    console.log(typeof info)
    res.send(`Phonebook has info for ${info} people<br><br>
    ${date}`)

})

//fetch all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body
    const nameMatch = persons.find(p => p.name === name)

    if (nameMatch) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    if (!name) {
        return response.status(400).json({
            error: 'missing name'
        })
    }
    if (!number) {
        return response.status(400).json({
            error: 'missing number'
        })
    }

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)


const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)