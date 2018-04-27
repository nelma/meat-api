import * as mongoose from 'mongoose'

//interface aenas para controle static
//em typescript nas interfaces não viram objetos
export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

//String é do tipo JS e nao do Typescript
//unique: noa criauma opcao de validacaodentrodo mongoose, mas sim criar um indice e unico dentroda cleção

//definindo um schema
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
})

//criando um model
//infere o nome para o nome da collection
//o model podereceber um tipo generics -> User
export const User = mongoose.model<User>('User', userSchema)