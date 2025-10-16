function getBookById(books, bookId) {
    //recibe el array de libros y una id y devuelve el libro con dicha id. SI no existe lanzará una excepción
    let encontrarLibro = books.find(book => book.id === bookId);

    if (!encontrarLibro) {
        throw new Error(`El libro con id ${bookId} no existe`);
    } 
    return encontrarLibro;
};

function getBookIndexById(books, bookId) { 
    //igual pero devuelve la posición del libro dentro del array. Si no existe lanzará una excepción
    let  encontrarIndice = books.findIndex(book => book.id === bookId);

    if(encontrarIndice === -1){
        throw new Error(`El libro con id ${bookId} no existe`);
    }

    return encontrarIndice;
};

function bookExists(books, userId, moduleCode) { 
    //devuelve la id del usuario y el código del módulo y nos dice si ese usuario ya tiene un libro con ese código 
    let exists = books.some(book => book.userId === userId && book.moduleCode === moduleCode);

    if(!exists){
        return false;
    }

    return true;
};

function booksFromUser(books, userId){ 
    //recibe el array de libros y la id de un usuario y devuelve el array con todos los libros de dicho usuario

    let librosDelUsusario = books.filter(book => {return book.userId === userId});

    return librosDelUsusario;
};

function booksFromModule(books, moduleCode) { 
    //recibe el array de libros y el código de un módulo y devuelve el array con todos los libros de dicho módulo

    let librosDelModulo = books.filter(book => {return book.moduleCode === moduleCode});

    return librosDelModulo;
};

function booksCheeperThan(books, price){ 
    //recibe el array de libros y un valor y devuelve el array con todos los libros cuyo precio es inferior o igual al valor 
    
    let librosMasBaratosQue = books.filter(book => {return book.price <= price});
    return librosMasBaratosQue;
};

function booksWithStatus(books, status) { 
    //recibe el array de libros y un estado ("new", "good", ...) y devuelve el array con todos los libros de dicho estado

    let librosConEstado = books.filter(book => {return book.status === status});
    return librosConEstado;
};

function averagePriceOfBooks(books){ 
    //recibe el array de libros y devuelve el precio medio de los mismos, con 2 decimales y el símbolo del € (ej.: "23.40 €")

    let precioMedio = books.reduce((SumaPrecios, book) => SumaPrecios + book.price, 0) / books.length;

    if (isNaN(precioMedio)) {
        return "0.00 €";
    }

    return precioMedio.toFixed(2) + " €";
};

function booksOfTypeNotes(books) { 
    //recibe el array de libros y devuelve un array con todos los que son apuntes
    return books.filter(book => book.publisher === "Apunts");
};

function booksNotSold(books){ 
    //recibe el array de libros y devuelve un array con todos los que NO se han vendido aún
    return books.filter(book => book.soldDate === "");
};

function incrementPriceOfbooks(books, percentage) {
    //recibe el array de libros y el porcentaje a incrementar (ej. 0,1 == 10%) y devuelve un array igual pero con el precio incrementado en el porcentaje pasado
    return books.map(book => {
        
        let newPrice = book.price * (1 + percentage);
        
        return {
            ...book,
            price: parseFloat(newPrice.toFixed(2))
        };
    });
};

function getUserById(users, userId) {
    //recibe el array de usuarios y una id y devuelve el usuario con dicha id. SI no existe lanzará una excepción
    let user = users.find(user => user.id === userId);

    if (!user) {
        throw new Error(`Usuario con ID ${userId} no existe`);
    }

    return user;

};

function getUserIndexById(users, userId) {
    //igual pero devuelve la posición del usuario dentro del array. SI no existe lanzará una excepción
    let indice = users.findIndex(user => user.id === userId);

    if (indice === -1) {
        throw new Error(`Usuario con ID ${userId} no existe`);
    }

    return indice;
};

function getUserByNickName(users, nick) {
    //recibe el array de usuarios y un nombre de usuario (nick) y devuelve el usuario con dicho nick. SI no existe lanzará una excepción
    let user = users.find(user => user.nick === nick);

    if (!user) {
        throw new Error(`Usuario con nick "${nick}" no existe`);
    }

    return user;
};

function getModuleByCode(modules, moduleCode) {
    //recibe el array de módulos y un código y devuelve el módulo con dicho código (campo code). SI no existe lanzará una excepción
    let module = modules.find(modulo => modulo.code === moduleCode);

    if (!module) {
      throw new Error(`Módulo con código "${moduleCode}" no existe`);
    }

    return module;
};

export {
  getBookById,
  getBookIndexById,
  bookExists,
  booksFromUser,
  booksFromModule,
  booksCheeperThan,
  booksWithStatus,
  averagePriceOfBooks,
  booksOfTypeNotes,
  booksNotSold,
  incrementPriceOfbooks,
  getUserById,
  getUserIndexById,
  getUserByNickName,
  getModuleByCode 
}