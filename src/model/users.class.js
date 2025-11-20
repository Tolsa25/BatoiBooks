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
        // Corrección: Conversión a string para asegurar la comparación de IDs
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
        const updatedUser = await changeDBUser(userData);

        // Corrección: Conversión a string para asegurar la comparación de IDs
        const index = this.data.findIndex(user => String(user.id) === stringId); 

        if (index === -1) {
            throw new Error(`User con id ${stringId} no encontrado localmente`);
        }
        
        this.data[index] = new User(updatedUser);
        
        return this.data[index];
    }
    
    async changeUserPassword(id, newPassword) {
        const stringId = String(id);
        const updatedUser = await changeDBUserPassword(stringId, newPassword); 

        // Corrección: Conversión a string para asegurar la comparación de IDs
        const index = this.data.findIndex(user => String(user.id) === stringId);

        if (index === -1) {
            throw new Error(`User con id ${stringId} no encontrado localmente`);
        }
        
        this.data[index] = new User(updatedUser); 
        
        return this.data[index];
    }

    toString() {
        return this.data.map(user => user.toString()).join('\n');
    }

    getUserById(userId) {
        // Corrección: Conversión a string para evitar fallos por discrepancia de tipos (3 === "3" es falso)
        const stringUserId = String(userId); 
        const user = this.data.find(user => String(user.id) === stringUserId);
        
        if (!user) {
            throw new Error(`Usuario con ID ${userId} no existe`);
        }
        return user;
    }

    getUserIndexById(userId) {
        // Corrección: Conversión a string para evitar fallos por discrepancia de tipos
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