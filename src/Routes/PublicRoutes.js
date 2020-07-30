const Jwt = require('jsonwebtoken')
const Joi = require('joi')
const Boom = require('boom')
const Base = require('./base/BaseRoute')
const PasswordHelper = require('../helpers/PasswordHelper')
const failAction = (request, header, error) =>{
    throw error
}

class PublicRoutes extends Base {
    
    constructor(db, key){
        super()
        this._key = key
        this._dataBase = db
    }

    signUp(){
        return{
            path:'/signup',
            method: 'POST',
            config:{
                auth: false,
                tags:['api'],
                description:'Service Registration of administrator users',
                notes:'Registration of users who will be authorized to include, change and delete other users of the system',
                validate:{
                    failAction,
                    payload: Joi.object({
                        name: Joi.string().required(),
                        username: Joi.string().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async(request)=>{
                const {name, username, email, password} = request.payload

                const valid = await this._dataBase.search({email})
                
                if(Object.keys(valid).length !== 0){
                    return{
                        message: Boom.preconditionFailed('E-mail already registered'),
                        id: undefined
                    }
                }

                const token =  await PasswordHelper.hashPassword(password)

                const result = this._dataBase.create({name, username, email, token})
                
                const auth = Jwt.sign(
                    {
                        email : result.email, 
                        id: result.id

                    }, this._key)

                    return {auth}
            }
        }
    }

    login(){
        return{
            path:'/login',
            method: 'POST',
            config:{
                auth:false,
                tags:['api'],
                description:'System access validation service',
                notes:'Authentication performed using email and password',
                validate:{
                    failAction,
                    payload:Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request) =>{

                const{email, password} = request.payload
                const [validUser] = await this._dataBase.search({email})
               
                if(Object.keys(validUser).length === 0){
                    return{
                        message: Boom.preconditionFailed('user or password invalid')
                    }
                }
                
                const validPass = await PasswordHelper.ComparePassword(password, validUser.token)
               
                if(!validPass){
                    
                    return{
                        message: Boom.preconditionFailed('user or password invalid')
                    }
                    
                 }
                 const token = Jwt.sign({
                    email: validUser.email,
                    id : validUser.id
                }, this._key)
               
                return {token}
            }
        }
    }
}

module.exports = PublicRoutes