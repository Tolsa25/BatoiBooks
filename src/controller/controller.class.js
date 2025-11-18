import Books from '../model/books.class.js'; 
import Modules from '../model/modules.class.js';
import Users from '../model/users.class.js'; 
import View from '../view/view.class.js';

class Controller {
    constructor() {
        this.booksModel = new Books();
        this.modulesModel = new Modules();
        this.usersModel = new Users(); 
        this.view = new View();
    }

    async init() {
        try {
            await this.modulesModel.populate();
            await this.usersModel.populate();
            await this.booksModel.populate();

            const modules = this.modulesModel.getModules();
            if (modules.length > 0) {
                this.view.completeModuleSelect(modules);
            }

            const books = this.booksModel.getBooks();
            this.renderAllBooks(books);
            
            this.setListeners(); 

        } catch (error) {
            console.error("Error al inicializar la aplicación:", error);
            if (error.message.includes('fetch')) {
                 this.view.showMessage(`Error de conexión al intentar obtener los datos. Asegúrate de que json-server esté corriendo en :3000.`, 'error');
            } else {
                 this.view.showMessage(`Error crítico al cargar la aplicación: ${error.message}`, 'error');
            }
        }
    }
    
    renderAllBooks(booksArray) {
        const currentCards = this.view.booksList.querySelectorAll('.cardBook');
        currentCards.forEach(card => card.remove());
        
        booksArray.forEach(book => {
            const moduleLiteral = this.modulesModel.getModuleByCode(book.moduleCode)?.cliteral || 'Módulo Desconocido';
            const moduleName = `${moduleLiteral} (${book.moduleCode})`;

            this.view.renderBook(book, moduleName);
        });
    }

    setListeners() {
        this.view.bookForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const bookData = this.view.getFormData(); 
            this.handleSubmitBook(bookData); 
        });
        
        this.view.booksList.addEventListener('click', (event) => {
            const target = event.target;
            
            if (target.classList.contains('btn-remove')) {
                const bookId = target.getAttribute('data-book-id');
                this.handleRemoveBook(Number(bookId));
            }
        });
    }
    
    reloadBooksView() {
        const books = this.booksModel.getBooks();
        this.renderAllBooks(books);
    }

    async handleSubmitBook(bookData) {
        try {
            if (!bookData.userId || bookData.userId === '') {
                 bookData.userId = 1; 
            }
            bookData.userId = Number(bookData.userId);
            
            const newBook = await this.booksModel.addBook(bookData); 

            const moduleLiteral = this.modulesModel.getModuleByCode(newBook.moduleCode)?.cliteral || 'Módulo Desconocido';
            const moduleName = `${moduleLiteral} (${newBook.moduleCode})`;
            
            this.view.renderBook(newBook, moduleName);

            this.view.showMessage(`Libro con ID ${newBook.id} añadido correctamente.`, 'info'); 
            this.view.bookForm.reset(); 

        } catch (error) {
            console.error("Error al añadir el libro:", error);
            this.view.showMessage(`Error al añadir el libro: ${error.message}`, 'error');
        }
    }

    async handleRemoveBook(bookId) {
        const idToRemove = Number(bookId); 
        
        try {
            await this.booksModel.removeBook(idToRemove); 
            
            await this.booksModel.populate(); 
            this.reloadBooksView(); 

            this.view.showMessage(`Libro con ID ${idToRemove} eliminado correctamente.`, 'info');
            
        } catch (error) {
            if (error.message.includes('404 Not Found') || error.message.includes('no encontrado localmente')) {
                
                await this.booksModel.populate(); 
                this.reloadBooksView(); 
                
                this.view.showMessage(`El libro ID ${idToRemove} fue removido (no encontrado en el servidor).`, 'info');
                return; 
            }
            
            console.error("Error al eliminar el libro:", error);
            this.view.showMessage(`Error al eliminar el libro: ${error.message}`, 'error');
        }
    }
}

export default Controller;