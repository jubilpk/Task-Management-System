document.getElementById('addTaskBtn').addEventListener('click', addTask);

const taskContainer = document.getElementById('taskContainer');

// Function to add a new task
function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();
    const taskDueDate = document.getElementById('taskDueDate').value;

    if (!taskName || !taskDescription || !taskDueDate) {
        alert('Please fill in all fields.');
        return;
    }

    const task = {
        name: taskName,
        description: taskDescription,
        due_date: taskDueDate,
    };

    fetch('/task_management/backend/tasks.php', {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error adding task:', data.error);
                alert('Failed to add task.');
            } else {
                renderTasks(); // Refresh task list
                clearTaskInputs();
            }
        })
        .catch(error => console.error('Error adding task:', error));
}

// Function to clear input fields
function clearTaskInputs() {
    document.getElementById('taskName').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
}

// Function to load tasks from the backend
function renderTasks() {
    fetch('/task_management/backend/tasks.php')
        .then(response => response.json())
        .then(tasks => {
            taskContainer.innerHTML = ''; // Clear existing tasks
            tasks.forEach(task => {
                const taskRow = createTaskRow(task);
                taskContainer.appendChild(taskRow);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Helper function to create a task row
function createTaskRow(task) {
    const taskRow = document.createElement('div');
    taskRow.classList.add('task-row', task.status);
    taskRow.style.backgroundColor = task.status === 'completed' ? 'lightgreen' : 'white';

    taskRow.innerHTML = `
        <div class="task-item">${task.name}</div>
        <div class="task-item">${task.description}</div>
        <div class="task-item">${task.due_date}</div>
        <div class="task-item">
            <button onclick="updateStatus(this, ${task.id},'${task.name}','${task.description}','${task.due_date}')" data-status="${task.status}" class="status-btn">
                ${task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
            </button>
            <button onclick="editTask(${task.id})" class="edit-btn">Edit</button>
            <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
        </div>
    `;

    return taskRow;
}

// Function to delete a task
function deleteTask(taskId) {
    fetch('/task_management/backend/tasks.php', {
        method: 'DELETE',
        body: JSON.stringify({ id: taskId }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error deleting task:', data.error);
                alert('Failed to delete task.');
            } else {
                renderTasks(); // Refresh task list
            }
        })
        .catch(error => console.error('Error deleting task:', error));
}

// Function to update task status
function updateStatus(button, taskId, name, description, due_date) {
    const st =  button.getAttribute('data-status');
    const status = (st=="pending")?"completed":"pending";
    console.log(status);
    fetch('/task_management/backend/tasks.php', {
        method: 'PUT',
        body: JSON.stringify({ id: taskId,name:name,description:description,due_date:due_date,status: status }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error updating status:', data.error);
                alert('Failed to update task status.');
            } else {
                const taskRow = button.closest('.task-row');
                if (taskRow) {
                    taskRow.classList.remove('pending', 'completed');
                    taskRow.classList.add(status);
                    taskRow.style.backgroundColor = status === 'completed' ? 'lightgreen' : 'white';
                    button.textContent = status === 'completed' ? 'Mark Pending' : 'Mark Completed';
                    button.setAttribute('data-status', status);
                }
            }
        })
        .catch(error => console.error('Error updating task status:', error));
}

// Function to edit a task
function editTask(taskId) {
    fetch(`/task_management/backend/tasks.php?id=${taskId}`)
        .then(response => response.json())
        .then(task => {
            if (task.error) {
                console.error('Error fetching task:', task.error);
                alert('Failed to fetch task details.');
            } else {
                console.log(task);
                // Populate the modal inputs
                document.getElementById('editTaskName').value = task.name;
                document.getElementById('editTaskDescription').value = task.description;
                document.getElementById('editTaskDueDate').value = task.due_date;
                document.getElementById('editTaskStatus').value = task.status;

                // Show modal
                document.getElementById('editModal').classList.add('show');

                // Attach save event
                document.getElementById('editTaskForm').onsubmit = function (event) {
                    event.preventDefault();
                    saveEditTask(taskId);
                };
            }
        })
        .catch(error => console.error('Error fetching task for edit:', error));
}

// Function to save edits for a task
function saveEditTask(taskId) {
    const updatedTask = {
        id: taskId,
        name: document.getElementById('editTaskName').value.trim(),
        description: document.getElementById('editTaskDescription').value.trim(),
        due_date: document.getElementById('editTaskDueDate').value,
        status: document.getElementById('editTaskStatus').value,
    };

    fetch('/task_management/backend/tasks.php', {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error saving edits:', data.error);
                alert('Failed to save task edits.');
            } else {
                renderTasks(); // Refresh task list
                closeEditModal();
            }
        })
        .catch(error => console.error('Error saving edits:', error));
}

// Function to close the edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

// Load tasks on page load
document.addEventListener('DOMContentLoaded', renderTasks);
