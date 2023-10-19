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
        res.render('home', {log, nome:pesq.nome})
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

//cadastra

app.post('/cadasrea', (req,res)=>{
    const atividade = req.body.atividade
    console.log(atividade)
    let msg = 'Não foi possível cadastrar'
    let msg2 = 'Dados cadastrados!'
    if((typeof atividade ==='string')){
        Atividade.create({atividade})
        console.log(msg2)
        res.render('cadasrea', {msg2})
    }else{
        console.log(msg)
        res.render('cadastra', {msg}, {log})
    }
})

app.get('/cadastra', (req,res)=>{
    res.render('cadastra', {log})
})

//atualiza

app.post('/atualiza', async (req,res)=>{
    const atividade = req.body.atividade
    const atividade2 = req.body.atividade2
    console.log(atividade,atividade2)
    let msg = 'Tipo de dados inválidos, digite novamente'
    let msg2 = 'Dados cadastrados!'
    let msg3 = 'Produto não encontrado na base de dados para atualizar'

    const dado_atividade = await Atividade.findOne({raw:true, where: {atividade:atividade}})
    console.log(dado_atividade)

    if(dado_atividade != null){
        const dados = {
            atividade: atividade2,
        }
        await Atividade.update(dados, {where: {atividade:atividade}})
            console.log(msg2)
            res.render('atualiza', {msg2, log})
    }else{
        console.log(msg)
        res.render('atualiza', {msg, log})
    }
    
    // res.redirect('/atualiza')
})

app.get('/atualiza', (req,res)=>{
    res.render('atualiza', {log})
})

//deleta

app.post('/deleta', async (req,res)=>{
    const id = Number(req.body.id)
    let msg = 'atividade não encontrada'
    let msg2 = 'atividade excluída'
    const idAtiv = await Atividade.findOne({raw:true, where: {id:id}})
    console.log(idAtiv)
    console.log(idAtiv.id)
    if(idAtiv != null){
        Atividade.destroy({where: {id:id}})
        res.render('deleta', {log, msg2})
    }else{
        res.render('deleta', {log, msg})
    }
})

app.get('/deleta', (req,res)=>{
    res.render('deleta', {log})
})

//lista

app.get('/lista', async (req,res)=>{
    const dados = await Atividade.findAll({raw:true})
    console.log(dados)
    res.render('lista', {log, valores: dados})
})

//----------

conn.sync().then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o BD'+error)
})