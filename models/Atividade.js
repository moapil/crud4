const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Atividade = db.define('produto', {
    atividade: {
        type: DataTypes.STRING(40)
    }
},{
    createdAt: false,
    updatedAt: false
})



// Atividade.sync({force:true})
module.exports = Atividade