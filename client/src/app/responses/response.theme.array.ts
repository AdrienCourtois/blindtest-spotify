import { Response } from './response';
import { Theme } from '../objects/theme';

export class ResponseThemeArray extends Response {
    data: Theme[] = null;

    constructor(obj){
        super(obj);

        try {
            if (typeof(obj.data) != 'undefined' && typeof(obj.data.length) != 'undefined'){
                this.data = [];

                for (var i = 0 ; i < obj.data.length ; i++)
                    this.data.push(obj.data[i] as Theme);
            }
        } catch(e) { }
    }
}