const todoInput = document.querySelector("#input");
const list = document.querySelector(".todo-list");
const template = document.querySelector("#todo-item-template");
const LOCAL_STORAGE_PREFIX = "FEM_TODO_LIST";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();

todos.forEach(renderTodo);

todoInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    const todoName = todoInput.value;
    if (todoName == "") return;
    const newTodo = {
      id: new Date().valueOf().toString(),
      name: todoName,
      complete: false,
    };
    todos.push(newTodo);
    renderTodo(newTodo);
    saveTodo();
    todoInput.value = "";
  }
});

list.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return;

  const parent = e.target.closest(".todo-item");
  const todoId = parent.dataset.todoId;
  parent.remove();
  todos = todos.filter((todo) => todo.id !== todoId);
  saveTodo();
});

list.addEventListener("click", (e) => {
  const parent = e.target.closest(".todo-item");
  const todoId = parent.dataset.todoId;
  const todo = todos.find((t) => t.id === todoId);
  if (!todo) return;
  todo.complete = !todo.complete;

  if (todo.complete) {
    parent.classList.add("completed");
    parent.children[0].children[0].classList.remove("check-icon");
  } else {
    parent.classList.remove("completed");
    parent.children[0].children[0].classList.add("check-icon");
  }

  saveTodo();
});

function renderTodo(todo) {
  const templateClone = template.content.cloneNode(true);
  const listItem = templateClone.querySelector(".todo-item");
  listItem.dataset.todoId = todo.id;
  const textElement = templateClone.querySelector(".todo-text");
  textElement.textContent = todo.name;

  if (todo.complete) {
    listItem.classList.add("completed");
  }
  list.appendChild(templateClone);
}

function saveTodo() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const todoStrings = localStorage.getItem(TODOS_STORAGE_KEY);
  return JSON.parse(todoStrings) || [];
}
