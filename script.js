document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <span>${task.text}</span>
        <div class="actions">
          <button onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Complete"}</button>
          <button onclick="editTask(${index})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  };

  window.toggleComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  window.editTask = (index) => {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText) {
      tasks[index].text = newText.trim();
      saveTasks();
      renderTasks();
    }
  };

  window.deleteTask = (index) => {
    if (confirm("Delete this task?")) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = taskInput.value.trim();
    if (newTask) {
      tasks.push({ text: newTask, completed: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
    }
  });

  // === PDF DOWNLOAD ===
  document.getElementById("download-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(14);
    doc.text("To-Do List", 10, y);
    y += 10;

    if (tasks.length === 0) {
      doc.text("No tasks available.", 10, y);
    } else {
      tasks.forEach((task, index) => {
        const status = task.completed ? "[DONE]" : "[ ]";
        doc.text(`${index + 1}. ${status} ${task.text}`, 10, y);
        y += 10;
      });
    }

    doc.save("todo-list.pdf");
  });

  renderTasks();
});
