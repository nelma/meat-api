import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';

import { User } from '../users/users.model';
import { environment } from '../common/environment';

export const tokenParser: restify.RequestHandler = (req, resp, next) => {

  const token = extractToken(req);

  if(token) {
    jwt.verify(token, environment.security.apiSecret, applyBearer(req, next))
  } else {
    next();
  }
}

function extractToken(req: restify.Request) {
  //Bearer quer dizer o portador do token
  //Authorization: Bearer TOKEN

  const authorization = req.header('authorization');

  if(authorization) {
    const parts: string[] = authorization.split(' ');

    if(parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
  }
  return undefined;
}

//essa funcao retorna um funcao que eh um closure e possui a assinatura esperada
// pelo metodo jwt.verify
function applyBearer(req: restify.Request, next): (error, decoded) => void {

  return(error, decoded) => {

    if(decoded) {
      User.findByEmail(decoded.sub).then(user => {

        if(user) {
          //associar o usr no request
          req.authenticated = user;
        }
        next();
      }).catch(next)
    } else {
      next();
    }
  }
}