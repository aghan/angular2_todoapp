import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {Todo} from '../todo/todo';

import {Http, Headers} from 'angular2/http';
import {TodoSettings} from './todo_settings';

@Injectable()
export class TodoServices {
    http: Http;
    todoSettings: TodoSettings;

    constructor(http: Http, todoSettings: TodoSettings) {
        this.http = http;
        this.todoSettings = todoSettings;
    }

    getCSRF() {
        var csrfurl: string = '/rest/session/token';
        var csrftoken: string = '';

        csrfurl = this.todoSettings.getEndpoint() + csrfurl;
        return this.http.get(csrfurl).map(res => res.text());
    }

    setCSRF(token: string) {
        this.todoSettings.setCSRFToken(token);
    }

    getHeaders() {
        var authHeader = new Headers();
        authHeader.append('Content-Type', this.todoSettings.getIoFormat());
        authHeader.append('Accept',  this.todoSettings.getIoFormat());
        authHeader.append('Authorization', this.todoSettings.getAuthorization());
        authHeader.append('X-CSRF-Token', this.todoSettings.getCSRFToken());
        return authHeader;
    }

    getTodos() {
        var gettasksurl: string = '/rest/views/todo/list';
        gettasksurl = this.todoSettings.getEndpoint() + gettasksurl;
        return this.http.get(gettasksurl, {headers: this.getHeaders()}).map(res => res.json());
    }

    createTodo(title: string) {
        var createtasksurl: string = '/entity/node';
        createtasksurl = this.todoSettings.getEndpoint() + createtasksurl;

        // creating the request body
        var body: Object = {
            'type': [{'target_id': this.todoSettings.getcontentType()}],
            'title': [{'value': title}],
        };

        // creating the request
        return this.http.post(createtasksurl, JSON.stringify(body), {headers: this.getHeaders()}).map(res => res);
    }

    updateTodo(task: Todo) {
        if (task.nid) {
            var updatetasksurl: string = '/node/' + <number>task.nid;
            updatetasksurl = this.todoSettings.getEndpoint() + updatetasksurl;

            // creating an correct integer value for complete field
            var completed: number = 0;
            if (task.completed) {
                completed = 1;
            }
            // creating the request body
            var body: Object = {
                'type': [{'target_id': this.todoSettings.getcontentType()}],
                'title': [{'value': task.title}],
                'field_complete': [{'value': completed}],
            };
            // creating the request
            return this.http.patch(updatetasksurl, JSON.stringify(body), {headers: this.getHeaders()}).map(res => res);
        }
    }

    deleteTodo(nid: number) {
        if (nid) {
            var deletetasksurl: string = '/node/' + nid;
            deletetasksurl = this.todoSettings.getEndpoint() + deletetasksurl;

            // creating the request
            return this.http.delete(deletetasksurl, {headers: this.getHeaders()}).map(res => res);
        }
    }
}
