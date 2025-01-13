const { renderLoginForm, login, logout } = require('../controllers/auth')
const { Router } = require('express')
const authRouter = Router()

authRouter.get('/login', renderLoginForm)

authRouter.post('/login', login)

authRouter.post('/logout', logout)

module.exports = authRouter