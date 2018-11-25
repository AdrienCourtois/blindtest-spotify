import { User } from "../objects/user";
import { Response } from './response';

export class ResponseUser extends Response {
    data: User = null;

    constructor(obj){
        super(obj);

        try {
            if (typeof(obj.data) != "undefined")
                this.data = obj.data as User;
        } catch (e) { }
    }

    isError(){
        return (this.status == 'error');
    }
};