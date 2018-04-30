import * as mongoose from 'mongoose';


//para ter a opcao de autocomplete das props - controle statico
export interface MenuItem extends mongoose.Document {
    name: string,
    price: number
}


export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[]
}


//criando schema Restaurant e Menu
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

//select: false não ira trazer por default a lista de menu
const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: []
    }
})

export const Restaurant = mongoose.model<Restaurant>('Restaurant', restSchema)