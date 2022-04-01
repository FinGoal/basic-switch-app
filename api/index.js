// IMPORT
// NODE MODULES
require('dotenv').config()
import routes from './routes'
const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)

export default {
  path: '/api',
  handler: app,
}
