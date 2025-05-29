// process_class.js
export class Process {
    constructor(id, arrivalTime, priority, burstTime, responseTime = -1) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.priority = priority;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.responseTime = responseTime;
        this.completionTime = -1;
        this.turnaroundTime = -1;
        this.waitingTime = -1;
        this.firstArrivalTime = -1;
        this.isDone = false;
        this.arrivalTimes = [];
        this.completionTimes = [];
    }

    getArrivalTime() {
        return this.arrivalTime;
    }

    getBurstTime() {
        return this.burstTime;
    }

    getPriority() {
        return this.priority;
    }

    getIsDoneProcessing() {
        return this.isDone;
    }

    getFirstArrivalTime() {
        return this.firstArrivalTime;
    }

    setFirstArrivalTime(time) {
        this.firstArrivalTime = time;
    }

    pushToArrivalTimes(time) {
        this.arrivalTimes.push(time);
    }

    pushToCompletionTimes(time) {
        this.completionTimes.push(time);
    }

    getArrivalTimes() {
        return this.arrivalTimes;
    }

    getCompletionTimes() {
        return this.completionTimes;
    }

    getCompletionTime() {
        return this.completionTime;
    }

    getTurnaroundTime() {
        return this.turnaroundTime;
    }

    getWaitingTime() {
        return this.waitingTime;
    }

    getResponseTime() {
        return this.responseTime;
    }

    setResponseTime(value) {
        this.responseTime = value;
    }

    updateRemainingTime(timeQuanta) {
        const timeUsed = Math.min(this.remainingTime, timeQuanta);
        this.remainingTime -= timeUsed;
        if (this.remainingTime === 0) {
            this.isDone = true;
        }
        return timeUsed;
    }

    computeValues(currentTime) {
        this.completionTime = currentTime;
        this.turnaroundTime = this.completionTime - this.arrivalTime;
        this.waitingTime = this.turnaroundTime - this.burstTime;
        if (this.responseTime === -1) {
            this.responseTime = this.firstArrivalTime - this.arrivalTime;
        }
    }
}
