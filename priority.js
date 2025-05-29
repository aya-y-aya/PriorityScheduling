export class Priority {
    constructor(processes) {
        this.processes = processes;
    }
    computeProcess() {
        let currentTime = 0;
        let processesCompleted = 0;
        const readyQueue = [];
        const completedProcesses = [];
        // Initial sort by arrival time to ensure we consider processes in order of their availability
        this.processes.sort((a, b) => a.getArrivalTime() - b.getArrivalTime());
        // Gantt chart visualization
        const ganttChartContainer = document.getElementById("gantt-chart");
        let ganttChartInnerHtml = "";
        ganttChartContainer.innerHTML = "";
        let processIndex = 0;
        while (processesCompleted < this.processes.length) {
            // Add newly arrived processes to the ready queue
            // Add all processes that have arrived *by* the current time to the ready queue
            while (processIndex < this.processes.length && this.processes[processIndex].getArrivalTime() <= currentTime) {
                const arrivedProcess = this.processes[processIndex];
                // Insert into ready queue based on priority (lower number = higher priority)
                // Tie-breaker: If priorities are equal, use arrival time (earlier arrival first)
                let inserted = false;
                for (let i = 0; i < readyQueue.length; i++) {
                    const currentProcessInQueue = readyQueue[i];
                    if (arrivedProcess.getPriorityNumber() < currentProcessInQueue.getPriorityNumber() ||
                        (arrivedProcess.getPriorityNumber() === currentProcessInQueue.getPriorityNumber() &&
                            arrivedProcess.getArrivalTime() < currentProcessInQueue.getArrivalTime())) {
                        readyQueue.splice(i, 0, arrivedProcess); // Insert before current process in queue
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) {
                    readyQueue.push(arrivedProcess); // Add to the end if it has the lowest priority or queue is empty
                }
                processIndex++;
            }
            // Select and execute the next process
            if (readyQueue.length > 0) {
                // To get the highest priority process
                const currentProcess = readyQueue[0];
                // This ensures the process doesn't start before it arrives.
                if (currentTime < currentProcess.getArrivalTime()) {
                    currentTime = currentProcess.getArrivalTime();
                }
                // If this is the first time this process starts executing, record its start time
                if (currentProcess.getFirstArrivalTime() < 0) {
                    currentProcess.setFirstArrivalTime(currentTime);
                }
                currentProcess.pushToArrivalTimes(currentTime);
                // In non-preemptive scheduling, the process runs for its entire burst time
                const executionStartTime = currentTime;
                const burstTime = currentProcess.getRemainingBurstTime(); // Use original burst time for full run
                currentProcess.updateRemainingTime(burstTime);
                currentTime += burstTime;
                currentProcess.pushToCompletionTimes(currentTime);
                currentProcess.computeValues(currentTime);
                // Move the completed process from readyQueue to completedProcesses
                readyQueue.shift(); // Remove the completed process from the front
                completedProcesses.push(currentProcess);
                processesCompleted++;
            }
            else {
                // If the ready queue is empty, and there are still processes that haven't arrived yet,
                // advance time to the arrival time of the next process to avoid an idle state.
                if (processIndex < this.processes.length) {
                    currentTime = this.processes[processIndex].getArrivalTime();
                }
                else {
                    // No more processes to arrive and ready queue is empty.
                    break;
                }
            }
        }
        let maxCompletionTime = 0;
        if (completedProcesses.length > 0) {
            maxCompletionTime = Math.max(...completedProcesses.map(p => p.getCompletionTime()));
        }
        else {
            // Handle case where no processes were scheduled, or all had burstTime of 0
            maxCompletionTime = currentTime;
        }
        const numberBar = document.getElementById("number-bar");
        numberBar.innerHTML = "";
        numberBar.style.gridTemplateColumns = "repeat(" + (maxCompletionTime + 1) + ", 1fr)";
        for (let index1 = 0; index1 < maxCompletionTime + 1; index1++) {
            numberBar.innerHTML += '<div class=" has-text-white has-text-right">' + index1 + '</div>';
        }
        // Ensure processes are sorted by their original ID for consistent display order
        this.processes.sort((a, b) => a.getProcessId() - b.getProcessId());
        ganttChartContainer.style.gridTemplateColumns = "repeat(" + (maxCompletionTime + 1) + ", 1fr)";
        for (let index = 0; index < this.processes.length; index++) {
            ganttChartInnerHtml += '<div class="label"><strong>P' + (this.processes[index].getProcessId() + 1) + "</strong></div>";
            let timesIndex = 0;
            const arrivalTimes = this.processes[index].getArrivalTimes();
            const completionTimes = this.processes[index].getCompletionTimes();
            if (arrivalTimes.length === 0 || completionTimes.length === 0) {
                for (let index1 = 0; index1 < maxCompletionTime; index1++) {
                    ganttChartInnerHtml += '<div class="has-background has-text-black"></div>';
                }
            }
            else {
                for (let index1 = 0; index1 < maxCompletionTime; index1++) {
                    if (timesIndex < arrivalTimes.length &&
                        (index1 >= arrivalTimes[timesIndex] && index1 < completionTimes[timesIndex])) {
                        ganttChartInnerHtml += '<div class="has-background-primary has-text-black"></div>';
                    }
                    else {
                        ganttChartInnerHtml += '<div class="has-background has-text-black"></div>';
                    }
                }
            }
        }
        ganttChartContainer.innerHTML = ganttChartInnerHtml;
    }
}
