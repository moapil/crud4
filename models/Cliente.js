const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Cliente = db.define('cliente', {
    nome: {
        type: DataTypes.STRING(40)
    },
    idade: {
        type: DataTypes.INTEGER(3)
    },
    email: {
        type: DataTypes.STRING(50)
    },
    senha: {
        type: DataTypes.STRING(50)
    }
},{
    createdAt: false,
    updatedAt: false
})

// Cliente.sync({force:true})
module.exports = Cliente