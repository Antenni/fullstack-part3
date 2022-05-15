const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

app.use(morgan('tiny'))

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
      }
]

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info',(req, res) => {
  const info = `Phonebook has info for ${persons.length} people.`
  const date = new Date()
  res.send(`<p>${info}</p>${date}`)
  })

  app.get('/api/persons/:id',(req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id.toString() === id)
        
    if(person)
    {
      res.send(`<p>${person.name}</p><p>${person.number}</p>`)
    }
    else {
      res.status(404).send('ID not found');
    }
    })

    app.delete('/delete/persons/:id',(req, res) => {
      const id = Number(req.params.id)
      persons = persons.filter(person => person.id !== id)
      res.status(204).send('Success')
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

            persons = persons.concat(person)
            res.json(person)
            })

      const PORT = 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
        })