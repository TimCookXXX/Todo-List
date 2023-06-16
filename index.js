// Переменные
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('./assets/audio.mp3')

// Получить список задач при первой загрузке
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems')
    
    if (storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems)
    }

    render()
}

// Получить содержимое, введенное в поле ввода
// Данный код следит за событием ввода текста в поле ввода (задано переменной todoInput). 
// Когда происходит такое событие, то запускается функция, которая обрабатывает введенный текст (заданный переменной e). 
// Далее, данная функция обрабатывает введенный текст (заданный переменной value) и удаляет все символы пробелов, 
// которые находятся в начале текста (это выполняется с помощью регулярного выражения ^\s+). 
// Если value не является пустой строкой и была нажата клавиша "Enter" (задано с помощью e.keyCode === 13), 
// то выполняется функция addTodo, в которую передается очищенное значение value. 
// Затем поле ввода todoInput очищается и становится активным (это выполняется с помощью методов .value и .focus() соответственно).
todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/, '')

    if (value && e.keyCode === 13) {
        addTodo(value)

        todoInput.value = ''
        todoInput.focus()
    }
})

// Добавить задачу
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

// Удалить задачу
function removeTodo(id) {
    todoItems = todoItems.filter((todo) => todo.id !== Number(id))
    saveAndRender()
}

// Пометить как выполненное
function markAsCompleted(id) {
    todoItems = todoItems.filter((todo) => {
        if (todo.id === Number(id)) {
            todo.completed = true
        }
    
        return todo
    })

    audio.play()

    saveAndRender()
}

// Отметить как не выполненное
function markAsUncompleted(id) {
    todoItems = todoItems.filter((todo) => {
        if (todo.id === Number(id)) {
            todo.completed = true
        }
    
        return todo
    })

    saveAndRender()
}

// Сохранить в локальное хранилище
function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Показывать
function render() {
    let unCompletedTodos = todoItems.filter((item) => !item.completed)
    let completedTodos = todoItems.filter((item) => item.completed)

    completedTodosDiv.innerHTML = ''
    uncompletedTodosDiv.innerHTML = ''

    if (unCompletedTodos.length > 0) {
        unCompletedTodos.forEach((todo) => {
            uncompletedTodosDiv.append(createTodoElement(todo))
        })
    } else {
        uncompletedTodosDiv.innerHTML = `<div class="empty">Нет активных задач, добавьте новую задачу.</div>`
    }

    if (completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class="completed-title">Завершённые задачи (${completedTodos.length}/${todoItems.length})</div>`
    }

    completedTodos.forEach((todo) => {
        completedTodosDiv.append(createTodoElement(todo))
    })
}

// Сохранить и показать
function saveAndRender() {
    save()
    render()
}

// Создать элемент списка дел
function createTodoElement(todo) {
    const todoDiv = document.createElement('li')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }

    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M18 6l-12 12"></path>
                                    <path d="M6 6l12 12"></path>
                                </svg>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}