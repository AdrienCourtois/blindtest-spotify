import { Response } from './response';
import { Game } from '../objects/game';

export class ResponseGameArray extends Response{
    data: Game[] = null;

    constructor(obj){
        super(obj);

        try {
            if (typeof(obj.data) != "undefined" && typeof(obj.data.length) != "undefined"){
                this.data = [];

                for (var i = 0 ; i < obj.data.length ; i++)
                    this.data.push(obj.data[i] as Game);
            }
        } catch (e) { }
    }
};