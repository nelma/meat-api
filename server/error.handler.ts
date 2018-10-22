import * as restify from 'restify';


export const handlerError = (req: restify.Request, resp: restify.Response ,err, done) => {

    console.log(err)

    //sobrescrevendo metodo json do err
    err.toJSON = () => {
        return {
            message: err.message
        }
    }

    //statusCode da resposta
    switch(err.name) {
        case 'MongoError':
            if(err.code === 11000) err.statusCode = 400
        
            break
        case 'ValidationError':
            err.statusCode = 400

            const messages: any[] = []
            for(let name in err.errors) {
                messages.push( {message: err.errors[name].message} )
            }

            err.toJSON = () => ({
                message: 'Validation error while processing you request.',
                errors: messages
            })
            break
    }

    //indica ao restify que terminou o tratamento
    done()
}