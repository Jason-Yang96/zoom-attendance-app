'use strict'

require('./config')

const http = require('http')
const express = require('express')
const morgan = require('morgan')

const middleware = require('./middleware')

const zoomAppRouter = require('./api/zoomapp/router')
const zoomRouter = require('./api/zoom/router')
const thirdPartyOAuthRouter = require('./api/thirdpartyauth(notused)/router')
// Create app
const app = express() //express 서버 자체를 만들고 있음

// Set view engine (for system browser error pages)
app.set('view engine', 'pug')

// Set static file directory (for system browser error pages)
app.use('/', express.static('public'))

// Set universal middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(middleware.session)
app.use(middleware.setResponseHeaders)

// Zoom App routes
app.use('/api/zoomapp', zoomAppRouter)
if (
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET &&
    process.env.AUTH0_ISSUER_BASE_URL
) {
    app.use('/api/auth0', thirdPartyOAuthRouter)
} else {
    console.log('Please add Auth0 env variables to enable the /auth0 route')
}

app.use('/zoom', zoomRouter)

// check the ngrok connection
// get 메서드 요청이 들어왔음 => Hello Zoom Apps 메시지 내보냄
app.get('/hello', (req, res) => {
    res.send('Hello Zoom Apps!')
})

// Handle 404: 404 오류를 처리하는 미들웨어를 직접 추가함.
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

// Handle errors (system browser only)
app.use((error, req, res) => {
    res.status(error.status || 500)
    res.render('error', {
        title: 'Error',
        message: error.message,
        stack: error.stack,
    })
})

// Start express server
http.createServer(app).listen(process.env.PORT, () => {
    console.log('Zoom App is listening on port', process.env.PORT)
})
