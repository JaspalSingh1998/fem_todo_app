const todos = Array.from(document.querySelectorAll(".todo-item"));

todos.forEach((todo) => {
  todo.addEventListener("click", (e) => {
    todo.classList.toggle("completed");
    todo.children[0].children[0].classList.toggle("check-icon");
  });
});
