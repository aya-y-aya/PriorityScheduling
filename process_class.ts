export class Process {
    private processId: number;
    private arrivalTime: number;
    private burstTime: number;
    private remainingBursttime: number;
    private completionTime: number;
    private turnaroundTime: number;
    private waitingTime: number;
    private responseTime: number;
    private firstArrivalTime: number;
    private isDoneProcessing: boolean = false;
    private arrivalTimes: number[] = [];
    private completionTimes: number[] = [];
    private contextSwitch: number;
    private cpuUtilization: number;

    public constructor(processId: number, arrivalTime: number, burstTime: number, contextSwitch: number) {
        this.processId = processId;
        this.arrivalTime = arrivalTime;
        this. burstTime = burstTime;
        this. remainingBursttime = burstTime;
        this.completionTime = -1;
        this.turnaroundTime = -1;
        this.waitingTime = -1;
        this.responseTime = -1;
        this.firstArrivalTime = -1;
        this.contextSwitch = contextSwitch;
        this.cpuUtilization = 0;
    }

    public computeValues(completionTime: number) {
        this.completionTime = completionTime;
        this.turnaroundTime = this.completionTime - this.arrivalTime;
        this.waitingTime = this.turnaroundTime - this.burstTime;
        this.responseTime = this.firstArrivalTime - this.arrivalTime;
    }

    public getContextSwitching(){
        return this.contextSwitch;
    }

    public addContextSwitching(contextSwitch: number) {
        this.arrivalTime += contextSwitch;
    }

    public getCompletionTime() {
        return this.completionTime;
    }

    public getArrivalTime() {
        return this.arrivalTime;
    }

    public addArrivalTime(timeQuanta: number) {
        this.arrivalTime+= timeQuanta;
    }

    public setFirstArrivalTime(firstArrivalTime: number) {
        this.firstArrivalTime = firstArrivalTime;
    }

    public getFirstArrivalTime() {
        return this.firstArrivalTime;
    }
    

    public getProcessId() {
        return this.processId;
    }

    public updateRemainingTime(timeQuanta : number) : number {

        if(this.remainingBursttime > timeQuanta) {
            this.remainingBursttime -= timeQuanta;
            return timeQuanta;
        }
        else {
            timeQuanta = this.remainingBursttime;
            this.remainingBursttime = 0;
            this.isDoneProcessing = true;
            return timeQuanta;
        }
    }

    public getIsDoneProcessing() {
        return this.isDoneProcessing;
    }

    public getTurnaroundTime() {
        return this.turnaroundTime;
    }

    public getWaitingTime() {
        return this.waitingTime;
    }

    public getResponseTime() {
        return this.responseTime;
    }

    public pushToArrivalTimes(arrivalTime: number) {
        this.arrivalTimes.push(arrivalTime);
    }

    public getArrivalTimes() {
        return this.arrivalTimes;
    }

    public pushToCompletionTimes(completionTime: number) {
        this.completionTimes.push(completionTime);
    }

    public getCompletionTimes() {
        return this.completionTimes;
    }

}