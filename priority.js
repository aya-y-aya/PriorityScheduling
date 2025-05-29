export class Priority {
    constructor(processes, timeQuanta, contextSwitch) {
        this.processes = processes;
        this.timeQuanta = timeQuanta;
        this.contextSwitch = contextSwitch;
    }

    computeProcess() {
        const timeQuanta = this.timeQuanta;
        const contextSwitch = this.contextSwitch;
        let time = 0;
        let processDone = 0;
        const readyQueue = [];
        let processTime = 0;
        let completionTime = 0;

        const ganttChartContainer = document.getElementById("gantt-chart");
        let ganttChartInnerHtml = "";
        ganttChartContainer.innerHTML = "";

        // Simulation loop
        while (processDone < this.processes.length) {
            // Add newly arrived processes
            this.processes.forEach((element) => {
                if (element.getArrivalTime() <= processTime &&
                    !readyQueue.includes(element) &&
                    !element.getIsDoneProcessing()
                ) {
                    readyQueue.push(element);
                }
            });

            if (readyQueue.length > 0) {
                // Sort by priority (lower number is higher priority)
                readyQueue.sort((a, b) => a.getPriority() - b.getPriority());

                let currentProcess = readyQueue.shift();

                // Set response time once
                if (currentProcess.getFirstArrivalTime() < 0) {
                    currentProcess.setFirstArrivalTime(processTime);
                    currentProcess.setResponseTime(processTime - currentProcess.getArrivalTime());
                }

                currentProcess.pushToArrivalTimes(processTime);
                const actualExecutedTime = currentProcess.updateRemainingTime(timeQuanta);
                processTime += actualExecutedTime;

                if (!currentProcess.getIsDoneProcessing()) {
                    // Add any new arrivals before pushing back
                    this.processes.forEach((element) => {
                        if (element.getArrivalTime() <= processTime &&
                            !readyQueue.includes(element) &&
                            !element.getIsDoneProcessing()
                        ) {
                            readyQueue.push(element);
                        }
                    });

                    // Push back for next round
                    readyQueue.push(currentProcess);
                } else {
                    processDone++;
                    currentProcess.computeValues(processTime);
                    if (processTime > completionTime) {
                        completionTime = processTime; // ✅ Track max completion time
                    }
                }

                // Apply context switch delay
                if (contextSwitch > 0) {
                    processTime += contextSwitch;
                }

                currentProcess.pushToCompletionTimes(processTime);
            } else {
                processTime++;
            }
        }

        // Draw the Gantt chart and time numbers
        const numberBar = document.getElementById("number-bar");
        numberBar.innerHTML = "";
        numberBar.style.gridTemplateColumns = `repeat(${completionTime + 1}, 1fr)`;

        for (let index = 0; index < completionTime + 1; index++) {
            numberBar.innerHTML += `<div class="has-text-white has-text-right">${index}</div>`;
        }

        ganttChartContainer.style.gridTemplateColumns = `repeat(${completionTime + 1}, 1fr)`;

        for (let index = 0; index < this.processes.length; index++) {
            ganttChartInnerHtml += `<div class="label"><strong>P${index + 1}</strong></div>`;
            let timesIndex = 0;
            const arrivalTimes = this.processes[index].getArrivalTimes();
            const completionTimes = this.processes[index].getCompletionTimes();

            for (let t = 0; t < completionTime; t++) {
                if (arrivalTimes[timesIndex] !== undefined &&
                    t >= arrivalTimes[timesIndex] &&
                    t < completionTimes[timesIndex]
                ) {
                    ganttChartInnerHtml += `<div class="has-background-primary has-text-black"></div>`;
                } else if (
                    arrivalTimes[timesIndex] !== undefined &&
                    t + contextSwitch === completionTimes[timesIndex] &&
                    contextSwitch > 0
                ) {
                    ganttChartInnerHtml += `<div class="has-background-white has-text-black"></div>`;
                } else {
                    ganttChartInnerHtml += `<div class="has-background has-text-black"></div>`;
                }

                if (
                    completionTimes[timesIndex] !== undefined &&
                    t === completionTimes[timesIndex] - 1
                ) {
                    timesIndex++;
                }
            }
        }

        ganttChartContainer.innerHTML = ganttChartInnerHtml;
    }
}
