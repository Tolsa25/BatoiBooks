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
        
        this.listenersSet = false; 
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

            if (!this.listenersSet) {
                this.setListeners(); 
                this.listenersSet = true;
            }

        } catch (error) {
            console.error("Error al inicializar la aplicación:", error);
            if (error.message.includes('fetch')) {
                 this.view.showMessage(`Error de conexión. Asegúrate de que json-server esté corriendo en :3000.`, 'error');
            } else {
                 this.view.showMessage(`Error crítico: ${error.message}`, 'error');
            }
        }
    }
    
    renderAllBooks(booksArray) {
        const currentCards = this.view.booksList.querySelectorAll('.cardBook');
        currentCards.forEach(card => card.remove());
        
        booksArray.forEach(book => {
            const moduleCodeString = String(book.moduleCode); 
            const moduleLiteral = this.modulesModel.getModuleByCode(moduleCodeString)?.cliteral || 'Módulo Desconocido';
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
                this.handleRemoveBook(bookId);
            }
        });
        
        if (this.view.resetButton) {
            this.view.resetButton.addEventListener('click', () => {
                this.handleReset();
            });
        }
    }
    
    handleReset() {
        // Al llamar a init(), se llama a populate() (que lee el JSON) 
        // y luego a renderAllBooks() (que repinta la vista).
        this.view.showMessage('Reiniciando la aplicación y recargando los datos...', 'info');
        this.init(); 
    }
    
    reloadBooksView() {
        const books = this.booksModel.getBooks();
        this.renderAllBooks(books);
    }

    async handleSubmitBook(bookData) {
        try {
            if (bookData.id) delete bookData.id;
            if (!bookData.userId || bookData.userId === '') {
                 bookData.userId = 1; 
            }
            bookData.userId = Number(bookData.userId);
            
            const newBook = await this.booksModel.addBook(bookData); 

            const moduleCodeString = String(newBook.moduleCode);
            const moduleLiteral = this.modulesModel.getModuleByCode(moduleCodeString)?.cliteral || 'Módulo Desconocido';
            const moduleName = `${moduleLiteral} (${newBook.moduleCode})`;
            
            this.view.renderBook(newBook, moduleName);
            this.view.showMessage(`Libro con ID ${newBook.id} añadido correctamente.`, 'info'); 
            
            if (this.view.bookForm && typeof this.view.bookForm.reset === 'function') {
                 this.view.bookForm.reset(); 
            }

        } catch (error) {
            console.error("Error al añadir el libro:", error);
            this.view.showMessage(`Error al añadir el libro: ${error.message}`, 'error');
        }
    }

    async handleRemoveBook(bookId) {
        const idToRemove = String(bookId); 
        
        if (!idToRemove || idToRemove === 'null' || idToRemove.trim() === '') {
            this.view.showMessage(`Error: El ID del libro es inválido.`, 'error');
            return; 
        }
        
        try {
            // 1. Elimina del Servidor (JSON) y del Modelo Local
            await this.booksModel.removeBook(idToRemove); 
            
            // 2. Repinta la vista completamente con la lista corregida del Modelo.
            // Esto asegura que el libro desaparece permanentemente hasta el reset y más allá.
            this.reloadBooksView(); 
            
            this.view.showMessage(`Libro con ID ${idToRemove} eliminado correctamente.`, 'info');
            
        } catch (error) {
            if (error.message.includes('404') || error.message.includes('Not Found')) {
                // Si el 404 ocurre, significa que ya se había borrado del JSON. Forzamos la recarga del JSON y repintamos.
                await this.booksModel.populate(); 
                this.reloadBooksView(); 
                this.view.showMessage(`El libro ID ${idToRemove} ya no existía en el servidor.`, 'info');
                return; 
            }
            
            console.error("Error al eliminar el libro:", error);
            this.view.showMessage(`Error al eliminar el libro: ${error.message}`, 'error');
        }
    }
}

export default Controller;