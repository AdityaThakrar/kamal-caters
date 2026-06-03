import express from 'express'
import cors from 'cors'
import { validateOrder } from './orderLogic'

const app = express()
app.use(cors())
app.use(express.json())

const orders: any[] = []

app.get('/api/menu', (req, res) => {
  res.json([{ id: 1, name: 'Turkey Sandwich', price: 12 }])
})

app.post('/api/orders', (req, res) => {
  const check = validateOrder(req.body)
  if (!check.valid) {
    return res.status(400).json({ error: check.error })
  }
  const order = req.body
  order.id = orders.length + 1
  orders.push(order)
  res.status(201).json(order)
})

app.get('/api/orders', (req, res) => {
  res.json(orders)
})

app.get('/api/location/:zip', async (req, res) => {
  const zip = req.params.zip
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`)
    if (!response.ok) {
      return res.status(404).json({ error: 'Zip code not found' })
    }
    const data = await response.json()
    const place = data.places[0]
    res.json({ zip, city: place['place name'], state: place['state abbreviation'] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to look up location' })
  }
})

// Simulates calling an LLM to suggest menu items
function fakeLLMResponse(cuisine: string, budget: number): string {
  // A real LLM would return text; we return a JSON string to mimic that
  return JSON.stringify([
    { name: `${cuisine} Sampler Platter`, price: budget - 2 },
    { name: `${cuisine} House Special`, price: budget - 4 },
    { name: `${cuisine} Side & Drink`, price: budget - 8 },
  ])
}

app.post('/api/suggest-menu', (req, res) => {
  const { cuisine, budget } = req.body
  if (!cuisine || !budget) {
    return res.status(400).json({ error: 'Must include cuisine and budget' })
  }

  const rawText = fakeLLMResponse(cuisine, budget)

  try {
    const suggestions = JSON.parse(rawText)
    res.json({ cuisine, budget, suggestions })
  } catch (err) {
    res.status(500).json({ error: 'LLM returned malformed data' })
  }
})

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001')
})
