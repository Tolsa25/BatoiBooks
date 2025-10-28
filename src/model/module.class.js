export default class Module{
    constructor(module){
        this.code = module.code;
        this.cliteral = module.cliteral;
        this.vliteral = module.vliteral;
        this.courseld = module.courseld;

    };

    toString(){
        return `Module [
        code: ${this.code},
        cliteral: ${this.cliteral},
        vliteral: ${this.vliteral},
        courseld: ${this.courseld}
        ]`
    };


}