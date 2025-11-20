export default class User{
    constructor(user){
        this.id = user.id;
        this.nick = user.nick;
        this.email = user.email;
        this.password = user.password;
    };

    toString(){
        return `User [
id: ${this.id},
nick: ${this.nick},
email: ${this.email},
password: ${this.password}
]`;
    };
}