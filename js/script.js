document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const notification = document.getElementById('notification');
    const addButton = document.getElementById('add');
    const closeButton = document.querySelector('.btn-close');
    const primaryButton = document.querySelector('.primary');
    const taskInput = document.getElementById('task');
    const taskList = document.querySelector('ul');

    // Function to display notification with a message
    function showNotification(message, type = 'success') {
        notification.textContent = message; // Set notification text
        notification.className = `notification ${type} show`; // Apply notification styles
        setTimeout(() => {
            notification.classList.remove('show'); // Hide notification after 3 seconds
        }, 3000); 
    }

    // Event listener for opening the task modal
    addButton.addEventListener('click', () => {
        const modal = document.querySelector('.mod');
        modal.style.display = 'flex'; // Show modal
        modal.style.visibility = 'visible';
        document.getElementById('main-content').style.display = 'none'; // Hide main content
    });

    // Event listener for closing the task modal
    closeButton.addEventListener('click', () => {
        document.querySelector('.mod').style.display = 'none'; // Hide modal
        document.getElementById('main-content').style.display = 'flex'; // Show main content
    });

    // Event listener for adding a new task
    primaryButton.addEventListener('click', () => {
        const task = taskInput.value.trim(); // Get input value and remove extra spaces
        if (task !== "") {
            const newListItem = document.createElement('li');
            const tasksArray = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks from localStorage
            tasksArray.push({ task }); // Add new task to array
            saveLocalStorage(tasksArray); // Save updated array to localStorage
            newListItem.classList.add('li', 'add-item-transition'); // Add class for animation
            newListItem.innerHTML = `
                <div class="li">
                    <i class="fa-regular fa-circle"></i> ${task} 
                    <i class="fa-solid fa-trash"></i>
                </div>
            `;
            taskList.appendChild(newListItem); // Add new task to the task list
            taskInput.value = ""; // Clear input field

            document.querySelector('.mod').style.display = 'none'; // Hide modal
            document.getElementById('main-content').style.display = 'flex'; // Show main content
            setTimeout(() => {
                newListItem.classList.remove('add-item-transition'); // Remove transition class
            }, 1000);

            showNotification('Task added successfully.'); // Show success notification
        } else {
            showNotification('Please enter a task.', 'error'); // Show error notification
        }
    });

    // Event listener for task list actions (mark as complete, delete, edit)
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-circle')) {
            // Mark task as complete
            e.target.classList.remove('fa-circle');
            e.target.classList.add('fa-check-circle');
            e.target.style.color = 'green'; // Change icon color to green
        } else if (e.target.classList.contains('fa-check-circle')) {
            // Mark task as incomplete
            e.target.classList.remove('fa-check-circle');
            e.target.classList.add('fa-circle');
            e.target.style.color = 'black'; // Change icon color to black
        } else if (e.target.classList.contains('fa-trash')) {
            // Delete task
            const listItem = e.target.parentElement.parentElement;
            const taskText = e.target.previousSibling.textContent.trim(); // Get task text
            setTimeout(() => {
                listItem.classList.add('remove-item-transition'); // Add transition class for removal
            }, 1000);

            setTimeout(() => {
                listItem.remove(); // Remove task item from the DOM
                let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                tasks = tasks.filter(taskObj => taskObj.task !== taskText); // Remove task from array
                saveLocalStorage(tasks); // Save updated array to localStorage
                showNotification('Task removed successfully.'); // Show success notification
            }, 1500);
        } else if (e.target.tagName === 'DIV') {
            // Edit task
            const currentText = e.target.textContent.trim(); // Get current task text
            e.target.innerHTML = `
                <i class="fa-regular fa-circle"></i>
                <input type="text" value="${currentText}" class="edit-input"> 
                <i class="fa-solid fa-trash"></i>
            `;
            const input = e.target.querySelector('.edit-input');
            input.focus(); // Focus on input field

            input.addEventListener('blur', () => {
                saveEditedText(e.target, input.value); // Save edited task when input loses focus
            });

            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    saveEditedText(e.target, input.value); // Save edited task on Enter key press
                }
            });
        }
    });

    // Function to save edited task
    function saveEditedText(listItem, newText) {
        listItem.innerHTML = `
            <i class="fa-regular fa-circle"></i> 
            ${newText} 
            <i class="fa-solid fa-trash"></i>
        `;
        showNotification('Task updated successfully.'); // Show success notification
    }

    // Function to save tasks to localStorage
    function saveLocalStorage(tasksArray) {
        localStorage.setItem('tasks', JSON.stringify(tasksArray)); // Save tasks as JSON string
    }

    // Function to load tasks from localStorage when page loads
    function LoadTasksFromLocalStorage() {
        const tasksArray = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks from localStorage
        tasksArray.forEach(task => {
            const newListItem = document.createElement('li');
            newListItem.classList.add('li');
            newListItem.innerHTML = `
                <div class="li">
                    <i class="fa-regular fa-circle"></i> ${task.task} 
                    <i class="fa-solid fa-trash"></i>
                </div>
            `;
            taskList.appendChild(newListItem); // Add task to the task list
        });
    }

    // Load tasks from localStorage after the DOM content is fully loaded
    document.addEventListener('DOMContentLoaded', LoadTasksFromLocalStorage);
});
