const Joi = require('joi');
const Boom = require('boom')
const Base = require('./base/BaseRoute');
const { join } = require('path');

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

const failAction = (request, header, error) =>{
    throw error
}

class PrivateRoutes extends Base {
    constructor(db){
        super()
        this._dataBase = db;
    }

    list(){
        return{
            path:'/users',
            method:'GET',
            config:{
                tags:['api'],
                description: 'service user list',
                notes:'The service provides limit, skip and query by name, username and email',
                validate:{
                    headers,
                    failAction,
                    query: Joi.object({

                        limit: Joi.number().integer(),
                        skip: Joi.number().integer(),
                        name: Joi.string(),
                        email: Joi.string().email(),
                        username: Joi.string()

                    })
                }
            },
            handler: async (request)=>{
               try {
                
                const {query} = request
                const limit = query.limit || 0 
                const skip = query.skip || 0
                
                query.limit = undefined ; 
                query.skip = undefined ;

                const tratarObj = JSON.stringify(query)
                const resultObj = JSON.parse(tratarObj)
                   
                return await this._dataBase.search(resultObj, limit, skip)
               
               } catch (error) {
                    console.log('Request failed GET', error)
                    return Boom.internal()
               }
            }
        }
    }
    create(){
        return{
            path:'/users',
            method:'POST',
            config:{
               description: 'User inclusion service',
               notes:'it is not allowed to insert new users with email already registered',
               tags:['api'],
               validate:{
                    headers,
                    failAction,
                    payload: Joi.object({
                        name: Joi.string().required(),
                        username: Joi.string().required(),
                        email: Joi.string().email().required(),
                    })
               } 
            },
            handler: async (request) =>{
                try {
                    const {name, username, email} = request.payload
                    const valid = await this._dataBase.search({email})
                    if(valid.length){
                        return{
                            message: Boom.preconditionFailed('E-mail already registered'),
                            id: undefined
                        }
                    }
                    const result = this._dataBase.create({name, username, email})
                    return{
                        message:'Data successfully saved!',
                        id: result.id
                    } 
                } catch (error) {
                    console.log('Request failed POST', error)
                    return Boom.internal()
                }
            }
        }
    }

    update(){
        return{
            path:'/users/{id}',
            method:'PATCH',
            config:{
                description:'record update service',
                notes:'the update is performed using the id for query',
                tags: ['api'],
                validate:{
                    headers,
                    failAction,
                    params: Joi.object({
                        id: Joi.number().integer().required()
                    }),
                    payload:Joi.object({
                        name: Joi.string(),
                        username: Joi.string(),
                        email: Joi.string().email()
                    })
                }
            },
            handler: async (request)=>{
                try {
                    const {id} = request.params

                    const {payload} = request

                    const auxDate = JSON.stringify(payload)
                    const Dados = JSON.parse(auxDate)
                    const valid = await this._dataBase.search({id})
                    if(!valid.length){
                        return{
                            message: Boom.preconditionFailed('User not found'),
                            id: undefined
                        }
                    }
                    const result = await this._dataBase.update(id, Dados)

                    if(result === 0){
                        return {
                          message : Boom.preconditionFailed('Failed to update information'),
                          nModified : result
                        }
                    }

                    return{
                        message : 'Data updated successfully',
                        nModified : result
                    }
                } catch (error) {
                    console.log('Request failed PATCH', error)
                    return Boom.internal()
                }
            }
        }
    }

    delete(){
        return{
            path:'/users/{id}',
            method: 'DELETE',
            config:{
                description: 'Exclusion service',
                notes:'the delete is performed using the id for query',
                tags:['api'],
                validate:{
                    headers,
                    failAction,
                    params: Joi.object({    
                        id: Joi.number().integer().required()  
                    })
                }

            },
            handler: async (request)=>{
                try {
                    const {id} = request.params
                    return await this._dataBase.delete(id)
                } catch (error) {
                    console.log('Request failed DELETE', error)
                    return Boom.internal()
                }
            }
        }       
    }
}

module.exports = PrivateRoutes