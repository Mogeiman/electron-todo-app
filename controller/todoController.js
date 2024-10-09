const { Op } = require('sequelize');
const { Todo } = require('../models');

const addTodo = async ({ todo, event }) => {
	try {
		await Todo.create({
			name: todo
		});
		event.sender.send('add-todo-res', { status: true, message: 'Todo added successfully' });
	} catch (err) {
		console.log(err);
	}
}


const allTodo = async ({ event, }) => {
	try {

		const allTodo = await Todo.findAll()
		event.sender.send('all-todo-res', { status: true, message: 'all todo loaded', allTodo })
	} catch (err) {
		console.log(err)
	}
}



const deleteTodo = async ({ todoId, event }) => {
	try {
		await Todo.destroy({ where: { id: todoId } })
		event.sender.send('todo-delete-res', { status: true, message: 'todo successfully deleted' })
	} catch (err) {
		console.log(err)
	}
}

module.exports = {
	addTodo,
	allTodo,
	deleteTodo
}


