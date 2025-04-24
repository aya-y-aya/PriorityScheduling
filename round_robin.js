import { Process } from "./process_class.js";
const processes = [
    new Process(0, 0, 8),
    new Process(1, 5, 2),
    new Process(2, 1, 7),
    new Process(3, 6, 3),
    new Process(4, 8, 5),
];
const timeQuanta = 3;
var time = 0;
var processDone = 0;
var readyQueueIndex = 0;
var ongoingProcess = 0;
const readyQueue = [];
let processTime = 0;
const ganttChartContainer = document.getElementById("gantt-chart");
let ganttChartInnerHtml = "";
let maxArrivalTime = 0;
let completionTime = 0;
processes.forEach((element) => {
    if (element.getArrivalTime() > maxArrivalTime) {
        maxArrivalTime = element.getArrivalTime();
    }
});
while (processDone < processes.length) {
    if (time <= maxArrivalTime) {
        processes.forEach((element) => {
            if (element.getArrivalTime() == time) {
                readyQueue.push(element.getProcessId());
            }
        });
    }
    if (readyQueueIndex >= 0) {
        ongoingProcess++;
        if (ongoingProcess > timeQuanta) {
            ongoingProcess = 1;
            if (processes[readyQueue[readyQueueIndex]].getFirstArrivalTime() < 0) {
                processes[readyQueue[readyQueueIndex]].setFirstArrivalTime(processTime);
            }
            processes[readyQueue[readyQueueIndex]].pushToArrivalTimes(processTime);
            const remainingProcess = processes[readyQueue[readyQueueIndex]].updateRemainingTime(timeQuanta);
            if (!processes[readyQueue[readyQueueIndex]].getIsDoneProcessing()) {
                readyQueue.push(readyQueue[readyQueueIndex]);
                processTime += timeQuanta;
            }
            else {
                processDone++;
                processTime += remainingProcess;
                completionTime = processTime;
                processes[readyQueue[readyQueueIndex]].computeValues(processTime);
            }
            processes[readyQueue[readyQueueIndex]].pushToCompletionTimes(processTime);
            readyQueueIndex++;
        }
    }
    time++;
}
let turnaroundTime = 0;
let responseTime = 0;
let waitingTime = 0;
processes.forEach((element) => {
    console.log("P" +
        (element.getProcessId() + 1) +
        " - FAT " +
        element.getFirstArrivalTime() +
        " - CT " +
        element.getCompletionTime() +
        " - TAT " +
        element.getTurnaroundTime() +
        " - WT " +
        element.getWaitingTime() +
        " - RT " +
        element.getResponseTime());
    turnaroundTime += element.getTurnaroundTime();
    waitingTime += element.getWaitingTime();
    responseTime += element.getResponseTime();
});
console.log("Average TAT = " + turnaroundTime / processes.length);
console.log("Average WT = " + waitingTime / processes.length);
console.log("Average RT = " + responseTime / processes.length);
processes.forEach((element) => {
    console.log(element.getArrivalTimes().join(" "));
});
processes.forEach((element) => {
    console.log(element.getCompletionTimes().join(" "));
});
console.log(completionTime);
const numberBar = document.getElementById("number-bar");
numberBar.style.gridTemplateColumns = "repeat(" + (completionTime + 1) + ", 1fr)";
for (let index1 = 0; index1 < completionTime + 1; index1++) {
    numberBar.innerHTML += '<div class=" has-text-white has-text-right">' + index1 + '</div>';
}
ganttChartContainer.style.gridTemplateColumns = "repeat(" + (completionTime + 1) + ", 1fr)";
for (let index = 0; index < processes.length; index++) {
    ganttChartInnerHtml += '<div class="label"><strong>P' + (index + 1) + "</strong></div>";
    let timesIndex = 0;
    const arrivalTimes = processes[index].getArrivalTimes();
    const completionTimes = processes[index].getCompletionTimes();
    for (let index1 = 0; index1 < completionTime; index1++) {
        if (index1 >= arrivalTimes[timesIndex] &&
            index1 < completionTimes[timesIndex]) {
            ganttChartInnerHtml +=
                '<div class="has-background-primary has-text-black"></div>';
        }
        else {
            ganttChartInnerHtml +=
                '<div class="has-background has-text-black"></div>';
        }
        if (completionTimes[timesIndex] == index1) {
            timesIndex++;
        }
    }
}
ganttChartContainer.innerHTML = ganttChartInnerHtml;
