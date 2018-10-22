import * as jestCli from 'jest-cli';

import {Server} from './server/server';
import {environment} from './common/environment';
import {userRouter} from './users/users.router';
import {User} from './users/users.model';
import { reviewRouter } from './reviews/reviews.router';
import { Review } from './reviews/reviews.model';


let server: Server

export const beforeAllTests = () => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
  environment.server.port = process.env.SERVER_PORT || 3001
  server = new Server();

  //precisa colocar o return porque retorna uma Promise
  return server.bootstrap([
    userRouter,
    reviewRouter
  ])
  .then(() => User.remove({}).exec())
  .then(() => Review.remove({}).exec())
}

export const afterAllTests = () => {
  return server.shutdow()
}

//jestCli.run() faz com que o jest procure os arquivos de teste e execute

/* beforeAllTests()
.then(() => jestCli.run())
.then(() => afterAllTests())
.catch(console.error); */