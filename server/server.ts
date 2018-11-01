import * as restify from "restify"
import { environment } from '../common/environment';
import { Router } from '../common/router'
import * as mongoose from 'mongoose'
import { mergePatchBodyParser } from './merge-patch.parser';
import { handlerError } from './error.handler';

import {tokenParser} from '../security/token.parser';
export class Server {
    

    application: restify.Server

    initializeDb(): mongoose.MongooseThenable{

        (<any>mongoose).Promise = global.Promise

        //useMongoClient forma mais recente de conectar no mongo
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
        })
    };


    //envolvendo o retornando numa Promsisse
    initRoutes(routers: Router[]): Promise<any> {
        return new Promise( (resolve, reject) => {
            try {

                //criar server
                this.application = restify.createServer({
                name: 'meat-api',
                version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser) //pra vir em toda request

                //routers
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }



                //registrar um listener, callback opcional
                //resolve: passa pra frente, quem chamou
                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

                //registrando um evento
                //callback para tratar erros
                this.application.on('restifyError', handlerError)

            } catch(error) {
                reject(error)
            }
        })
    }

    //retornando uma Promisse que é a propria instanciado server
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then( () =>  
                this.initRoutes(routers).then(() => this))
    }

    shutdow() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}