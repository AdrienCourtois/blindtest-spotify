import { Response } from './response';
import { Theme } from '../objects/theme';

export class ResponseThemeArray extends Response {
    data: Theme[] = null;
}