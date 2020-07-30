const assert = require('assert')

const Context = require('../src/db/strategy/base/ContextStrategy')
const schemaPostgres = require('../src/db/Postgres/schemas/schemaPostgres')
const postgres = require('../src/db/Postgres/Postgres')

const USER = {
    name:'Willian',
    username:'WillianCarlos',
    email:'willian@teste.com'
}

const USER_UPDATE = {
    name:'Willian Carlos',
    username:'WillianCarlos',
    email:'willian@teste.com'
}

let DbPostgres = {}
describe('Testes Banco de Dados', function(){
    this.beforeAll(async()=>{
       
        const conn = await postgres.Connect()
       
        const modelPostgres = await postgres.defineModel(conn, schemaPostgres)
     
        DbPostgres = new Context(new postgres(conn, modelPostgres))
        
    })
    
    it('IsConnect, Postgres', async function(){
        this.timeout(1000)
        const result = await DbPostgres.isConnect()
        console.log('Result', result)
        assert.ok(result, true)
        
    })

    it('INSERT, Postgres', async ()=>{
        const {dataValues:{name, username, email}} = await DbPostgres.create(USER)
        assert.deepEqual({name, username, email}, USER)
    })


    it('LISTER, Postgres', async()=>{
        const[dados] = await DbPostgres.search(USER)
        
        delete dados.id
        assert.deepEqual(dados, USER)
        //console.log('return', dataValues)
    })

    it('UPDATE, Postgres', async()=>{
        const [returnId] = await DbPostgres.search(USER)
       
        const result = await DbPostgres.update(returnId.id, USER_UPDATE)
        assert.ok(result, 1)
        
    })

    it('DELETE, Postgres', async ()=>{
        const [returnId] = await DbPostgres.search(USER_UPDATE)

        const result = await DbPostgres.delete(returnId.id)

        assert.ok(result, 1)
    })


})