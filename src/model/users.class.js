import User from './user.class';
import { getDBUsers, addDBUser, removeDBUser, changeDBUser, changeDBUserPassword } from '../services/users.api.js';


class Users {
    constructor() {
        this.data = [];
    }

    async populate() {
        const dataInicial = await getDBUsers();
        this.data = dataInicial.map(userData => new User(userData.id, userData.nick, userData.email, userData.password));
    }

    async addUser(userData) {
        const createdUser = await addDBUser(userData);
        const newUserInstance = new User(createdUser.id, createdUser.nick, createdUser.email, createdUser.password);
        this.data.push(newUserInstance);
        return newUserInstance;
    }

   async removeUser(id) {
        const stringId = String(id);
        const index = this.data.findIndex(user => String(user.id) === stringId);
        
        if (index === -1) {
            throw new Error(`User con id ${id} no encontrado localmente.`); 
        }
        
        await removeDBUser(id); 
        this.data.splice(index, 1);
    }

    async changeUser(userData) {
        const stringId = String(userData.id);
        const updatedUserRaw = await changeDBUser(userData); // Cambiado a updatedUserRaw para claridad

        const index = this.data.findIndex(user => String(user.id) === stringId); 

        if (index === -1) {
            throw new Error(`User con id ${stringId} no encontrado localmente`);
        }
        
        this.data[index] = new User(updatedUserRaw.id, updatedUserRaw.nick, updatedUserRaw.email, updatedUserRaw.password);
        
        return this.data[index];
    }
    
    async changeUserPassword(id, newPassword) {
        const stringId = String(id);
        const updatedUserRaw = await changeDBUserPassword(stringId, newPassword); // Cambiado a updatedUserRaw

        const index = this.data.findIndex(user => String(user.id) === stringId);

        if (index === -1) {
            throw new Error(`User con id ${stringId} no encontrado localmente`);
        }
        
        this.data[index] = new User(updatedUserRaw.id, updatedUserRaw.nick, updatedUserRaw.email, updatedUserRaw.password); 
        
        return this.data[index];
    }

    toString() {
        return this.data.map(user => user.toString()).join('\n');
    }

    async getUserById(userId) {
    const stringUserId = String(userId); 
    const user = this.data.find(user => String(user.id) === stringUserId);
    
    if (!user) {
        throw new Error(`Usuario con ID ${userId} no existe`);
    }
    return user;
}

    getUserIndexById(userId) {
        const stringUserId = String(userId); 
        const indice = this.data.findIndex(user => String(user.id) === stringUserId);
        
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