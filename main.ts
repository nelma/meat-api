import * as restify from "restify";


//criar server
const server = restify.createServer({
  name: 'meat-api',
  version: '1.0.0'
})

server.use(restify.plugins.queryParser())

//next indica que terminou de executar o callback - documentação
server.get('/hello', (req, resp, next) => {
    resp.json({message: 'hello'})
    return next()
})

server.get('/info', [
  (req, resp, next) => {
    if(req.userAgent() && req.userAgent().includes('MSIE 7.0')) {
      /*resp.status(400)
      resp.json({message: 'Nao permitido'})
      return next(false)*/

      let error = new Error()
      error.statusCode = 400
      error.message = 'Defindo error'
      return next(error)
    }
    return next()
  }, (req, resp, next) => {
    resp.json({
      browser: req.userAgent(),
      method: req.method,
      query: req.query //precisa do plugin
    }
])

//registrar um listener, callback opcional
server.listen(3000, () => {
  console.log('API is running in port 3000')
})
