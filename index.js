const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const mysql = require('mysql2');
const userRoutes = require('./server/routes/user.js')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
// app.use(express.json())
app.use(bodyParser.json())

// use static file
app.use(express.static('public'))

// templating engine
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')

// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

// conn db
pool.getConnection((err, conn) => {
    if(err) console.log(err)
    console.log('Connected as ID ' + conn.threadId)
})

app.use('/', userRoutes)

app.listen(PORT, () => {
    console.log('listening on port '+PORT)
})