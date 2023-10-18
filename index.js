const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')

const conn = require ('./db/conn')
const Cliente = require('./models/Cliente')
const Atividade = require('./models/Atividade')

const PORT = 3000
const hostname = 'localhost'

let log = false

//----------

app.use(express.urlencoded({extend:true}))
app.use(express.json())
app.use(express.static('public'))

//----------

app.engine('handlebars',exphbs.engine())
app.set('view engine', 'handlebars')

//----------

//home

// app.get('/', (req,res)=>{
//     res.send({message: "teste de comunicacao"})
// })

app.get('/', (req,res)=>{
    res.render('home', {log})
})

//login

app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const pesq = await Cliente.findOne(
        {raw: true, where: {email:email, senha:senha}}
        )

    console.log(pesq)
    if(pesq == null){
        console.log('user not found')
        res.status(200).redirect('/')
    }else if(pesq.email == email && pesq.senha == senha){
        console.log('user found')
        log = true
        res.render('home', {log})
    }else{
        res.status(200).redirect('/')
        console.log('user not found')
    }
})

app.get('/login', (req,res)=>{
    res.render('login', {log})
})

//logout

app.get('/logout', (req,res)=>{
    log = false
    res.render('home', {log})
})

//atualiza

app.post('/atualiza', (req,res)=>{
    const atividade = req.body.atividade
    console.log(atividade)
    let msg = 'Não foi possível cadastrar'
    let msg2 = 'Dados cadastrados!'
    if((typeof atividade ==='string')){
        atividade.create({atividade})
        console.log(msg2)
        res.render('atualiza', {msg2})
    }else{
        console.log(msg)
        res.render('atualiza', {msg})
    }
})

app.get('/atualiza', (req,res)=>{
    res.render('atualiza')
})

//----------

conn.sync().then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o BD'+error)
})