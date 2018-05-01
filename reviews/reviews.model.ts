import { User } from './../users/users.model';
import * as mongoose from 'mongoose';
import { Restaurant } from '../restaurants/restaurants.model';


//mongoose.Types.ObjectId em runtime indica o valor
//mongoose.Types.ObjectId | Restaurant -> union type
export interface Review extends mongoose.Document {
    date: Date,
    rating: number,
    comments: string,
    restaurant: mongoose.Types.ObjectId | Restaurant
    user: mongoose.Types.ObjectId | User 
}


//mongoose.Schema.Types.ObjectId apenas indica o tipo
const reviewSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comments: {
        type: String,
        required: true,
        maxlength: 500
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
      } 
})

export const Review = mongoose.model<Review>('Review', reviewSchema)