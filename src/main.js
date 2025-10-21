import * as functions from './functions.js';
import data from './services/datos.js';
import './style.css';

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/logoBatoi.png" class="logo" alt="Vite logo" />
    </a>
    <h1>Hello BatoiBooks!</h1>
  </div>
`; 

let busqueda = functions.getBookById(data.books, 1);
console.log(busqueda);

let busqueda2 = functions.getBookIndexById(data.books, 1);
console.log(busqueda2);

let busqueda3 = functions.bookExists(data.books, 2, "5025");
console.log(busqueda3);

let busqueda4 = functions.booksFromUser(data.books, 2);
console.log(busqueda4);

let busqueda5 = functions.booksFromModule(data.books, "5025");
console.log(busqueda5);

let busqueda6 = functions.booksCheeperThan(data.books, 15);
console.log(busqueda6);

let busqueda7 = functions.booksWithStatus(data.books, "good");
console.log(busqueda7);

let busqueda8 = functions.averagePriceOfBooks(data.books);
console.log(busqueda8);

let busqueda9 = functions.booksOfTypeNotes(data.books);
console.log(busqueda9);

let busqueda10 = functions.booksNotSold(data.books);
console.log(busqueda10);

let busqueda11 = functions.incrementPriceOfbooks(data.books, 0.1);
console.log(busqueda11);

let busqueda12 = functions.getUserById(data.users, 2);
console.log(busqueda12);

let busqueda13 = functions.getUserIndexById(data.users, 2);
console.log(busqueda13);

let busqueda14 = functions.getUserByNickName(data.users, "Ximo");
console.log(busqueda14);

let busqueda15 = functions.getModuleByCode(data.modules, "5025");
console.log(busqueda15);