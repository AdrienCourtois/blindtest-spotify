import { Response } from './response';
import { Game } from '../objects/game';

export class ResponseGameArray extends Response{
    data: Game[] = null;
};