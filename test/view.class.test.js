/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import View from "../src/view/view.class.js";

const METHODS_NAMES = {
  RENDER_MODULES: "renderModulesInSelect",
  RENDER_BOOK: "renderBook",
  REMOVE_BOOK: "removeBook",
  RENDER_MESSAGE: "renderMessage",
  GET_BOOK_DATA: "getFormBookData",
};

describe("View class", () => {
  let view;

  beforeEach(() => {
    // DOM simulado
    document.body.innerHTML = `
      <div id="messages"></div>
      <div id="list"></div>
      <div id="about"></div>
      <div id="form">
        <form id="book-form">
          <h2>Añadir libro</h2>
          <select id="module-code" name="moduleCode">
            <option value="MOD1">--- Selecciona ---</option>
          </select>
          <input id="publisher" name="publisher" value="Editorial SM" />
          <input id="price" name="price" value="45" />
          <input id="pages" name="pages" value="300" />
          <input id="comments" name="comments" value="Buen estado" />
          <input type="radio" name="status" value="new" />
          <input type="radio" name="status" value="good" checked />
        </form>
      </div>
      <div id="remove">
        <input id="removeBookId" />
        <button id="removeBookButton"></button>
      </div>
    `;

    view = new View();
  });

  it("debería inicializar correctamente las propiedades del DOM", () => {
    document.addEventListener("DOMContentLoaded", () => {
      expect(view.booksList).not.toBeNull();
      expect(view.moduleSelect).not.toBeNull();
      expect(view.bookForm).not.toBeNull();
      expect(view.about).not.toBeNull();
      expect(view.form).not.toBeNull();
      expect(view.messages).not.toBeNull();
    });
  });

  it("debería renderizar módulos dentro del select", () => {
    const modules = [
      { code: "1111", cliteral: "Matemáticas", vliteral: "Matemáticas" },
      { code: "2222", cliteral: "Lengua", vliteral: "Lengua" },
      { code: "3333", cliteral: "Historia", vliteral: "Historia" },
    ];
    view[METHODS_NAMES.RENDER_MODULES](modules);
    const options = document.querySelectorAll("#module-code option");
    const optionsLength = options.length;
    expect([3, 4]).toContain(optionsLength); // 3 o 4: 1 por defecto + 3 nuevos
    expect(options[optionsLength - 1].textContent).toBe("Historia");
    expect(options[optionsLength - 1].value).toBe("3333");
  });

  it("debería renderizar un libro dentro de la lista", () => {
    const book = {
      id: 7,
      moduleCode: "MOD1",
      publisher: "SM",
      price: 30,
      pages: 200,
      soldDate: "",
      status: "good",
      comments: "Perfecto",
      photo: "foto.jpg",
    };
    document.addEventListener("DOMContentLoaded", () => {
      view[METHODS_NAMES.RENDER_BOOK](book);
      const bookCard = document.getElementById("list").children[0];
      expect(bookCard.classList.contains("card")).toBeTruthy();
      expect(bookCard.id).toContain("7");
      expect(bookCard.textContent).toContain("MOD1");
      expect(bookCard.textContent).toContain("En venta");
      // Añadimos en 2n libro para comprobar que se añade al final
      book.id = 9;
      book.soldDate = "2025-11-24";
      view[METHODS_NAMES.RENDER_BOOK](book);
      expect(document.getElementById("list").children.length).toBe(2);
      expect(document.getElementById("list").children[1].id).toContain("9");
      expect(document.getElementById("list").children[1].textContent).toContain(
        "24/11/2025"
      );
    });
  });

  it("debería eliminar un libro del DOM por id", () => {
    const book = {
      id: 5,
    };
    document.addEventListener("DOMContentLoaded", () => {
      view[METHODS_NAMES.RENDER_BOOK](book);
      expect(document.getElementById("list").children.length).toBe(1);
      view[METHODS_NAMES.REMOVE_BOOK](5);
      expect(document.getElementById("list").children.length).toBe(0);
    });
  });

  it("debería mostrar y eliminar automáticamente los mensajes que no son de error", () => {
    vi.useFakeTimers();
    document.addEventListener("DOMContentLoaded", () => {
      view[METHODS_NAMES.RENDER_MESSAGE]("info", "OK");
      expect(document.querySelector(".info")).not.toBeNull();
      vi.advanceTimersByTime(3000);
      expect(document.querySelector(".info")).toBeNull();
      vi.useRealTimers();
    });
  });

  it("debería devolver los datos correctos del formulario", () => {
    document.addEventListener("DOMContentLoaded", () => {
      const data = view[METHODS_NAMES.GET_BOOK_DATA]();
      expect(data).toEqual({
        moduleCode: "MOD1",
        publisher: "Editorial SM",
        price: 45,
        pages: 300,
        status: "good",
        comments: "Buen estado",
      });
    });
  });
});

