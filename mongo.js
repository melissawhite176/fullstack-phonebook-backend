const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://phonebook:${password}@cluster0-klm2a.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

//**show all phonebook entries if password is the only parameter provided**
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

//**add person**
// const person = new Person({
//     name: 'Joanna Goodman',
//     number: '444-555-6666',
// })


//**add person using command line** 
//**Notice that if the name contains whitespace characters, it must be enclosed in quotes**
//**example: "Maggie Nelson" 333-444-5555**

if (process.argv.length === 5) {

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
    name: name,
    number: number,
})

person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
})
}
