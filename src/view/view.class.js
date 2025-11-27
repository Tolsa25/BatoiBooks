class View {
    constructor() {
        this.booksList = document.querySelector('#list'); 
        this.about = document.querySelector('#acercaDe'); 
        this.form = document.querySelector('#form-section'); 
        this.bookForm = document.querySelector('#addBookForm'); 
        this.moduleSelect = document.querySelector('#moduleCode'); 
        this.messagesContainer = document.querySelector('#messages-container'); 
        this.messages = document.querySelector('#messages-alert'); 
        
        this.formTitle = this.form ? this.form.querySelector('h2') : null; 
        this.idInputGroup = this.bookForm.querySelector('.hidden-id-group'); 
        this.idInput = this.bookForm.querySelector('#bookId'); 
        this.submitButton = this.bookForm ? this.bookForm.querySelector('button[type="submit"]') : null;
        
        this.removeInput = document.querySelector('#remove-id');
        this.removeButton = document.querySelector('#remove-button');
        this.resetButton = document.querySelector('#reset');
        
        this.messages.style.display = 'none'; 
    }

    completeModuleSelect(modulesArray) {
        const defaultOption = this.moduleSelect.querySelector('option[value=""]');
        this.moduleSelect.innerHTML = '';
        if (defaultOption) {
             this.moduleSelect.appendChild(defaultOption);
        } else {
             this.moduleSelect.innerHTML = `<option value="" disabled selected>Selecciona un módulo</option>`;
        }
        
        modulesArray.forEach(module => {
            const option = document.createElement('option');
            option.value = module.code;
            option.textContent = `${module.cliteral} (${module.code})`;
            this.moduleSelect.appendChild(option);
        });
    }

    getFormData() {
        const formData = new FormData(this.bookForm);
        const data = {};

        for (const [key, value] of formData.entries()) {
            const dataKey = (key === 'bookId' && this.idInput && this.idInput.disabled) ? 'id' : key;
            data[dataKey] = value;
        }

        if (this.idInput && this.idInput.disabled) {
            data.id = this.idInput.value; 
        } else {
            if (data.id === "" || data.bookId === "") {
                delete data.id;
                delete data.bookId; 
            }
        }

        data.price = parseFloat(data.price) || 0;
        data.pages = parseInt(data.pages) || 0;
        
        data.comments = data.comments || "";
        data.photo = data.photo || ""; 
        
        if (data.photo === undefined) data.photo = ""; 
        
        if (data.soldDate) delete data.soldDate; 
        
        return data;
    }

    fillFormForEdit(book) {
        if (this.formTitle) {
            this.formTitle.textContent = 'Editar libro';
        }

        if (this.idInputGroup && this.idInput) {
            this.idInputGroup.style.display = 'grid'; 
            this.idInput.value = book.id;
            this.idInput.disabled = true; 
        }
        
        this.bookForm.querySelector('#userId').value = book.userId;
        this.bookForm.querySelector('#moduleCode').value = book.moduleCode;
        this.bookForm.querySelector('#publisher').value = book.publisher;
        this.bookForm.querySelector('#price').value = book.price;
        this.bookForm.querySelector('#pages').value = book.pages;
        
        const photoInput = this.bookForm.querySelector('#photo');
        if (photoInput) photoInput.value = book.photo || ""; 

        this.bookForm.querySelector('#comments').value = book.comments;

        const statusInputs = this.bookForm.querySelectorAll('input[name="status"]');
        statusInputs.forEach(input => {
            input.checked = (input.value === book.status);
        });
        
        if (this.submitButton) {
            this.submitButton.textContent = 'Guardar Cambios';
        }
        
        this.form.scrollIntoView({ behavior: 'smooth' });
    }

    resetFormForAdd() {
        if (this.formTitle) {
            this.formTitle.textContent = 'Añadir Nuevo Libro'; 
        }
        
        if (this.idInputGroup && this.idInput) {
            this.idInputGroup.style.display = 'none'; 
            this.idInput.value = ''; 
            this.idInput.disabled = false; 
        }
        
        if (this.submitButton) {
            this.submitButton.textContent = 'Añadir';
        }
        
        if (typeof this.bookForm.reset === 'function') {
             this.bookForm.reset(); 
        }
    }

    renderBook(book, moduleName) {

        const saleInfo = book.soldDate && book.soldDate !== "" 
            ? `Vendido el ${new Date(book.soldDate).toLocaleDateString()}` 
            : `En venta`;
            
        const imgSrc = book.photo && book.photo !== "" ? book.photo : 'assets/default-book.png';

        const existingCard = this.booksList.querySelector(`[data-book-id="${book.id}"]`);
        
        const cardDiv = existingCard || document.createElement('div');
        if (!existingCard) {
            cardDiv.classList.add('cardBook');
            cardDiv.setAttribute('data-book-id', book.id);
        }

        cardDiv.innerHTML = `
            <div class="card-img">
                <img src="${imgSrc}" alt="Libro: ${book.id}">
            </div>
            <div class="card-body">
                <h3>${moduleName} (${book.id})</h3> 
                <h4>${book.publisher}</h4>
                <p>${book.pages} páginas</p>
                <p>Estado: ${book.status}</p>
                <p>${saleInfo}</p> 
                <p>${book.comments || 'Sin comentarios.'}</p>
                <h4>${book.price} €</h4>

                <div class="card-actions-container">
                    <button class="btn-cart" data-book-id="${book.id}">
                        <span class="material-icons">add_shopping_cart</span>
                    </button>

                    <button class="btn-edit" data-book-id="${book.id}">
                        <span class="material-icons">edit</span>
                    </button>

                    <button class="btn-remove" data-book-id="${book.id}">
                        <span class="material-icons">delete</span>
                    </button>  
                </div>          
            </div>
        `;
        
        if (!existingCard) {
            this.booksList.appendChild(cardDiv);
        }
    }

    removeBook(bookId) {
        const bookElement = this.booksList.querySelector(`[data-book-id="${bookId}"]`);
        if (bookElement) {
            bookElement.remove();
            return true;
        }
        return false;
    }

    showMessage(message, type = 'info') {
        const alertType = type === 'error' ? 'danger' : (type === 'success' ? 'success' : 'info');

        this.messages.style.display = 'flex'; 

        this.messages.className = `tipoRecibido alert alert-${alertType} alert-dismissible`;
        this.messages.setAttribute('role', 'alert');

        this.messages.innerHTML = `
            <p style="margin: 0; flex-grow: 1;">${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" 
                    onclick="this.parentElement.style.display='none'; this.parentElement.className = 'tipoRecibido';">
                x
            </button>
        `;

        if (type !== 'error') {
            setTimeout(() => {
                if (this.messages && this.messages.style.display !== 'none') {
                    this.messages.style.display = 'none';
                    this.messages.className = 'tipoRecibido';
                }
            }, 3000);
        }
    }
}

export default View;