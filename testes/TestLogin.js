const Assert = require('assert')

const api = require('../Api')

const USER_POST={
    
    email: 'victor@1234.com',
    password:'12345'
}

let app = {}

describe('Suite de Login', async function(){
    this.beforeAll(async ()=>{
        app = await api;
    })

    it('Testes de Validação SignUp', async ()=>{
        const result = await app.inject({
                method: 'POST',
                url:'/signup',
                payload:{
                    name:'TESTE',
                    username:'TESTE',
                    email:'email@teste.com',
                    password:'12345'
                }
            })
        Assert.deepEqual(result.statusCode, 200)
    })

    it('Testes de Validação Login', async () =>{
        const result = await app.inject({
            method: 'POST',
            url:'/login',
            payload:{

                email:'email@teste.com',
                password:'12345'
            }
        })
    Assert.deepEqual(result.statusCode, 200)
    })
})