import { backend } from "declarations/backend";

let todos = [];
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const loadingSpinner = document.getElementById('loadingSpinner');

// Show/hide loading spinner
const setLoading = (loading) => {
    loadingSpinner.classList.toggle('d-none', !loading);
};

// Render todos
const renderTodos = () => {
    todoList.innerHTML = todos
        .sort((a, b) => b.id - a.id)
        .map(todo => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" 
                        ${todo.completed ? 'checked' : ''} 
                        onchange="window.toggleTodo(${todo.id})">
                    <label class="form-check-label ${todo.completed ? 'text-decoration-line-through' : ''}">
                        ${todo.text}
                    </label>
                </div>
                <button class="btn btn-danger btn-sm" onclick="window.deleteTodo(${todo.id})">
                    Delete
                </button>
            </li>
        `)
        .join('');
};

// Load todos
const loadTodos = async () => {
    setLoading(true);
    try {
        todos = await backend.getTodos();
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
    }
    setLoading(false);
};

// Add todo
todoForm.onsubmit = async (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    setLoading(true);
    try {
        await backend.addTodo(text);
        todoInput.value = '';
        await loadTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
    }
    setLoading(false);
};

// Toggle todo
window.toggleTodo = async (id) => {
    setLoading(true);
    try {
        await backend.toggleTodo(id);
        await loadTodos();
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
    setLoading(false);
};

// Delete todo
window.deleteTodo = async (id) => {
    setLoading(true);
    try {
        await backend.deleteTodo(id);
        await loadTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
    setLoading(false);
};

// Initial load
loadTodos();
