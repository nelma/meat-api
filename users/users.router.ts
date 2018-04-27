import { Router } from '../common/router'
import * as restify from 'restify';
import { User } from './users.model';

class UsersRouter extends Router {

    applyRoutes(application: restify.Server) {

        application.get('/users', (req, resp, next) => {
            //resp.json({message: 'Users ok'})
            User.find().then( users => {
                resp.json(users)
                return next()
            })
        })


        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then( user => {
                if(user) {
                    resp.json(user)
                    return next()
                }

                //caso nao encontre
                resp.send(404)
                return next()
            })
        })

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body)
            user.save().then( user => {
                //workaround para não exibir password
                user.password = undefined

                resp.json(user)
                return next()
            })
        })

        application.put('/users/:id', (req, resp, next) => {

            //pra fazer o update completo. Seguindo o conceito do PUT
            const options = {overwrite: true}

            //update(filtro, dado,)
            User.update({_id: req.params.id}, req.body, options)
                .exec().then( result => {

                    //o n retorna o nro de registro atualizado
                    if(result.n) {

                        //buscar nova versão do dado
                        return User.findById(req.params.id)
                    } else {
                        resp.send(404)
                    }
                }
            ).then( user => {
                resp.json(user)
                return next()
            })
        })

        application.patch('/users/:id', (req, resp, next) => {

            //para o metodo retornar o user atualizado é preciso passar uma options
            const options = {new: true}


            User.findByIdAndUpdate(req.params.id, req.body, options).then( user => {
                if(user) {
                    resp.json(user)
                    return next()
                }

                resp.send(404)
                return next()
            } )
        })

        application.del('/users/:id', (req, resp, next) => {
            User.remove({_id: req.params.id}).exec().then( (cmdResult: any) => {

                //retorna o sumario
                if(cmdResult.result.n) {
                    resp.send(204)
                } else {
                    resp.send(404)
                }

                return next()
            })
        })
    }    
}

export const userRouter = new UsersRouter()