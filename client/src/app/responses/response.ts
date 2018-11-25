import { Error } from './error';

export class Response{
    status: string;
    error: Error|null = null;

    constructor(obj){
        this.status = obj.status;
        try {
            if (typeof(obj.error) != "undefined")
                this.error = obj.error as Error;
        } catch(e) { }
    }

    isError(): boolean{
        return this.status == 'error';
    }
};