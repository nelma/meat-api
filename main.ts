import { Server } from './server/server';
import { userRouter } from './users/users.router';
import { restaurantRouter } from './restaurants/restaurants.router';
import { reviewRouter } from './reviews/reviews.router';

//bootstrap são os componentes que irao inicializar

const server = new Server()
server.bootstrap([
    userRouter,
    restaurantRouter,
    reviewRouter
  ]).then( server => {
  console.log('Ouvi a porta ', server.application.address())
}).catch(error => {
  console.log(error)

  process.exit(1)
})