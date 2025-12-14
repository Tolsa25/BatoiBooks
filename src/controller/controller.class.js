import Books from '../model/books.class.js';
import Modules from '../model/modules.class.js';
import Users from '../model/users.class.js';
import View from '../view/view.class.js';
import Cart from '../model/cart.class.js';

class Controller {
    constructor() {
        this.booksModel = new Books();
        this.modulesModel = new Modules();
        this.usersModel = new Users();
        this.cartModel = new Cart();
        this.view = new View();

        this.listenersSet = false;
    }

    async init() {
        try {
            await this.modulesModel.populate();
            await this.usersModel.populate();
            await this.booksModel.populate();
            await this.cartModel.populate();

            const modules = this.modulesModel.getModules();
            if (modules.length > 0) {
                this.view.completeModuleSelect(modules);
            }

            const books = this.booksModel.getBooks();
            this.renderAllBooks(books);

            console.log("Carrito inicializado:", this.cartModel.toString());

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
        this.view.moduleSelect.addEventListener('change', async () => {
            const moduleCode = this.view.moduleSelect.value;
            const userIdInput = this.view.bookForm.querySelector('#userId');
            const userId = userIdInput ? userIdInput.value : 1;

            if (moduleCode) {
                try {
                    const exists = await this.booksModel.bookExists(userId, moduleCode);
                    if (exists) {
                        this.view.moduleSelect.setCustomValidity('Ya tienes un libro de este módulo en venta.');
                    } else {
                        this.view.moduleSelect.setCustomValidity('');
                    }
                } catch (error) {
                    console.error("Error validando existencia de libro:", error);
                    this.view.showMessage(`No se pudo validar el libro: ${error.message}`, 'error');
                }
            } else {
                this.view.moduleSelect.setCustomValidity('');
            }
        });

        this.view.bookForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const bookData = this.view.getFormData();
            this.handleSubmitBook(bookData);
        });

        this.view.booksList.addEventListener('click', (event) => {
            const target = event.target.closest('button');

            if (target && target.classList.contains('btn-remove')) {
                const bookId = target.getAttribute('data-book-id');
                this.handleRemoveBook(bookId);
            }

            if (target && target.classList.contains('btn-cart')) {
                const bookId = target.getAttribute('data-book-id');
                this.handleAddToCart(bookId);
            }

            if (target && target.classList.contains('btn-edit')) {
                const bookId = target.getAttribute('data-book-id');
                this.handleEditBook(bookId);
            }
        });

        if (this.view.resetButton) {
            this.view.resetButton.addEventListener('click', () => {
                this.handleReset();
            });
        }
    }

    handleEditBook(bookId) {
        const idToEdit = String(bookId);

        try {
            const book = this.booksModel.getBookById(idToEdit);
            this.view.fillFormForEdit(book);

            this.view.showMessage(`Editando libro con ID: ${idToEdit}.`, 'info');

        } catch (error) {
            console.error("Error al preparar la edición:", error);
            this.view.showMessage(`Error al editar: ${error.message}`, 'error');
        }
    }

    handleReset() {
        this.view.resetFormForAdd();
        this.view.showMessage('Formulario reiniciado y recargando los datos...', 'info');
        this.init();
    }

    reloadBooksView() {
        const books = this.booksModel.getBooks();
        this.renderAllBooks(books);
    }

    handleAddToCart(bookId) {
        const idToAdd = String(bookId);

        try {
            const book = this.booksModel.getBookById(idToAdd);

            this.cartModel.addItem(book);

            this.view.showMessage(`Libro ${idToAdd} añadido al carrito. Total: ${this.cartModel.data.length} libros.`, 'success');
            console.log(this.cartModel.toString());

        } catch (error) {
            console.error("Error al añadir al carrito:", error);
            this.view.showMessage(`Error al añadir al carrito: ${error.message}`, 'error');
        }
    }

    async handleSubmitBook(bookData) {
        try {
            const isEditing = !!bookData.id;

            if (!isEditing) {
                delete bookData.id;
            }

            if (!bookData.userId || bookData.userId === '') {
                bookData.userId = 1;
            }
            bookData.userId = Number(bookData.userId);

            let finalBook;

            if (isEditing) {
                finalBook = await this.booksModel.changeBook(bookData);
                this.view.showMessage(`Libro con ID ${finalBook.id} actualizado correctamente.`, 'success');
            } else {
                finalBook = await this.booksModel.addBook(bookData);
                this.view.showMessage(`Libro con ID ${finalBook.id} añadido correctamente.`, 'success');
            }

            const moduleCodeString = String(finalBook.moduleCode);
            const moduleLiteral = this.modulesModel.getModuleByCode(moduleCodeString)?.cliteral || 'Módulo Desconocido';
            const moduleName = `${moduleLiteral} (${finalBook.moduleCode})`;

            this.view.renderBook(finalBook, moduleName);
            this.view.resetFormForAdd();

        } catch (error) {
            console.error(`Error al ${isEditing ? 'editar' : 'añadir'} el libro:`, error);
            this.view.showMessage(`Error al ${isEditing ? 'editar' : 'añadir'} el libro: ${error.message}`, 'error');
        }
    }

    async handleRemoveBook(bookId) {
        const idToRemove = String(bookId);

        if (!idToRemove || idToRemove === 'null' || idToRemove.trim() === '') {
            this.view.showMessage(`Error: El ID del libro es inválido.`, 'error');
            return;
        }

        try {
            await this.booksModel.removeBook(idToRemove);
            this.reloadBooksView();

            this.view.showMessage(`Libro con ID ${idToRemove} eliminado correctamente.`, 'info');

        } catch (error) {
            if (error.message.includes('404') || error.message.includes('Not Found')) {
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