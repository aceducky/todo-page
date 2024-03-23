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
  const span = document.createElement("span");
  span.textContent = task;
  task_label.appendChild(span);
  let removeBtn = document.createElement("button");
  removeBtn.textContent = "x";
  removeBtn.setAttribute("class", "remove-btn");

 

  task_el.appendChild(task_label);
  task_el.appendChild(removeBtn);
  tasksListHeader.append(task_el);

  if (checkbox.checked) {
    checkbox.parentElement.style.textDecoration = 'line-through'
  }
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      this.parentElement.style.textDecoration = "line-through";
    } else {
      this.parentElement.style.textDecoration = "";
    }
    taskCounter();
    saveTasksToLocalStorage();
  });

  removeBtn.addEventListener("click", (e) => {
    e.target.parentElement.remove();
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
    let task = taskEl.querySelector("span").textContent;
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
