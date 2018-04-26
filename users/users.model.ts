const users = [
    {id: '1', name: 'Nome 1', email: 'teste@teste.com.br'},
    {id: '2', name: 'Nome 2', email: 'teste-1@teste.com.br'}
]

export class User {

    //metodo com uma promise que retorna um array
    static findAll(): Promise<any[]> { 
        return Promise.resolve(users)
    }

    static findById(id: string): Promise<any> {
        return new Promise( resolve => {
            const filtered = users.filter( user => user.id === id )
            let user = undefined
            if(filtered.length > 0) {
                user = filtered[0]
            }

            resolve(user)
        } )
    }

}