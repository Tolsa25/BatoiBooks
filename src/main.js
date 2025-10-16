import './style.css';
import logoBatoi from '/logoBatoi.png';
import { books } from '../services/datos.js';

let userBooks = functions.booksFromUser(books, 4);

console.log("------------------------------------------");
console.log("1. Libros del Usuario 4:");
console.log(userBooks);
console.log(`Total de libros del usuario 4: ${userBooks.length}`);

let moduleBooks = functions.booksFromModule(books, "5021");
let filteredBooks = functions.booksWithStatus(moduleBooks, "good");

console.log("------------------------------------------");
console.log("2. Libros del módulo 5021 en estado 'good':");
console.log(filteredBooks);
console.log(`Total de libros filtrados: ${filteredBooks.length}`);

let booksWithPriceIncrease = functions.incrementPriceOfbooks(books, 0.1);

console.log("------------------------------------------");
console.log("3. Libros con precio incrementado un 10%:");
console.log(booksWithPriceIncrease);
console.log("------------------------------------------");

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${logoBatoi}" class="logo" alt="Vite logo" />
    </a>
    <h1>Hello BatoiBooks!</h1>
`
