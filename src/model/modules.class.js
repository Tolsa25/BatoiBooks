import Module from './module.class';
import { getDBModules, addDBModule, removeDBModule, changeDBModule } from '../services/modules.api.js'; 


class Modules {
    constructor() {
        this.data = [];
    }

    async populate() {
        const dataInicial = await getDBModules();
        this.data = dataInicial.map(moduleData => new Module(moduleData));
    }

    async addModule(moduleData) {
        if (!moduleData.code) {
            throw new Error("No se puede añadir el módulo: la propiedad 'code' es obligatoria.");
        }
        
        const createdModule = await addDBModule(moduleData);

        const newModuleInstance = new Module(createdModule);

        this.data.push(newModuleInstance);
        return newModuleInstance;
    }

    async removeModule(code) {
        await removeDBModule(code);
        
        const index = this.data.findIndex(module => module.code === code);

        if (index === -1) {
            throw new Error(`Módulo con código "${code}" no encontrado localmente.`);
        }

        this.data.splice(index, 1);
    }

    async changeModule(moduleData) {
        const updatedModule = await changeDBModule(moduleData);
        
        const code = moduleData.code;
        const index = this.data.findIndex(module => module.code === code);

        if (index === -1) {
            throw new Error(`Módulo con código "${code}" no encontrado localmente`);
        }

        this.data[index] = new Module(updatedModule);

        return this.data[index];
    }

    toString() {
        return this.data.map(module => module.toString()).join('\n');
    }

    getModuleByCode(moduleCode) {
        let module = this.data.find(modulo => modulo.code === moduleCode);
        if (!module) {
            throw new Error(`Módulo con código "${moduleCode}" no existe`);
        }
        return module;
    }
}

export default Modules;