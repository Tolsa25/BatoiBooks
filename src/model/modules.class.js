import Module from './module.class';
import { getDBModules } from '../services/modules.api.js'; 


class Modules {
    constructor() {
        this.data = [];
    }

    async populate() {
        const dataInicial = await getDBModules();
        this.data = dataInicial.map(moduleData => new Module(moduleData));
    }

    toString() {
        return this.data.map(module => module.toString()).join('\n');
    }

    getModuleByCode(moduleCode) {
        let module = this.data.find(modulo => modulo.code === moduleCode);
        return module; 
    }

    getModules() {
        return this.data; 
    }
}

export default Modules;