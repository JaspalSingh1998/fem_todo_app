const todoInput = document.querySelector("#input");
const list = document.querySelector(".todo-list");
const template = document.querySelector("#todo-item-template");
const activeEl = document.querySelector(".active-todos");
const allEl = document.querySelector(".all-todos");
const completedEl = document.querySelector(".active-completed");
const mobileActiveEl = document.querySelector(".mobile-active-todos");
const mobileAllEl = document.querySelector(".mobile-all-todos");
const mobileCompletedEl = document.querySelector(".mobile-active-completed");
const clear = document.querySelector(".clear");
const count = document.querySelector(".count");
let itemC = 0;
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
  updateCount();

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
  updateCount();

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

  updateCount();
}

function saveTodo() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const todoStrings = localStorage.getItem(TODOS_STORAGE_KEY);
  return JSON.parse(todoStrings) || [];
}

function activeTodo() {
  list.innerHTML = "";
  let activeTodos = todos.filter((entry) => entry.complete !== true);
  activeTodos.forEach(renderTodo);
}

function allTodo() {
  list.innerHTML = "";
  todos.forEach(renderTodo);
}

function completedTodo() {
  list.innerHTML = "";
  let completedTodos = todos.filter((entry) => entry.complete !== false);
  completedTodos.forEach(renderTodo);
}

activeEl.addEventListener("click", (e) => {
  activeTodo();
});

allEl.addEventListener("click", (e) => {
  allTodo();
});

completedEl.addEventListener("click", (e) => {
  completedTodo();
});

mobileActiveEl.addEventListener("click", (e) => {
  activeTodo();
});

mobileAllEl.addEventListener("click", (e) => {
  allTodo();
});

mobileCompletedEl.addEventListener("click", (e) => {
  completedTodo();
});

function removeCompleted() {
  todos = todos.filter((todo) => todo.complete === false);
  list.innerHTML = "";

  todos.forEach(renderTodo);
  saveTodo();
}

clear.addEventListener("click", (e) => {
  removeCompleted();
});

function updateCount() {
  actives = todos.filter((todo) => todo.complete === false);
  itemC = actives.length;

  count.textContent = `${itemC} items left`;
}
