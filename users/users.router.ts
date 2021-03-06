import * as restify from 'restify';
import { User } from './users.model';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../common/model-router';
import { authenticate } from '../security/auth.handler';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);

        this.on('beforeRender', document => {
            document.password = undefined
            //ou delete document.password
        })
    }


     //se retornar vazio, passa para o renderAll um array vazio
    findByEmail = (req, resp, next) => {
        if(req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => {
                    if(user){
                        return [user]
                    }else{
                        return []
                    }
                })
                .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next)
        } else {
            next();
        }
    }


    applyRoutes(application: restify.Server) {

        //eh permitido passar um array de callbacks

        //usar header accept-version para passar a versao. Pode passar por range tb
        //se nao tiver version o Restfy pega a mais atual

        application.get({path:'/users', version: '2.0.0'}, [this.findByEmail, this.findAll])
        application.get({path:'/users', version: '1.0.0'}, this.findAll)
        application.get('/users/:id', [this.validateId, this.findById])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId, this.replace])
        application.patch('/users/:id', [this.validateId, this.update])
        application.del('/users/:id', [this.validateId, this.delete])

        application.post(`${this.basePath}/authenticate`, authenticate);
    }    
}

export const userRouter = new UsersRouter()