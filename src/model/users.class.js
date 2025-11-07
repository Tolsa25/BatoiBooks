import User from './user.class';
import { getDBUsers, addDBUser, removeDBUser, changeDBUser, changeDBUserPassword } from '../services/users.api.js';


class Users {
    constructor() {
        this.data = [];
    }

    async populate() {
        const dataInicial = await getDBUsers();
        this.data = dataInicial.map(userData => new User(userData));
    }

    async addUser(userData) {
        const createdUser = await addDBUser(userData);
        
        const newUserInstance = new User(createdUser);

        this.data.push(newUserInstance);
        return newUserInstance;
    }

    async removeUser(id) {
        await removeDBUser(id);

        const index = this.data.findIndex(user => user.id === id);

        if (index === -1) {
            throw new Error(`User con id ${id} no encontrado localmente.`);
        }

        this.data.splice(index, 1);
    }

    async changeUser(userData) {
        const updatedUser = await changeDBUser(userData);

        const id = userData.id;
        const index = this.data.findIndex(user => user.id === id);

        if (index === -1) {
            throw new Error(`User con id ${id} no encontrado localmente`);
        }
        
        this.data[index] = new User(updatedUser);
        
        return this.data[index];
    }
    
    async changeUserPassword(id, newPassword) {
        const updatedUser = await changeDBUserPassword(id, newPassword); 

        const index = this.data.findIndex(user => user.id === id);

        if (index === -1) {
            throw new Error(`User con id ${id} no encontrado localmente`);
        }
        
        this.data[index] = new User(updatedUser); 
        
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