// Task management system
let tasks = [];
let currentFilter = "all";

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
  updateStats();
});

// Add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  taskInput.value = "";

  saveTasks();
  renderTasks();
  updateStats();
}

// Toggle task completion
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
  }
}

// Edit task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    const newText = prompt("Edit task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
}

// Remove task
function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
  updateStats();
}

// Filter tasks
function filterTasks(filter) {
  currentFilter = filter;

  // Update filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  renderTasks();
}

// Clear completed tasks
function clearCompleted() {
  const completedCount = tasks.filter((t) => t.completed).length;
  if (completedCount === 0) {
    alert("No completed tasks to clear!");
    return;
  }

  if (confirm(`Clear ${completedCount} completed task(s)?`)) {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
  }
}

// Render tasks based on current filter
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "empty-state";
    emptyMsg.textContent =
      currentFilter === "all"
        ? "No tasks yet. Add one above!"
        : currentFilter === "active"
        ? "No active tasks!"
        : "No completed tasks!";
    taskList.appendChild(emptyMsg);
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.completed ? "checked" : ""} 
               onchange="toggleTask(${task.id})" />
        <span class="task-text" ${
          task.completed
            ? 'style="text-decoration: line-through; opacity: 0.6;"'
            : ""
        }>
          ${task.text}
        </span>
      </div>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${
          task.id
        })" title="Edit">✏️</button>
        <button class="delete-btn" onclick="removeTask(${
          task.id
        })" title="Delete">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Update task statistics
function updateStats() {
  const activeTasks = tasks.filter((t) => !t.completed).length;
  const totalTasks = tasks.length;
  const completedTasks = totalTasks - activeTasks;

  const statsElement = document.getElementById("taskStats");
  statsElement.textContent = `${activeTasks} task${
    activeTasks !== 1 ? "s" : ""
  } remaining`;

  // Add completion percentage
  if (totalTasks > 0) {
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    statsElement.textContent += ` • ${percentage}% completed`;
  }
}

// Local storage functions
function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("todoTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}
