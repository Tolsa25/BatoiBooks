import Module from './module.class';

class Modules {
    constructor() {
        this.data = [];
    }

    populate(dataInicial) {
        this.data = dataInicial.map(moduleData => new Module(moduleData));
    }

    addModule(moduleData) {
        if (!moduleData.code) {
            throw new Error("No se puede añadir el módulo: la propiedad 'code' es obligatoria.");
        }
        if (this.data.some(m => m.code === moduleData.code)) {
            throw new Error(`No se puede añadir el módulo: El código "${moduleData.code}" ya existe.`);
        }

        const newModuleInstance = new Module(moduleData);

        this.data.push(newModuleInstance);
        return newModuleInstance;
    }

    removeModule(code) {
        const index = this.data.findIndex(module => module.code === code);

        if (index === -1) {
            throw new Error(`Módulo con código "${code}" no encontrado`);
        }

        this.data.splice(index, 1);
    }

    changeModule(moduleData) {
        const code = moduleData.code;
        const index = this.data.findIndex(module => module.code === code);

        if (index === -1) {
            throw new Error(`Módulo con código "${code}" no encontrado`);
        }

        this.data[index] = new Module(moduleData);

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