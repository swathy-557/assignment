const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskSubjectInput = document.getElementById('taskSubject');
const taskPriorityInput = document.getElementById('taskPriority');
const taskDateInput = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('academic_tasks')) || [];
let currentFilter = 'all';

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newTask = {
        id: Date.now(),
        title: taskTitleInput.value,
        subject: taskSubjectInput.value,
        priority: taskPriorityInput.value,
        date: taskDateInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveAndDisplay();
    taskForm.reset();
});

function saveAndDisplay() {
    localStorage.setItem('academic_tasks', JSON.stringify(tasks));
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = '';

    let remainingCount = 0;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (!task.completed) {
            remainingCount++;
        }

        if (currentFilter === 'pending' && task.completed) continue;
        if (currentFilter === 'completed' && !task.completed) continue;

        const li = document.createElement('li');
        li.className = task.completed ? 'task-item completed' : 'task-item';

        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <div class="task-details">
                    <span class="task-title">${task.title}</span>
                    <div class="task-meta">
                        <span class="badge-subject">${task.subject}</span>
                        <span class="badge-priority-${task.priority}">● ${task.priority}</span>
                        <span>📅 ${task.date}</span>
                    </div>
                </div>
            </div>
            <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️</button>
        `;

        taskList.appendChild(li);
    }

    taskCounter.innerText = remainingCount + " tasks remaining";
}

function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    saveAndDisplay();
}

function deleteTask(id) {
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    saveAndDisplay();
}

for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener('click', function() {
        for (let j = 0; j < filterBtns.length; j++) {
            filterBtns[j].classList.remove('active');
        }
        this.classList.add('active');
        
        currentFilter = this.getAttribute('data-filter');
        displayTasks();
    });
}

displayTasks();