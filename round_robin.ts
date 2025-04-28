import { Process } from "./process_class.js";

export class RoundRobin {
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
            if (time <= maxArrivalTime) {
                this.processes.forEach((element) => {
                    if (element.getArrivalTime() == time) {
                        readyQueue.push(element.getProcessId());
                    }
                });
            }

            if (readyQueue.length > 0) {
                ongoingProcess++;

                if (ongoingProcess > timeQuanta) {
                    ongoingProcess = 1;

                    if (
                        this.processes[readyQueue[readyQueueIndex]].getFirstArrivalTime() < 0
                    ) {
                        this.processes[readyQueue[readyQueueIndex]].setFirstArrivalTime(
                            processTime
                        );
                    }

                    this.processes[readyQueue[readyQueueIndex]].pushToArrivalTimes(
                        processTime
                    );

                    const remainingProcess =
                        this.processes[readyQueue[readyQueueIndex]].updateRemainingTime(
                            timeQuanta
                        );

                    if (!this.processes[readyQueue[readyQueueIndex]].getIsDoneProcessing()) {
                        readyQueue.push(readyQueue[readyQueueIndex]);
                        processTime += timeQuanta;
                    } else {
                        processDone++;
                        processTime += remainingProcess;
                        completionTime = processTime;
                        this.processes[readyQueue[readyQueueIndex]].computeValues(
                            processTime
                        );
                    }

                    this.processes[readyQueue[readyQueueIndex]].pushToCompletionTimes(
                        processTime
                    );

                    readyQueueIndex++;
                }
            }
            else {
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
                } else {
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