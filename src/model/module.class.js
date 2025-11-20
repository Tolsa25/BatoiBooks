// Archivo: module.class.js
export default class Module {
    constructor(arg1, arg2, arg3, arg4) {
        // Soporte para new Module(moduleData)
        if (typeof arg1 === 'object' && arg1 !== null) {
            this.code = arg1.code; 
            this.cliteral = arg1.cliteral;
            this.vliteral = arg1.vliteral;
            this.courseId = arg1.courseId;
        } 
        // Soporte para new Module('ABCD', 'Nuevo módulo', ...)
        else {
            this.code = arg1; 
            this.cliteral = arg2;
            this.vliteral = arg3;
            this.courseId = arg4;
        }
    }

    toString() {
        return `Module [\n code: ${this.code},\n cliteral: ${this.cliteral},\n vliteral: ${this.vliteral},\n courseId: ${this.courseId}\n]`;
    }
}