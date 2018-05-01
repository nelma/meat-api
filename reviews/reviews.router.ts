import { ModelRouter } from "../common/model-router";
import { Review } from './reviews.model';
import * as restify from 'restify';
import * as mongoose from 'mongoose';

class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name').populate('restaurant', 'name')
    }

    //override
    /*findById = (req, resp, next) => {
        this.model.findById(req.params.id)
                  .populate('user', 'name')
                  .populate('restaurant')
                  .then( this.render(resp, next) )
                  .catch(next)
    }*/

    applyRoutes(application: restify.Server) {

        //eh permitido passar um array de callbacks

        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)
    }    
}

export const reviewRouter = new ReviewRouter();