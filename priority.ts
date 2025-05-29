import { Process } from "./process_class.js";

export class Priority {
    private processes: Process[];
    private timeQuanta : number;

    public constructor(processes: Process[], timeQuanta: number) {
        this.processes = processes;
        this.timeQuanta = timeQuanta;
    }

    public computeProcess() {
        const timeQuanta: number = this.timeQuanta;
        var time: number = 0;
        var processDone: number = 0;
        var readyQueueIndex: number = 0;
        var ongoingProcess = 0;
        const readyQueue: number[] = [];
        let processTime = 0;

        const ganttChartContainer = document.getElementById(
            "gantt-chart"
        ) as HTMLElement;
        let ganttChartInnerHtml: string = "";
        ganttChartContainer.innerHTML = "";

        let maxArrivalTime: number = 0;
        let completionTime: number = 0;

        this.processes.forEach((element) => {
            if (element.getArrivalTime() > maxArrivalTime) {
                maxArrivalTime = element.getArrivalTime();
            }
        });

        while (processDone < this.processes.length) {
            // Add newly arrived processes to the readyQueue, maintaining priority order
            if (time <= maxArrivalTime) {
                for (let i = 0; i < this.processes.length; i++) {
                    const element = this.processes[i];
                    if (element.getArrivalTime() === time) {
                        // Insert the new process into the readyQueue based on its priority
                        // Lower priority number means higher priority
                        let inserted = false;
                        for (let j = 0; j < readyQueue.length; j++) {
                            const currentProcessInQueue = this.processes[readyQueue[j]];
                            if (element.getPriorityNumber() < currentProcessInQueue.getPriorityNumber()) {
                                readyQueue.splice(j, 0, element.getProcessId()); // Insert before current
                                inserted = true;
                                break;
                            }
                        }
                        if (!inserted) {
                            readyQueue.push(element.getProcessId()); // Add to the end if it has the lowest priority or queue is empty
                        }
                    }
                }
            }

            if (readyQueue.length > 0) {
                // In priority scheduling, the process to run is always the one with the highest priority
                // which is at the front of our sorted readyQueue.
                const currentProcessId = readyQueue[0];
                const currentProcess = this.processes[currentProcessId];

                // Handle the time slice / quantum logic for the current process
                ongoingProcess++;

                if (ongoingProcess > timeQuanta) {
                    ongoingProcess = 1; // Reset for the next time slice

                    if (currentProcess.getFirstArrivalTime() < 0) {
                        currentProcess.setFirstArrivalTime(processTime);
                    }

                    currentProcess.pushToArrivalTimes(processTime);

                    const remainingProcessTime = currentProcess.updateRemainingTime(timeQuanta);

                    if (!currentProcess.getIsDoneProcessing()) {
                        processTime += timeQuanta;
                    } else {
                        processDone++;
                        processTime += remainingProcessTime; // Add only the remaining time if it finishes early
                        completionTime = processTime; // This variable seems to be a global one for the last completion.
                        currentProcess.computeValues(processTime); // Calculate metrics for the completed process

                        // Remove the completed process from the readyQueue
                        readyQueue.shift(); // Remove the first element (the completed process)
                    }

                    currentProcess.pushToCompletionTimes(processTime);
                }
            } else {
                processTime++;
            }

            time++;
        }

        const numberBar = document.getElementById("number-bar") as HTMLElement
        numberBar.innerHTML = "";
        numberBar.style.gridTemplateColumns = "repeat(" + (completionTime + 1) + ", 1fr)";
        for (let index1 = 0; index1 < completionTime + 1; index1++) {
            numberBar.innerHTML += '<div class=" has-text-white has-text-right">' + index1 + '</div>';
        }

        ganttChartContainer.style.gridTemplateColumns = "repeat(" + (completionTime + 1) + ", 1fr)";
        for (let index = 0; index < this.processes.length; index++) {
            ganttChartInnerHtml += '<div class="label"><strong>P' + (index + 1) + "</strong></div>";

            let timesIndex = 0;
            const arrivalTimes = this.processes[index].getArrivalTimes();
            const completionTimes = this.processes[index].getCompletionTimes();

            for (let index1 = 0; index1 < completionTime; index1++) {
                if (
                    (index1 >= arrivalTimes[timesIndex] &&
                    index1 <  completionTimes[timesIndex])
                ) {
                    ganttChartInnerHtml +=
                        '<div class="has-background-primary has-text-black"></div>';
                }
                else {
                    ganttChartInnerHtml +=
                        '<div class="has-background has-text-black"></div>';
                }

                if ((completionTimes[timesIndex] - 1) == index1) {
                    timesIndex++;
                }
            }
        }

        ganttChartContainer.innerHTML = ganttChartInnerHtml;
    }

}