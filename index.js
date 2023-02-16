const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 1
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 2
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 3
      },
      {
        "name": "Arto Hellas",
        "number": "2132138",
        "id": 4
      }
]

// Hakee kaikki kontaktit
app.get('/api/persons', (req, res) => {
    res.send(persons)
})

// Hakee tiedot infosivulta
app.get('/info', (req, res) => {
    const date = new Date()
    const numberOfPersons = persons.length
   
    res.send(`<p>Phonebook has info for ${numberOfPersons} people</p>` + date)
})

// Hakee kontaktin id:llä
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

// Poistaa kontaktin
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// Lisää uuden kontaktin
app.post('/api/persons', (req, res) => {
    const body = req.body
    const id = Math.floor(Math.random() * 1001)

    // Jos puuttuu nimi tai numero tai nimi ei ole uniikki
    const checkIfNameExists = persons.find(p => p.name.toLowerCase() == body.name.toLowerCase())
    if (!body.name || !body.number || checkIfNameExists) {
        return res.status(400).json({
            error: "content missing or name is not unique"
        })
    }

    // Luodaan uusi kontakti annetuista tiedoista
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    // Lisätään kontakti listaan ja palautetaan lisätty kontakti
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
