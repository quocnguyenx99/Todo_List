const $ = document.querySelector.bind(document);

let todoItems = [];

const form = $(".js-form");
const list = $(".js-todo-list");
const filterAll = $(".filterAll");
const filterActive = $(".filterActive");
const filterCompleted = $(".filterCompleted");
const clearAllCompleted = $(".clear-completed");
const count = $("strong");

// Add todo
function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $(".js-todo-input");

  const text = input.value.trim();
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

// Render todo
function renderTodo(todo) {
  // Set Local Storage
  localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));
  const item = $(`[data-key='${todo.id}']`);

  // count items left
  count.innerHTML = todoItems.filter((item) => item.checked === false).length;

  // check deleted prop
  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  const isChecked = todo.checked ? "done" : "";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
    <div class="view">
      <input id="${todo.id}" type="checkbox"/>
      <lable for="${todo.id}" class="tick js-tick"></lable>
      <span class="todo-text">${todo.text}</span>
      <button class="delete-todo js-delete-todo">
        <svg>
          <use href="#delete-icon"></use>
        </svg>
      </button>
    </div>
    <input type="text" class="edit" value="${todo.text}">
  `;

  item ? list.replaceChild(node, item) : list.append(node);
}

// Get key target
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("js-tick")) {
    const itemKey = e.target.parentElement.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (e.target.classList.contains("js-delete-todo")) {
    const itemKey = e.target.parentElement.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

// Get new edit text and pass throught updateTodo function
list.addEventListener("dblclick", (e) => {
  if (e.target.classList.contains("todo-text")) {
    const itemKey = e.target.parentElement.parentElement.dataset.key;
    const li = $(`[data-key="${itemKey}"]`);
    const editText = li.lastElementChild;
    li.classList.add("editing");
    editText.focus();
    editText.select();
    editText.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        let newText = editText.value.trim();
        updateTodo(itemKey, newText);
      }
    });
  }
});

// Checked Todo
function toggleDone(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

// Delete todo
function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
}

// Update todo
function updateTodo(key, text) {
  if (text === "") deleteTodo(key);
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].text = text;
  renderTodo(todoItems[index]);
}

// Filter todo with button click All, Active, Completed
filterAll.addEventListener("click", (e) => {
  e.target.style.backgroundColor = "lightgoldenrodyellow";
  filterActive.style.backgroundColor = "transparent";
  filterCompleted.style.backgroundColor = "transparent";
  todoItems.forEach((item) => {
    renderTodo(item);
  });
});

filterActive.addEventListener("click", (e) => {
  e.target.style.backgroundColor = "lightcoral";
  filterAll.style.backgroundColor = "transparent";
  filterCompleted.style.backgroundColor = "transparent";
  todoItems.forEach((item) => {
    const li = $(`[data-key="${item.id}"]`);
    if (item.checked) {
      li.style.display = "none";
    } else {
      li.style.display = "flex";
    }
  });
});

filterCompleted.addEventListener("click", (e) => {
  e.target.style.backgroundColor = "lightgreen";
  filterAll.style.backgroundColor = "transparent";
  filterActive.style.backgroundColor = "transparent";
  todoItems.forEach((item) => {
    const li = $(`[data-key="${item.id}"]`);
    if (item.checked) {
      li.style.display = "flex";
    } else {
      li.style.display = "none";
    }
  });
});

// Set completed all button
clearAllCompleted.addEventListener("click", (e) => {
  todoItems.filter((item) => {
    if (item.checked) {
      deleteTodo(item.id);
    }
  });
});
// const emptyState = $(".empty-state");
// const filter = $(".todo-filter");
// const todoFunction = $(".todo-functions");

// get Local Storage
document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItemsRef");
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((item) => {
      renderTodo(item);
    });
  }
});
