/**
 * @vitest-environment jsdom
 */
import { describe, test, expect, vi, beforeEach, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import mockBooks from "./fixtures/books.json";
import mockUsers from "./fixtures/users.json";
import mockModules from "./fixtures/modules.json";

import Controller from "../src/controller/controller.class";

const newBook = {
  moduleCode: "MOCK",
  publisher: "Apunts",
  price: 34,
  pages: 76,
  status: "bad",
  comments: "Muy buen estado",
};
const restHandlers = [
  http.get("http://localhost:3000/books", () => {
    return HttpResponse.json(mockBooks);
  }),
  http.get("http://localhost:3000/users", () => {
    return HttpResponse.json(mockUsers);
  }),
  http.get("http://localhost:3000/modules", () => {
    return HttpResponse.json(mockModules);
  }),
  http.post("http://localhost:3000/books", async ({ request }) => {
    const body = await request.json();
    if (body.id) return HttpResponse.error();
    if (!body.moduleCode) return HttpResponse.error();
    if (!body.publisher) return HttpResponse.error();
    // Haremos que falle si el moduleCode es 'ERROR'
    if (body.moduleCode === "ERROR") return HttpResponse.error();
    return HttpResponse.json({ id: 8, ...body });
  }),
  http.delete("http://localhost:3000/books/:id", (req, res, ctx) => {
    const id = parseInt(req.params.id);
    // Haremos que falle si el id es 99
    if (id === 99) return HttpResponse.error();
    const existentIds = mockBooks.map((book) => book.id);
    return existentIds.includes(id)
      ? HttpResponse.json({})
      : HttpResponse.notFound();
  }),
  http.put("http://localhost:3000/books/:id", async ({ request }) => {
    const id = parseInt(req.params.id);
    const body = await request.json();
    if (!body.id) return HttpResponse.error();
    if (!body.moduleCode) return HttpResponse.error();
    if (!body.publisher) return HttpResponse.error();
    // Haremos que falle si el id es 99
    if (id === 99) return HttpResponse.error();
    return HttpResponse.json(body);
  }),
];

const server = setupServer(...restHandlers);

describe("Controller", () => {
  let controller;

  beforeEach(async () => {
    server.listen({ onUnhandledRequest: "error" });

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
    controller = new Controller();
    await controller.init();
  });
  afterAll(() => {
    server.close();
  });

  test("init should display the modules in the select", async () => {
    expect(
      document.querySelectorAll("#module-code option").length
    ).toBeGreaterThanOrEqual(mockModules.length);
  });

  test("init should display the books in the list", async () => {
    const books = document.querySelectorAll("#list>div");
    expect(books.length).toBe(mockBooks.length);
  });
/*
  test("handleSubmitBook should be called when the form is submitted", async () => {
    const handleSubmitBookSpy = vi.spyOn(controller, "handleSubmitBook");
    await controller.init();
    expect(handleSubmitBookSpy).toHaveBeenCalledTimes(0);
    const form = document.getElementById("bookForm");
    form.dispatchEvent(new Event("submit"));
    expect(handleSubmitBookSpy).toHaveBeenCalledTimes(1);
    expect(handleSubmitBookSpy).toHaveBeenCalledWith({
      moduleCode: "MOCK",
      publisher: "Apunts",
      price: 34 || "34",
      pages: 76 || "76",
      status: "bad",
      comments: "Muy buen estado",
    });
  });*/

  test("handleSubmitBook should display a book when called and display an info message", async () => {
    await controller.handleSubmitBook(newBook);
    console.log(JSON.stringify(this.view));
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(mockBooks.length + 1);
    expect(cards[mockBooks.length].textContent).toContain(newBook.moduleCode);
    console.log(document.getElementById('messages').innerHTML);
    expect(controller.view.messages.children.length).toBe(1);
    expect(controller.view.messages.children[0].classList.contains("error")).toBe(true);
    expect(controller.view.messages.children[0].classList.contains("info")).toBe(true);
  });

  test("handleSubmitBook should NOT display the book when the server fails and shows an error message", async () => {
    server.use(
      http.post("http://localhost:3000/books", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleSubmitBook(newBook);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(3);
  });
  test("handleSubmitBook should display an error message when the server fails", async () => {
    server.use(
      http.post("http://localhost:3000/books", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleSubmitBook(newBook);
    expect(controller.view.messages.children.length).toBe(1);
    expect(
      document
        .getElementById("messages")
        .children[0].classList.contains("error")
    ).toBe(true);
  });
/*
  test("handleRemoveBook should be called when the button is clicked", async () => {
    const handleRemoveBookSpy = vi.spyOn(controller, "handleRemoveBook");
    await controller.init();
    expect(handleRemoveBookSpy).toHaveBeenCalledTimes(0);
    const button = document.getElementById("remove");
    button.dispatchEvent(new Event("click"));
    expect(handleRemoveBookSpy).toHaveBeenCalledTimes(1);
    expect(handleRemoveBookSpy).toHaveBeenCalledWith("1");
  });*/

  test("handleRemoveBook should remove a book when called", async () => {
    await controller.handleRemoveBook(3);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(2);
    cards.forEach((card) => {
      expect(card.textContent).not.toContain("good");
    });
  });

  test("handleRemoveBook should display an info message when it works", async () => {
    await controller.handleRemoveBook(3);
    expect(controller.view.messages.children.length).toBe(1);
    expect(controller.view.messages.children[0].classList.contains("info")).toBe(true);
  });

  test("handleRemoveBook should NOT remove a book when the server fails", async () => {
    server.use(
      http.delete("http://localhost:3000/books/3", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleRemoveBook(3);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(3);
  });
  test("handleRemoveBook should display an error message when the server fails", async () => {
    server.use(
      http.delete("http://localhost:3000/books/3", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleRemoveBook(3);
    expect(controller.view.messages.innerHTML).toContain("error");
  });
  test("handleRemoveBook should NOT remove a book when the id does not exist and should display an error message", async () => {
    await controller.handleRemoveBook(100);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(3);
    expect(controller.view.messages.children.length).toBe(1);
    expect(controller.view.messages.children[0].classList.contains("error")).toBe(true);
  });
  test("init should display an error message when the server fails", async () => {
    server.use(
      http.get("http://localhost:3000/books", () => {
        return HttpResponse.error();
      })
    );
    await controller.init();
    expect(controller.view.messages.innerHTML).toContain("error");
  });
});
