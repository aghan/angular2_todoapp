/**
 * Created by adighan on 17/02/16.
 */
import {Injectable} from 'angular2/core';

@Injectable()
export class TodoSettings {
    endpoint: string = 'http://dev-headless-training.pantheon.io';
    username: string = 'dummy';
    password: string = 'dummy';
    format: string = 'application/json';
    type: string = 'todo';
    token: string = '';

    getEndpoint() {
        return this.endpoint;
    }

    getAuthorization() {
        var encodedString: string;
        // define the string
        var string = this.username + ':' + this.password;

        // encode the String
        encodedString = btoa(string);
        return 'Basic ' + encodedString;
    }

    getIoFormat() {
        return this.format;
    }

    getcontentType() {
        return this.type;
    }

    getCSRFToken() {
        return this.token;
    }
    setCSRFToken(token: string) {
        this.token = token;
    }
}
