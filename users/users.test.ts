import 'jest';
import * as request from 'supertest';

import {Server} from '../server/server';
import {environment} from '../common/environment';
import {userRouter} from './users.router';
import {User} from './users.model';

let address: string
let server: Server
beforeAll(() => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
  environment.server.port = process.env.SERVER_PORT || 3001
  address = `http://localhost:${environment.server.port}`
  server = new Server();

  //precisa colocar o return porque retorna uma Promise
  return server.bootstrap([userRouter])
               .then(() => User.remove({}).exec())
               .catch(console.error)
})

test('get /users', () => {
  //eh um teste async, dessaforma precisa colocar o 'return' para o jest saber que é uma promise
  return request(address)
    .get('/users')
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('post /users', () => {
  return request(address)
    .post('/users')
    .send({
      name: 'usuario1',
      email: 'usuario1@email.com',
      password: '123456',
      cpf: '999.999.999-99'
    })
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe('usuario1')
      expect(response.body.email).toBe('usuario1@email.com')
      expect(response.body.password).toBeUndefined()
      expect(response.body.cpf).toBe('999.999.999-99')
    }).catch(fail)
})

afterAll(() => {
  return server.shutdow()
})