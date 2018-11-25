import { Error } from './error';

export class Response{
    status: string;
    error: Error|null = null;

    isError(): boolean{
        return this.status == 'error';
    }
};