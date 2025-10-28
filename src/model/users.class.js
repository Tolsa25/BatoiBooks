import User from './user.class';

class Users {
    constructor() {
        this.data = [];
    }

    populate(dataInicial) {
        this.data = dataInicial.map(userData => new User(userData));
    }

    addUser(userData) {
        const newId = this.data.length > 0 ? Math.max(...this.data.map(u => u.id)) + 1 : 1;
        
        const newUserInstance = new User({
            id: newId,
            ...userData
        });

        this.data.push(newUserInstance);
        return newUserInstance;
    }

    removeUser(id) {
        const index = this.data.findIndex(user => user.id === id);

        if (index === -1) {
            throw new Error(`User con id ${id} no encontrado.`);
        }

        this.data.splice(index, 1);
    }

    changeUser(userData) {
        const id = userData.id;
        const index = this.data.findIndex(user => user.id === id);

        if (index === -1) {
            throw new Error(`User con id ${id} no encontrado`);
        }
        
        this.data[index] = new User(userData);
        
        return this.data[index];
    }

    toString() {
        return this.data.map(user => user.toString()).join('\n');
    }

    getUserById(userId) {
        const user = this.data.find(user => user.id === userId);
        if (!user) {
            throw new Error(`Usuario con ID ${userId} no existe`);
        }
        return user;
    }

    getUserIndexById(userId) {
        const indice = this.data.findIndex(user => user.id === userId);
        if (indice === -1) {
            throw new Error(`Usuario con ID ${userId} no existe`);
        }
        return indice;
    }

    getUserByNickName(nick) {
        const user = this.data.find(user => user.nick === nick);
        if (!user) {
            throw new Error(`Usuario con nick "${nick}" no existe`);
        }
        return user;
    }
}

export default Users;