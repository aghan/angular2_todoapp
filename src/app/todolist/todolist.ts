// we need the component class from angular core as we need to
// use the @Component decorator function
import {Component} from 'angular2/core';

// importing our basic to-do data structure
import {Todo} from '../todo/todo';

// importing our TodoServices service, which we would need to call
// web services which are hosted on a separate back-end
import {TodoServices} from '../services/todo_services';

// importing our TodoItem component which handles the app at one to-do item
// at a time, it is a child component of the current component
import {TodoItem} from '../todoitem/todoitem';

// this is the @Component annotation, which tells Angular that the
// class beneath it is a component, we also pass metadata for the
// component
@Component({
    selector: 'todo-list',
    templateUrl: 'app/todolist/todolist.html',
    styleUrls: ['app/todolist/todolist.css'],
    directives: [TodoItem],
    providers: [TodoServices],
})

export class TodoList {
    todoService: TodoServices;
    newItem = '';
    csrfToken = '';
    todos: Array<Todo> = [];
    loading: boolean = true;

    constructor(todoService: TodoServices) {
        this.todoService = todoService;
        // set the CSRF token first
        this.todoService.getCSRF().subscribe(
            data => {
                if (data) {
                    this.todoService.setCSRF(data);
                }
            },
            err => console.log(err),
            () => {
                this.getItems();
            }
        );
    }

    getItems() {
        this.todos = [];
        // get the list of nodes here
        this.todoService.getTodos().subscribe(
            data => {
                for (let task of data) {
                    // changing the response according to our need
                    this.todos.push({
                        nid: task.nid,
                        title: task.title,
                        completed: task.field_complete === '1',
                    });
                }
                // remove the loading message
                this.loading = false;
            },
            err => console.log(err)
        );
    }
    addItem() {
        // adding item in the item array
        if (this.newItem) {
            // creating a task in the back end
            this.todoService.createTodo(this.newItem).subscribe(
                data => {
                    // update the items as we need the nid of the newly
                    // created task
                    // add the loading message
                    this.loading = true;
                    this.getItems();
                },
                err => console.log(err)
            );
        }
    }
    removeItem(nid: number) {
        // delete the node here
        for (var i: number = 0; i < this.todos.length; i++) {
            if (this.todos[i].nid === nid) {
                this.todos.splice(i, 1);
                break;
            }
        }
        // now deleting the task from our back-end
        this.todoService.deleteTodo(nid).subscribe(
            err => console.log(err)
        );
    }
    itemUpdated(event: Todo) {
        // update the node here
        if (event.nid) {
            // creating a task in the back end
            this.todoService.updateTodo(event).subscribe(
                err => console.log(err)
            );
        }
    }
}
