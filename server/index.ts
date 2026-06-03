import express from 'express'
import cors from 'cors'
import { validateOrder, Order } from './orderLogic'

const app = express()
app.use(cors())
app.use(express.json())

const orders: Order[] = []
let nextOrderId = 1

app.get('/api/menu', (req, res) => {
  res.json([{ id: 1, name: 'Turkey Sandwich', price: 12 }])
})

app.post('/api/orders', (req, res) => {
  const check = validateOrder(req.body)
  if (!check.valid) {
    return res.status(400).json({ error: check.error })
  }
  const newOrder: Order = { ...req.body, id: nextOrderId++ }
  orders.push(newOrder)
  res.status(201).json(newOrder)
})

app.get('/api/orders', (req, res) => {
  res.json(orders)
})

app.get('/api/location/:zip', async (req, res) => {
  const zip = req.params.zip
  if (!/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: 'Invalid zip code format' })
  }
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

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001')
})
