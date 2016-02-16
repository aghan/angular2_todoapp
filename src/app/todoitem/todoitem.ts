import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Todo} from '../todo/todo';

@Component({
    selector: 'todo-item',
    templateUrl: 'app/todoitem/todoitem.html',
    styleUrls: ['app/todoitem/todoitem.css'],
})

export class TodoItem {
    editMode: boolean = false;

    @Input() todo: Todo;

    @Output()
    remove = new EventEmitter<number>();

    @Output()
    todoUpdated = new EventEmitter<Todo>();

    removeClicked() {
        this.remove.emit(this.todo.nid);
    }
    toggle() {
      // check if task is completed/not completed
      this.todoUpdated.emit({
          nid: this.todo.nid,
          completed: !this.todo.completed,
          title: this.todo.title,
      });
      // now changing the local value also
      this.todo.completed = !this.todo.completed;
    }

    enterEditMode(element: HTMLInputElement) {
        this.editMode = true;
        if (this.editMode) {
            setTimeout(() => { element.focus(); }, 0);
        }
    }
    cancelEdit(element: HTMLInputElement) {
        this.editMode = false;
        element.value = this.todo.title;
    }
    commitEdit(updatedText: string) {
        this.editMode = false;
        this.todoUpdated.emit({
            nid: this.todo.nid,
            title: updatedText,
            completed: this.todo.completed,
        });
        this.todo.title = updatedText;
    }
}
