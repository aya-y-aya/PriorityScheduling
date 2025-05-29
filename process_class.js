export class Process {
    constructor(processId, priorityNumber, arrivalTime, burstTime) {
        this.isDoneProcessing = false;
        this.arrivalTimes = [];
        this.completionTimes = [];
        this.processId = processId;
        this.priorityNumber = priorityNumber;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingBursttime = burstTime;
        this.completionTime = -1;
        this.turnaroundTime = -1;
        this.waitingTime = -1;
        this.responseTime = -1;
        this.firstArrivalTime = -1;
        this.cpuUtilization = 0;
    }
    computeValues(completionTime) {
        this.completionTime = completionTime;
        this.turnaroundTime = this.completionTime - this.arrivalTime;
        this.waitingTime = this.turnaroundTime - this.burstTime;
        this.responseTime = this.firstArrivalTime - this.arrivalTime;
    }
    addContextSwitching(contextSwitch) {
        this.arrivalTime += contextSwitch;
    }
    getPriorityNumber() {
        return this.priorityNumber;
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
    // Added for clarity in non-preemptive scheduling
    getRemainingBurstTime() {
        return this.remainingBursttime;
    }
    updateRemainingTime(timeToExecute) {
        if (this.remainingBursttime > timeToExecute) {
            this.remainingBursttime -= timeToExecute;
            return timeToExecute;
        }
        else {
            const actualExecutedTime = this.remainingBursttime;
            this.remainingBursttime = 0;
            this.isDoneProcessing = true;
            return actualExecutedTime;
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
    pushToArrivalTimes(arrivalTime) {
        this.arrivalTimes.push(arrivalTime);
    }
    getArrivalTimes() {
        return this.arrivalTimes;
    }
    pushToCompletionTimes(completionTime) {
        this.completionTimes.push(completionTime);
    }
    getCompletionTimes() {
        return this.completionTimes;
    }
}
