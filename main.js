const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { sequelize } = require('./models');
const todoController = require('./controller/todoController')
const path = require('path')
const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: false,
			nodeIntegration: true,
		},
	})

	win.loadFile('./src/html/index.html');

	sequelize
		.sync(
			{ alter: true }
		)
		.then(() => {
			console.log('Connection has been established successfully.');
		})
		.catch((error) => {
			console.error(error + 'heeehooow');
		});



	ipcMain.on('all-todo', async (event) => {
		await todoController.allTodo({ event })
	})
	ipcMain.on('add-todo', async (event, { todo }) => {
		await todoController.addTodo({ event, todo })
	})
	ipcMain.on('delete-todo', async (event, { todoId }) => {
		await todoController.deleteTodo({ event, todoId })
	})





}

app.whenReady().then(() => {
	createWindow()
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
