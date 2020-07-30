const Hapi = require('@hapi/hapi')
const HapiSwagger = require('hapi-swagger')
const Hapijwt = require('hapi-auth-jwt2')
const Inert = require('inert')
const Vision = require('vision')

const Context = require('./src/db/strategy/base/ContextStrategy')
const Postgres = require('./src/db/Postgres/Postgres')
const schema = require('./src/db/Postgres/schemas/schemaPostgres')
const schemLogin = require('./src/db/Postgres/schemas/schemaLogin')

const privateRoutes = require('./src/Routes/PrivateRoutes')
const publicRoutes = require('./src/Routes/PublicRoutes')

function mapMethods(instance, methods) {
   
    return methods.map(metodo=>instance[metodo]())
}

const KEY = process.env.KEY 

const init = async ()=>{


    const conn = await Postgres.Connect()
    
    const model = await Postgres.defineModel(conn, schema) 
    
    const modelLogin = await Postgres.defineModel(conn, schemLogin)

    const DbPostgres = new Context(new Postgres(conn, model))

    const DbPostgresLogin = new Context( new Postgres(conn, modelLogin))
    
   
    const Server = Hapi.Server({
        port: process.env.PORT || 5000    
    })

    const Swagger = {
        info:{
            title: 'Api de Usuários',
            version: 'v1.0'
        }
    }

    await Server.register([
        Hapijwt,
        Inert,
        Vision,
        {
            
            plugin: HapiSwagger,
            options:Swagger
            
        }
    ])

    Server.auth.strategy(
        'jwt',
        'jwt',
        {
          key: KEY,
          validate: async (dados, request)=>{
            //console.log('REQUEST', dados)
             const result = await DbPostgres.search({
                email : dados.email,
                id : dados.id
             })
            //console.log('RESULT', result)
            if(!result)return{isValid : false}

            return{
                 isValid : true
            }
          }  
        }
    )
    
    Server.auth.default('jwt')

    await Server.start();

    Server.route([
        ...mapMethods(new privateRoutes(DbPostgres), privateRoutes.methods()),
        ...mapMethods(new publicRoutes(DbPostgresLogin, KEY), publicRoutes.methods())
    ])
    
    console.log('Servidor está em execução', Server.info)

    return Server
  
}

process.on('unhandledRejeiction', (error)=>{
    console.log('Error', error)
    process.exit(1)
})

module.exports = init()