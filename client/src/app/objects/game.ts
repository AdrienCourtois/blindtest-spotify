export class Game{
    id: number;
    name: string;
    theme_id: number;
    active: number;
    user: string;
    points: string;
    creation_date: string;
    started: number;
    current_round: number;
    max_round: number;

    hasStarted(): boolean{
        return this.started == 1;
    }

    getRound(): number{
        return this.current_round;
    }
};