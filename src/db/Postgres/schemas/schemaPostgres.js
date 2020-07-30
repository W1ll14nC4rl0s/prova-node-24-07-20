const Sequelize = require('sequelize')

const model = {
    nome:'ModelUser',
    schema:{
        id:{
            type:Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:Sequelize.STRING,
            required: true
        },
        username:{
            type:Sequelize.STRING,
            required:true
        },
        email:{
            type:Sequelize.STRING,
            required:true
        }
    },
    options:{
        tableName:'tb_user',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = model