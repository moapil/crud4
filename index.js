const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')

const conn = require ('./db/conn')
const Cliente = require('./models/Cliente')
const Atividade = require('./models/Atividade')

const PORT = 3000
const hostname = 'localhost'

//----------

app.use(express.urlencoded({extend:true}))
app.use(express.json())
app.use(express.static('public'))

//----------

app.engine('handlebars',exphbs.engine())
app.set('view engine', 'handlebars')

//----------

conn.sync().then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o BD'+error)
})