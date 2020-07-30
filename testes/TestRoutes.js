const Assert = require('assert')

const api = require('../Api')

const USER_POST={
    name:'João Victor',
    username:'JoaoVictor_123',
    email: 'victor@1234.com'
}

let app = {}

let headers = {
    authorization : ''
}
describe('Suite de Testes API', function() {
    this.beforeAll(async()=>{
        app = await api;

        const KEY = await app.inject({
            method: 'POST',
            url:'/login',
            payload:{
                email:'email@teste.com',
                password: "12345"
            }
        })
        
        token = JSON.parse(KEY.payload)
        headers.authorization = token.token
        
    })

    it('Teste method POST', async()=>{
        
        const result = await app.inject({
            method: 'POST',
            headers,
            url:'/users',
            payload: USER_POST
            
        })
       
        const {message} = JSON.parse(result.payload) 
        Assert.deepEqual(result.statusCode, 200)
        Assert.deepEqual(message, 'Data successfully saved!')
       
    })

    it('Teste method GET', async()=>{
        const NAME = 'João Victor'
        const LIMIT = 10
        const SKIP = 0
        const result = await app.inject({
            method: 'GET',
            url:`/users?name=${NAME}&limit=${LIMIT}&skip=${SKIP}`,
            headers
        })
        const validDate = JSON.parse(result.payload)
        //console.log('RESULT', result.payload)
        Assert.deepEqual(result.statusCode, 200)
        Assert.ok(Array.isArray(validDate))
        
    })

    it('Teste method PATCH', async ()=>{
        const obs = {
            ...USER_POST,
            email:'victor@hotmail.com'
        }
        const getId = await app.inject({
            method: 'GET',
            headers,
            url:`/users?name=${USER_POST.name}`,
        })

        const [valid] = JSON.parse([getId.payload])
        //console.log('TIPO',  typeof valid.id)
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url:`/users/${valid.id}`,
            payload: JSON.stringify(obs)
        })

        const validate = JSON.parse(result.payload)

        Assert.deepEqual(validate.message, 'Data updated successfully')
        Assert.notDeepEqual(validate.nModified, 0)
    })

    it('Teste DELETE', async ()=>{
        const dadosId = await app.inject({
            method: 'GET',
            headers,
            url:`/users?name=${USER_POST.name}`
        })
        
        const [valid] = JSON.parse(dadosId.payload)

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url:`/users/${valid.id}`
        })

        Assert.deepEqual(result.payload, 1)
    })
})


