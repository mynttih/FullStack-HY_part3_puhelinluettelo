const mongoose = require('mongoose')

const url = 'mongodb://hemyntti:joel91@ds229008.mlab.com:29008/fullstack-hy-puhelinluettelo'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person