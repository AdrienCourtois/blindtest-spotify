import { Response } from './response';
import { User } from '../objects/user';

export class ResponseUserArray extends Response {
    data: User[] = null;

    constructor(obj){
        super(obj);

        try {
            if (typeof(obj.data) != "undefined" && typeof(obj.data.length) != "undefined"){
                this.data = [];

                for (var i = 0 ; i < obj.data.length ; i++)
                    this.data.push(obj.data[i] as User);
            }
        } catch (e) { }
    }
}