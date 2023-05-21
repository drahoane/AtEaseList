class Todo {
    constructor(text, state, date) {
        this.text = text;
        this.state = state;
        this.date = date;
    }
}

class TodoList {
    constructor(todos) {
        this.todos = todos;
    }
    
    /**
     * adds new todo into 'database'
     */
    add(todoText, dateText) {
        const newTodo = new Todo(todoText, 'active', dateText);
        this.todos.push(newTodo);
    }

    /**
     * updates one or more attributes of an existing todo
     * updates the 'database' in local storage
     * rerenders the list of todos
     */
    edit(index, todoText, dateText) {
        const todo = this.todos[index];
        if (!todoText) todoText = todo.text; 
        todo.text = todoText;
        todo.date = dateText;
        localStorage.setItem('todos', JSON.stringify(todos));
        this.render();
    }
  
    /**
     * removes the todo from the list
     * updates the 'database' in local storage
     * rerenders the list of todos
     * all of these actions after the css animation for class .removing is done
     */
    delete(index) {    
        setTimeout(() => {
            this.todos.splice(index, 1);
            // Update local storage
            localStorage.setItem('todos', JSON.stringify(todos));
            // Re-render the todo list after the animation is finished
            this.render();
        }, 1500);    
    }
  
    /**
     * toggles the attribute state of the todo
     * updates the 'database' in local storage
     * rerenders the list of todos
     */
    toggleState(index) {
        const todo = this.todos[index];
        todo.state = todo.state === 'done' ? 'active' : 'done';
        localStorage.setItem('todos', JSON.stringify(todos));
        this.render();
    }
  
    /**
     * rewrites the list of todos as keeping only those with state 'active' 
     */
    clearAll() {
        this.todos = this.todos.filter(todo => todo.state !== 'done');
    }

    /**
     * (re)renders the whole todo list
     * for each todo creates elements and pushes them into html to make them visible for the user
     * adds event listeners to checkboxes for toggle change, for edit, for delete and for drag and drop actions
     */
    render() {
        const todoList = document.getElementById('list');
        // Clear the todo list
        todoList.innerHTML = '';
  
        // Render each todo item
        this.todos.forEach((todo, index) => {
            const li = document.createElement('li');
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            const date = document.createElement('SPAN');
            const btns = document.createElement('div');
            checkbox.type = 'checkbox';
            date.innerHTML = todo.date;
            checkbox.checked = todo.state === 'done';
            checkbox.addEventListener('change', () => this.toggleState(index));
            label.textContent = todo.text;
            const deleteBtn = document.createElement('div');
            deleteBtn.innerText = 'x';

            const editBtn = document.createElement('div');
            editBtn.innerText = '+';
            editBtn.addEventListener('click', () => {
                const todoText = escapeHtml(todoInput.value.trim());
                const dateText = dateInput.value;
                this.edit(index, todoText, dateText);
            });
            deleteBtn.addEventListener('click', () => {
                li.classList.add('removing');
                this.delete(index);
                const sound = new Audio("sound.mp3");
                sound.play();
            });
            li.classList.add(todo.state);
            date.classList.add('txt');
             
            checkbox.setAttribute('placeholder', '.');

            li.draggable = true; // add draggable attribute
            li.addEventListener('dragstart', (e) => handleDragStart(e, index)); // add dragstart event listener
            li.addEventListener('dragover', (e) => handleDragOver(e)); // add dragover event listener
            li.addEventListener('drop', (e) => handleDrop(e, index)); // add drop event listener
        
            li.appendChild(checkbox);
            li.appendChild(label);
            li.appendChild(date);
            btns.appendChild(editBtn);
            btns.appendChild(deleteBtn);
            li.appendChild(btns);
        
            todoList.appendChild(li);
        });
    }
}

// Get the todo list from local storage
let todos = JSON.parse(localStorage.getItem('todos')) || [];
const todoList = new TodoList(todos);
  
// Cache the DOM
const todoInput = document.getElementById('input');
const dateInput = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
let items = document.getElementsByTagName('li');

// Render the initial todo list
todoList.render();
  
// Add event listeners
addBtn.addEventListener('click', () => {
    //XSS safe input
    const todoText = escapeHtml(todoInput.value.trim());
    const dateText = dateInput.value;

    if (!todoText) return;

    //create svg loading circle
    createSvg();
  
    todoList.add(todoText, dateText);
  
    // Clear the input field
    todoInput.value = '';
  
    // Update local storage
    localStorage.setItem('todos', JSON.stringify(todoList.todos));
  
    // Rerender the todo list
    todoList.render();
});
clearBtn.addEventListener('click', () => {
    todoList.clearAll();
    // Update local storage
    localStorage.setItem('todos', JSON.stringify(todoList.todos));
    // Re-render the todo list
    todoList.render();
});
// Execute a function when the user presses a key on the keyboard
todoInput.addEventListener('keypress', function(e) {
    // If the user presses the "Enter" key on the keyboard
    if (e.key === 'Enter') {
      // Trigger the button element with a click
      document.getElementById('addBtn').click();
    }
});
// Execute a function when the user presses a key on the keyboard
dateInput.addEventListener('keypress', function(e) {
    // If the user presses the "Enter" key on the keyboard
    if (e.key === 'Enter') {
      // Trigger the button element with a click
      document.getElementById('addBtn').click();
    }
});

/**
 * functions handling drag and drop API
 */
function handleDragStart(e, index) {
    e.dataTransfer.setData('text/plain', index);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e, index) {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    todos.splice(index, 0, todos.splice(draggedIndex, 1)[0]);
    localStorage.setItem('todos', JSON.stringify(todos));
    todoList.render();
}

/**
 * returns XSS safe inputs
 */
function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * filters todos based on their current state using fragmentation identifier
 * rerenders temporary list of those filtered todos
 */
function filterTodos(hash) {
    let filteredList = new TodoList(todoList.todos);
    if (hash === 'active') {
      filteredList.todos = todoList.todos.filter(todo => todo.state === 'active');
    } else if (hash === 'done') {
      filteredList.todos = todoList.todos.filter(todo => todo.state === 'done');
    }
    filteredList.render();
}

// listener for hash change
window.addEventListener('hashchange', () => filterTodos(window.location.hash.slice(1)));  

/**
 * creates loading circle animation when new todo is added
 */
function createSvg() {
    // Create the SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '50');
    svg.setAttribute('width', '50');

    // Create the circle element
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '25');
    circle.setAttribute('cy', '25');
    circle.setAttribute('r', '10');
    circle.setAttribute('stroke', '#ccc');
    circle.setAttribute('stroke-width', '5');
    circle.setAttribute('fill', 'transparent');
    svg.appendChild(circle);

    // Append the SVG element next to the button
    addBtn.parentNode.insertBefore(svg, addBtn.nextSibling);

    // Start the animation
    let progress = 0;
    const interval = setInterval(() => {
    circle.setAttribute('stroke-dasharray', `${progress}, 100`);
    progress++;
    if (progress > 70) {
        svg.remove();
        circle.remove();
    }
    }, 10);
}
