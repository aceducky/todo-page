const tasksListHeader = document.querySelector("#tasks-list-header");
const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const tasksCounterEl = document.querySelector("#tasks-counter");

function taskCounter() {
  let totalTasks = document.querySelectorAll(
    "#tasks-list-header .task-el"
  ).length;
  let completed = document.querySelectorAll(
    '#tasks-list-header .task-el input[type="checkbox"]:checked'
  ).length;

  if (totalTasks === 0) {
    tasksCounterEl.textContent = "No tasks";
  } else {
    tasksCounterEl.textContent = `Tasks Done: ${completed}/${totalTasks}`;
  }
}

taskCounter();

function addTask(task, state = false) {
  let task_el = document.createElement("div");
  task_el.setAttribute("class", "task-el");
  let task_label = document.createElement("label");
  task_label.setAttribute("class", "task-label");

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = state;
  task_label.appendChild(checkbox);

  const input = document.createElement("input");
  input.type = "text";
  input.value = task;
  input.disabled = true;
  task_label.appendChild(input);

  const editBtn = document.createElement("button");
  editBtn.setAttribute("class", "task-btn")
  editBtn.textContent = "E";
  editBtn.title = "edit"
  editBtn.addEventListener("mousedown", (e) => {
    e.preventDefault()
    if (editBtn.textContent === "E") {
      input.disabled = false;
      input.focus()
      editBtn.textContent = "S";
      editBtn.title = "save"
    } else {
      input.disabled = true;
      editBtn.textContent = "E";
      editBtn.title = "edit"
      saveTasksToLocalStorage();
    }
  });

  input.addEventListener("blur", () => {
    input.disabled = true;
    editBtn.textContent = "E";
    editBtn.title = "edit"
    saveTasksToLocalStorage();
  });


  let removeBtn = document.createElement("button");
  removeBtn.textContent = "x";
  removeBtn.setAttribute("class", "task-btn");
  removeBtn.title = "remove"

  task_el.appendChild(task_label);
  task_el.appendChild(editBtn)
  task_el.appendChild(removeBtn);
  tasksListHeader.append(task_el);

  if (checkbox.checked) {
    task_label.style.textDecoration = 'line-through'
  }

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      task_label.style.textDecoration = "line-through";
    } else {
      task_label.style.textDecoration = "";
    }
    taskCounter();
    saveTasksToLocalStorage();
  });

  removeBtn.addEventListener("click", () => {
    task_el.remove();
    taskCounter();
    saveTasksToLocalStorage();
  });
  taskCounter();
  saveTasksToLocalStorage();
}

function handleTaskInput() {
  let task = taskInput.value.trim();
  if (!task) {
    alert("Enter a task");
    return;
  }
  addTask(task, false);

  taskInput.value = "";
}

function saveTasksToLocalStorage() {
  let tasks = [];
  document.querySelectorAll("#tasks-list-header .task-el").forEach((taskEl) => {
    let task = taskEl.querySelector('input[type="text"]').value;
    let state = taskEl.querySelector('input[type="checkbox"]').checked;
    tasks.push({ task, state });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(({ task, state }) => addTask(task, state));
}

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleTaskInput();
    saveTasksToLocalStorage();
  }
});
addBtn.addEventListener("click", handleTaskInput);

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

