import { Router } from './router';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query
    }

    //validando formato ID passado no query param
    validateId = (req, resp, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
            return next(new NotFoundError('Document not found'))

        next()
    }

    findAll = (req, resp, next) => {
        //resp.json({message: 'Users ok'})
        this.model.find()
                   .then( this.render(resp, next) )
                   .catch(next)
    }

    findById = (req, resp, next) => {
        //faz o prepareOnde antes de se inscrever no then (Promisse)

        this.prepareOne(this.model.findById(req.params.id))
                  .then( this.render(resp, next) )
                  .catch(next)
    }

    save = (req, resp, next) => {
        let document = new this.model(req.body)
            document.save()
                    .then( this.render(resp, next) )
                    .catch(next)
    }

    replace = (req, resp, next) => {

        //pra fazer o update completo. Seguindo o conceito do PUT
        const options = {runValidators: true, overwrite: true}

        //update(filtro, dado,)
        this.model.update({_id: req.params.id}, req.body, options)
            .exec().then( result => {

                //o n retorna o nro de registro atualizado
                if(result.n) {

                    //buscar nova versão do dado
                    return this.model.findById(req.params.id)
                } else {
                    //resp.send(404)
                    throw new NotFoundError('Documento não encontrado')
                }
            }
        ).then( this.render(resp, next) )
         .catch(next)
    }

    update = (req, resp, next) => {

        //para o metodo retornar o user atualizado é preciso passar uma options
        const options = {runValidators: true, new: true}


        this.model.findByIdAndUpdate(req.params.id, req.body, options)
                  .then( this.render(resp, next) )
                  .catch(next)
    }

    delete = (req, resp, next) => {
        this.model.remove({_id: req.params.id}).exec().then( (cmdResult: any) => {

            //retorna o sumario
            if(cmdResult.result.n) {
                resp.send(204)
            } else {
                throw new NotFoundError('Documento não encontrado')
            }

            return next()
        }).catch(next)
    }
}