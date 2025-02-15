
###  Dynamic To-Do List with Bootstrap 5 and DOM Manipulation

#### Objective:
To create a dynamic, interactive to-do list application using HTML, Bootstrap for styling, and vanilla JavaScript for DOM manipulation.

### Steps:

#### 1. Setup HTML and Bootstrap:
Create a basic HTML structure and include Bootstrap for styling.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic To-Do List</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
    
    <style>
        /* Global Styles */
        body {
            background: linear-gradient(135deg, #74ebd5, #acb6e5);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Main Container */
        .container {
            max-width: 600px;
            background-color: #fff;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease;
        }

        .container:hover {
            transform: scale(1.02);
        }

        /* Task Item Design */
        .list-group-item {
            margin-bottom: 10px;
            border: none;
            border-radius: 10px;
            padding: 15px;
            background-color: #f9f9f9;
            transition: background-color 0.3s, transform 0.3s;
        }

        .list-group-item:hover {
            background-color: #e9ecef;
            transform: scale(1.01);
        }

        /* Priority Colors */
        .priority-high {
            border-left: 5px solid #dc3545;
        }

        .priority-medium {
            border-left: 5px solid #ffc107;
        }

        .priority-low {
            border-left: 5px solid #198754;
        }

        /* Done Task */
        .task-done {
            text-decoration: line-through;
            opacity: 0.6;
        }

        /* Overdue Highlight */
        .overdue {
            color: red;
            font-weight: bold;
        }

        /* Buttons */
        button {
            margin-left: 5px;
            transition: transform 0.2s ease, background-color 0.2s;
        }

        button:hover {
            transform: scale(1.1);
        }

        /* Add Button */
        #addTaskButton {
            background: linear-gradient(135deg, #007bff, #6610f2);
            border: none;
        }

        #addTaskButton:hover {
            background: linear-gradient(135deg, #0056b3, #520dc2);
        }

        /* Edit, Done, Delete Buttons */
        .edit-button {
            background-color: #ffc107;
            color: white;
            border: none;
        }

        .done-button {
            background-color: #28a745;
            color: white;
            border: none;
        }

        .delete-button {
            background-color: #dc3545;
            color: white;
            border: none;
        }

        .edit-button:hover {
            background-color: #e0a800;
        }

        .done-button:hover {
            background-color: #218838;
        }

        .delete-button:hover {
            background-color: #c82333;
        }
    </style>
</head>
<body>
    <div class="container mt-5 shadow-lg p-4 rounded bg-white">
        <h1 class="text-center mb-4 text-primary">📋 My To-Do List</h1>
        
        <!-- Task Input Section -->
        <div class="input-section row g-2 mb-3">
            <div class="col-sm-5">
                <input type="text" id="taskInput" class="form-control" placeholder="Add a new task">
            </div>
            <div class="col-sm-3">
                <input type="date" id="dueDate" class="form-control">
            </div>
            <div class="col-sm-2">
                <select id="priority" class="form-select">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div class="col-sm-2 d-grid">
                <button class="btn btn-primary" id="addTaskButton">Add Task</button>
            </div>
        </div>

        <!-- Task List -->
        <ul class="list-group" id="taskList"></ul>
    </div>

    <script src="script.js"></script>
</body>
</html>

```

#### 2. Create the Script:
Create a JavaScript file (`script.js`) to handle the DOM manipulation and functionality.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priority');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const task = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (!task) {
            alert("Task cannot be empty!");
            return;
        }

        const listItem = document.createElement('li');
        listItem.className = `list-group-item d-flex justify-content-between align-items-center ${getPriorityClass(priority)}`;
        listItem.innerHTML = `
            <span>${task} - <strong>${priority}</strong> ${dueDate ? ` (Due: ${dueDate})` : ''}</span>
            <div>
                <button class="btn btn-sm btn-warning edit-button">Edit</button>
                <button class="btn btn-sm btn-success done-button">Done</button>
                <button class="btn btn-sm btn-danger delete-button">Delete</button>
            </div>
        `;

        taskList.appendChild(listItem);
        saveTasks();
        clearInputs();
    }

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest("li");

        if (e.target.classList.contains('delete-button')) {
            listItem.remove();
        } 
        else if (e.target.classList.contains('done-button')) {
            listItem.classList.toggle('list-group-item-success');
        } 
        else if (e.target.classList.contains('edit-button')) {
            editTask(listItem);
        }

        saveTasks();
    });

    function editTask(listItem) {
        const textSpan = listItem.querySelector('span');
        const currentText = textSpan.textContent.split(" - ")[0];
        taskInput.value = currentText;
        listItem.remove();
        saveTasks();
    }

    function getPriorityClass(priority) {
        return priority === "High" ? "list-group-item-danger" : 
               priority === "Medium" ? "list-group-item-warning" : 
               "list-group-item-light";
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#taskList li").forEach((li) => {
            tasks.push(li.innerHTML);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(taskHtml => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = taskHtml;
            taskList.appendChild(listItem);
        });
    }

    function clearInputs() {
        taskInput.value = "";
        dueDateInput.value = "";
        priorityInput.value = "Low";
    }
});

```

### Tasks:

1. **Basic Functionality**:
   - Implement the ability to add new tasks to the list.
   - Implement the ability to mark tasks as done and strike through the task text.
   - Implement the ability to delete tasks from the list.

2. **Enhancements**:
   - Add functionality to edit existing tasks.
   - Save tasks to `localStorage` so that they persist even after the page is refreshed.
   - Add validation to ensure no empty tasks are added.

3. **Additional Challenges** (optional):
   - Implement task sorting by priority.
   - Implement due dates for tasks and highlight overdue tasks.
   - Allow users to mark tasks as high, medium, or low priority and sort accordingly.

4. **Submission Instructions**:
   - Create a GitHub repository named in the following format: **BSIT_[SECTION]_A2_LASTNAME_FIRSTNAME**.
   - Do **NOT** submit the project as a ZIP file.
   - Put the files inside a folder named PRELIM_A2
