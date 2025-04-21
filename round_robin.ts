import { Process } from "./process_class"

const processes: Process[] = [
    new Process(0, 1, 12),
    new Process(1, 2, 8),
    new Process(2, 0, 10),
    new Process(3, 4, 6),
    new Process(4, 8, 8),
]

const timeQuanta : number = 3;
var time : number = 0;
var processDone : number = 0;
var readyQueueIndex: number = 0;
var ongoingProcess = 0;

const readyQueue : number[] = [];
let processTime = 0;

let maxArrivalTime: number = 0;
processes.forEach(element => {
    if (element.getArrivalTime() > maxArrivalTime) {
        maxArrivalTime = element.getArrivalTime();
    }
})

while (processDone < processes.length) {
    if (time <= maxArrivalTime) {
        processes.forEach(element => {
            if (element.getArrivalTime() == time) {
                readyQueue.push(element.getProcessId())
            }
        }) 
    }

    if(readyQueueIndex >= 0) {
        ongoingProcess++

        if (ongoingProcess > timeQuanta) {
            ongoingProcess = 1;

            if (processes[readyQueue[readyQueueIndex]].getFirstArrivalTime() < 0) {
                processes[readyQueue[readyQueueIndex]].setFirstArrivalTime(processTime);
            }
            const remainingProcess = processes[readyQueue[readyQueueIndex]].updateRemainingTime(timeQuanta);

            if (!processes[readyQueue[readyQueueIndex]].getIsDoneProcessing()) {
                readyQueue.push(readyQueue[readyQueueIndex]);
                processTime += timeQuanta;
            } else {
                processDone++;
                processTime += remainingProcess;
                processes[readyQueue[readyQueueIndex]].computeValues(processTime);
            }

            readyQueueIndex++;
        }
    }

    time++
}

let turnaroundTime : number = 0;
let responseTime : number = 0;
let waitingTime : number = 0;

processes.forEach(element => {
    console.log(
        "P" + (element.getProcessId() + 1) + 
    " - FAT " + element.getFirstArrivalTime() +
    " - CT " + element.getCompletionTime() +
    " - TAT " + element.getTurnaroundTime() +
    " - WT " + element.getWaitingTime() +
    " - RT " + element.getResponseTime()
)

turnaroundTime += element.getTurnaroundTime();
waitingTime += element.getWaitingTime();
responseTime += element.getResponseTime();

})

console.log("Average TAT = " + turnaroundTime / processes.length);
console.log("Average WT = " + waitingTime / processes.length);
console.log("Average RT = " + responseTime / processes.length);
