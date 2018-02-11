const mongoose = require('mongoose')

const url = 'mongodb://hemyntti:<password>@ds229008.mlab.com:29008/fullstack-hy-puhelinluettelo'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length > 2) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
    })

    person
        .save()
        .then(result => {
            console.log('lisätään henkilö ' + process.argv[2] + ' numero ' + process.argv[3] + ' luetteloon')
            mongoose.connection.close()
        })
        .catch(error => {
            console.log('henkilön lisääminen epäonnistui')
            console.log(error)
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(persons => {
            console.log('puhelinluettelo:')
            persons.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
        .catch(error => {
            console.log(error)
            mongoose.connection.close()
        })
}