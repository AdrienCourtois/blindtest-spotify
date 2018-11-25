import { Error } from './error';
import { Response } from './response';

export class ResponseNumber extends Response {
    data: number = 0;

    constructor(obj){
        super(obj);

        try{
            if (typeof(obj.data) != "undefined" && !isNaN(obj.data))
                this.data = parseInt(obj.data);
        } catch(e){ }
    }
};