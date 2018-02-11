const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length]' + ' - ' + ':response-time'))

const generateId = (max) => {
    return Math.floor(Math.random() * max)
}

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    },
    {
        "name": "Henri Mynttinen",
        "number": "040 3333333",
        "id": 5
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Persons backend</h1>')
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(person)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/info', (req, res) => {
    const count_persons = persons.length
    const date = new Date()
    res.send('<p>puhelinluettelossa ' + count_persons + ' henkilön tiedot</p>'
                + '<p>' + date + '</p>')
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(body.name === undefined) {
        return res.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return res.status(400).json({error: 'number missing'})
    }

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    persons = persons.concat(person)

    person
        .save()
        .then(person => {
            res.json(person)
        })
        .catch(error => {
            console.log(error)
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformed id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})