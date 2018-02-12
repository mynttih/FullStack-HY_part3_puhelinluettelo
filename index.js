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

app.get('/', (req, res) => {
    res.send('<h1>Persons backend</h1>')
})

app.get('/api/persons', (req, res) => {
    Person
        .find({}, {__v: 0})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id, {__v: 0})
        .then(person => {
            res.json(person)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            const date = new Date()
            res.send('<p>puhelinluettelossa ' + persons.length + ' henkilön tiedot</p>'
                + '<p>' + date + '</p>')
        })
        .catch(error => {
            console.log(error)
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(body.name === undefined) {
        return res.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return res.status(400).json({error: 'number missing'})
    }

    Person
        .find({})
        .then(persons => {
            if (persons.some(person => person.name === body.name)) {
                res.status(400).send({ error: 'person already exists' })
            } else {
                const person = new Person ({
                    name: body.name,
                    number: body.number
                })
            
                person
                    .save()
                    .then(person => {
                        res.json(person)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
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

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const personUpdate = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, personUpdate, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformed name'})
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})