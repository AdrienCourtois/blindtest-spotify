import { Game } from '../objects/game';
import { Response } from './response';

export class ResponseGame extends Response{
    data: Game;

    constructor(obj){
        super(obj);
        try{
            if (typeof(obj.data) != "undefined")
                this.data = obj.data as Game;
        } catch(e) { }
    }
};