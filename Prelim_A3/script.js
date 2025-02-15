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