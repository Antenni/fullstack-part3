const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()
const {response} = require('express')

const dotenv = require("dotenv");

dotenv.config();

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('POST',(req, res) => {
  JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :POST"))

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    },
    { 
      id: 5,
      name: "Lloyd Christmas", 
      number: "555-123123"
      },
      { 
        id: 6,
        name: "Mike Lowrey", 
        number: "555-69696969"
        }
]

  app.get('/api/persons', (req, res) => {
    res.json(persons)
    Person.find({}).then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
  })

  app.get('/info',(req, res) => {
  const info = `Phonebook has info for ${persons.length} people.`
  const date = new Date()
  res.send(`<p>${info}</p>${date}`)
  })

  app.get('/api/persons/:id',(req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
      if (person){
         res.json(person)
         }
           else
         {
         res.status(404).end()
        }

        })
      .catch(error => next(error))
})

    app.delete('/delete/persons/:id',(req, res, next) => {
      Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
    
    })

      app.post('/api/persons', (req, res) => {
        const id = Math.floor(Math.random() * 999)
        const body = req.body

        if(!body.name || !body.number) 
        {
          return res.status(400).json
          ({
            error: 'name or number is missing'
          })
        }
        if (!persons.every(person => person.name !== body.name)) 
        {
            return res.status(400).json
            ({
              error: 'name must be unique'
            })
        }

          const person = {
            id: id,
            name: body.name,
            number: body.number
            }

            person.save().then(personSaved => {
              res.json(personSaved)
            })
            })

            const errorHandler = (error, request, response, next) => {
              console.log(error.message)
            
              if (error.name === 'CastError') {
                return response.status(400).send({ error: 'malformatted id' })
              }
              else if (error.name === 'ValidationError') {
                return response.status(400).send({ error: error.message })
              }
            
              next(error)
            }
            
            app.use(errorHandler)

            const PORT = process.env.PORT
            app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            })