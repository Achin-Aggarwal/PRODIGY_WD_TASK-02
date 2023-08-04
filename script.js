document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("addButton");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
  
    let tasks = [];
  
    function saveTasksToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function renderTasks() {
      taskList.innerHTML = "";
      tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
          <span class="task-actions">
            ${!task.completed ? '<button class="completeButton" data-index="' + index + '">Complete Task</button>' : ''}
            <button class="editButton" data-index="${index}">Edit</button>
            <button class="deleteButton" data-index="${index}">Delete</button>
          </span>
        `;
        taskList.appendChild(listItem);
      });
      updateTaskCount();
    }
  
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText !== "") {
        const newTask = { text: taskText, completed: false };
        tasks.push(newTask);
        saveTasksToLocalStorage();
        renderTasks();
        taskInput.value = "";
      }
    }
  
    function updateTaskCount() {
      const remainingTasks = tasks.filter(task => !task.completed).length;
      taskCount.textContent = `${remainingTasks} ${remainingTasks === 1 ? 'task' : 'tasks'} remaining`;
    }
  
    function toggleTaskComplete(index) {
      tasks[index].completed = !tasks[index].completed;
      saveTasksToLocalStorage();
      renderTasks();
    }
  
    function deleteTask(index) {
      tasks.splice(index, 1);
      saveTasksToLocalStorage();
      renderTasks();
    }
  
    function editTask(index, newText) {
      tasks[index].text = newText;
      saveTasksToLocalStorage();
      renderTasks();
    }
  
    addButton.addEventListener("click", addTask);
  
    taskInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        addTask();
      }
    });
  
    taskList.addEventListener("click", function(event) {
      const target = event.target;
      if (target.classList.contains("editButton")) {
        const index = target.getAttribute("data-index");
        const newText = prompt("Edit the task:", tasks[index].text);
        if (newText !== null) {
          editTask(index, newText.trim());
        }
      } else if (target.classList.contains("deleteButton")) {
        const index = target.getAttribute("data-index");
        deleteTask(index);
      } else if (target.classList.contains("completeButton")) {
        const index = target.getAttribute("data-index");
        toggleTaskComplete(index);
      } else if (target.classList.contains("task-text")) {
        const listItem = target.parentNode;
        const index = listItem.querySelector(".editButton").getAttribute("data-index");
        toggleTaskComplete(index);
      }
    });
  
   
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();
  });