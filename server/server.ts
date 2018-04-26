import * as restify from "restify"
import { environment } from '../common/environment';
import { Router } from '../common/router'
import * as mongoose from 'mongoose'

export class Server {
    

    application: restify.Server


    initializeDb(){

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

                //routers
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }



                //registrar um listener, callback opcional
                //resolve: passa pra frente, quem chamou
                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

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
}