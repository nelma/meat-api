import { Server } from './server/server';
import { userRouter } from './users/users.router';

const server = new Server()
server.bootstrap([userRouter]).then( server => {
  console.log('Ouvi a porta ', server.application.address())
}).catch(error => {
  console.log(error)

  process.exit(1)
})