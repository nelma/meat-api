import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';

import { User } from '../users/users.model';
import { NotAuthorizedError } from 'restify-errors';
import { environment } from '../common/environment';
// uma nova forma de tipar, o proprio metodo
export const authenticate: restify.RequestHandler = (req, resp, next) => {
  const {email, password} = req.body;

  //+password indica que é pra trazer mais o campo password nessa busca
  User.findByEmail(email, '+password').then(user => {
    if(user && user.matches(password)) {
      //gerar o token
      const token = jwt.sign({sub: user.email, iss: 'meat-api'}, environment.security.apiSecret);
      resp.json({
        name: user.name, email: user.email, accessToken: token
      });
      return next(false);
    } else {
      return next(new NotAuthorizedError('Invalid Credentials'));
    }
  }).catch(next);

}