/**
 * Created by adighan on 04/02/16.
 */
import {Injectable} from 'angular2/core';

@Injectable()
export class Todo {
   nid: number;
   completed: boolean;
   title: string;
}
