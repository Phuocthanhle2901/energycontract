export class Timer {
    hours:number;
    minutes:number;
    seconds:number;

    calculate(time:number){
        this.hours = Math.floor(time/3600);
        if(this.hours>0) time %= 3600;
        this.minutes = Math.floor(time/60);
        if(this.minutes>0) time %= 60;
        this.seconds = time;
    }
}