import { Router } from '../common/router'
import * as restify from 'restify';
import { User } from './users.model';

class UsersRouter extends Router {

    applyRoutes(application: restify.Server) {

        application.get('/users', (req, resp, next) => {
            //resp.json({message: 'Users ok'})
            User.findAll().then( users => {
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
    }    
}

export const userRouter = new UsersRouter()