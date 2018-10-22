import 'jest';
import * as request from 'supertest';

import {Server} from '../server/server';
import {environment} from '../common/environment';
import {userRouter} from './users.router';
import {User} from './users.model';

import { beforeAllTests, afterAllTests } from '../jest.startup';

let address: string = (<any>global).address;

beforeAll(beforeAllTests);
afterAll(afterAllTests);

//para rodar só um teste: test.only e para pular test.skip

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

test('get /users/aaaa - not found', () => {
  return request(address)
  .get('/users/aaaa')
  .then(response => {
    expect(response.status).toBe(404)
  }).catch(fail)
})

test('patch /users/:id', () => {
  return request(address)
    .post('/users')
    .send({
      name: 'usuario2',
      email: 'usuario2@email.com',
      password: '123456'
    })
    .then(response => 
        request(address)
        .patch(`/users/${response.body._id}`)
        .send({
          name: 'usuario2-patch'
        }))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe('usuario2-patch')
      expect(response.body.email).toBe('usuario2@email.com')
      expect(response.body.password).toBeUndefined()
    })
    .catch(fail)
})