const { ipcRenderer } = require('electron')


document.addEventListener('DOMContentLoaded', () => {

	ipcRenderer.send('all-todo')

	ipcRenderer.on('all-todo-res', (event, res) => {
		console.log(res)
		const { allTodo } = res
		renderTodos(allTodo)
	})

	ipcRenderer.on('add-todo-res', (event, res) => {
		ipcRenderer.send('all-todo')
		console.log(res)
	})

	ipcRenderer.on('todo-delete-res', (event, res) => {
		ipcRenderer.send('all-todo')
	})
})

const todoList = document.getElementById('todo-list')

function renderTodos(allTodo) {
	todoList.innerHTML = ''
	if (allTodo && allTodo.length > 0) {
		allTodo.forEach((todo) => {
			const li = document.createElement('li')
			li.classList.add("flex", "justify-between", "items-center", "bg-gray-50", "p-3", "rounded-lg", "shadow-sm")

			li.innerHTML = `
			  <span>${todo.dataValues.name}</span>
          <button
            class="text-red-500 hover:text-red-700 focus:outline-none delete-todo"
            id="delete-todo"
			data-id="${todo.dataValues.id}"
          >
            Delete
          </button>
			`

			todoList.appendChild(li)
			const deleteButton = li.querySelector('.delete-todo')

			deleteButton.addEventListener('click', (e) => {
				e.preventDefault()
				e.stopPropagation()

				ipcRenderer.send('delete-todo', { todoId: todo.dataValues.id })
			})
		});
	}
}

const todoInput = document.getElementById('todo-input')

const todoBtn = document.getElementById('add-todo')

todoBtn.addEventListener('click', (e) => {
	e.preventDefault()
	ipcRenderer.send('add-todo', { todo: todoInput.value })
})