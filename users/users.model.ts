import { validateCPF } from './../common/validators';
import * as mongoose from 'mongoose'

import * as bcrypt from 'bcrypt'
import { environment } from '../common/environment';

//interface apenas para controle statico
//em typescript nas interfaces não viram objetos
//representa document User
export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

//String é do tipo JS e nao do Typescript, ou seja string tipada
//unique: nao cria uma opcao de validacaodentrodo mongoose, mas sim criar um indice e unico dentro da coleção

//definindo um schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
})


const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
               .then( hash => {
                obj.password = hash
                   next()
               }).catch(next)

}

//middleware save
const saveMiddleware = function(next) {
    const user: User = this

    if(!user.isModified('password')) {
        next()
    } else {
       hashPassword(user, next)
    }
}

//middleware query
const updateMiddleware = function(next) {
    if(!this.getUpdate().password) {
        next()
    } else {
        hashPassword(this.getUpdate(), next)
    }
}


//middleware pre save
userSchema.pre('save', saveMiddleware)

//middleware para query
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware) //update do put


//criando um model
//infere o nome para o nome da collection
//o model pode receber um tipo generics -> User
export const User = mongoose.model<User>('User', userSchema)