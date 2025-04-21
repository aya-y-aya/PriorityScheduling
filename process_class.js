"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
class Process {
    constructor(processId, arrivalTime, burstTime) {
        this.isDoneProcessing = false;
        this.processId = processId;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingBursttime = burstTime;
        this.completionTime = -1;
        this.turnaroundTime = -1;
        this.waitingTime = -1;
        this.responseTime = -1;
        this.firstArrivalTime = -1;
    }
    computeValues(completionTime) {
        this.completionTime = completionTime;
        this.turnaroundTime = this.completionTime - this.arrivalTime;
        this.waitingTime = this.turnaroundTime - this.burstTime;
        this.responseTime = this.firstArrivalTime - this.arrivalTime;
    }
    getCompletionTime() {
        return this.completionTime;
    }
    getArrivalTime() {
        return this.arrivalTime;
    }
    addArrivalTime(timeQuanta) {
        this.arrivalTime += timeQuanta;
    }
    setFirstArrivalTime(firstArrivalTime) {
        this.firstArrivalTime = firstArrivalTime;
    }
    getFirstArrivalTime() {
        return this.firstArrivalTime;
    }
    getProcessId() {
        return this.processId;
    }
    updateRemainingTime(timeQuanta) {
        if (this.remainingBursttime > timeQuanta) {
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
    getIsDoneProcessing() {
        return this.isDoneProcessing;
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
}
exports.Process = Process;
