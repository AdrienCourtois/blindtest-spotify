import { User } from "../objects/user";
import { Response } from './response';

export class ResponseUser extends Response {
    data: User = null;

    isError(){
        return (this.status == 'error');
    }
};