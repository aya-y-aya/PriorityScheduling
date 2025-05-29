import { Process } from "./process_class.js";
export class Priority {
    constructor(processes) {
        // Create a deep copy of processes to ensure the original objects aren't mutated
        // and each scheduling run starts with fresh process states.
        this.processes = processes.map(p => new Process(p.getProcessId(), p.getPriorityNumber(), p.getArrivalTime(), p.getRemainingBurstTime()));
    }
    computeProcess() {
        let currentTime = 0; // Represents the current simulated time
        let processesCompleted = 0;
        const readyQueue = []; // Stores Process objects, not just IDs
        const completedProcesses = []; // To keep track of processes that have finished
        // Initial sort by arrival time to ensure we consider processes in order of their availability
        this.processes.sort((a, b) => a.getArrivalTime() - b.getArrivalTime());
        // For your existing Gantt chart visualization
        const ganttChartContainer = document.getElementById("gantt-chart");
        let ganttChartInnerHtml = "";
        ganttChartContainer.innerHTML = ""; // Clear previous chart
        let processIndex = 0; // Tracks processes that have not yet arrived or been added to readyQueue
        while (processesCompleted < this.processes.length) {
            // Step 1: Add newly arrived processes to the ready queue
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
            // Step 2: Select and execute the next process
            if (readyQueue.length > 0) {
                // Get the highest priority process (which will be at the front of the sorted readyQueue)
                const currentProcess = readyQueue[0];
                // If the CPU was idle before this process could start, advance currentTime to its arrival
                // This ensures the process doesn't start before it arrives.
                if (currentTime < currentProcess.getArrivalTime()) {
                    currentTime = currentProcess.getArrivalTime();
                }
                // If this is the first time this process starts executing, record its start time
                if (currentProcess.getFirstArrivalTime() < 0) { // Assuming -1 or similar indicates not started
                    currentProcess.setFirstArrivalTime(currentTime);
                }
                // Add current process to Gantt chart visualization data (for your existing logic)
                currentProcess.pushToArrivalTimes(currentTime); // This records the start of its current execution segment
                // In non-preemptive scheduling, the process runs for its entire burst time
                const executionStartTime = currentTime;
                const burstTime = currentProcess.getRemainingBurstTime(); // Use original burst time for full run
                // Simulate execution: update remaining time to 0 as it completes
                currentProcess.updateRemainingTime(burstTime); // This will set remaining time to 0 and isDone to true
                // Update current time to reflect the completion of this process
                currentTime += burstTime;
                // This marks the end of its current execution segment
                currentProcess.pushToCompletionTimes(currentTime);
                // Since the process just completed, calculate its final metrics
                currentProcess.computeValues(currentTime); // Pass the completion time
                // Move the completed process from readyQueue to completedProcesses
                readyQueue.shift(); // Remove the completed process from the front
                completedProcesses.push(currentProcess);
                processesCompleted++;
            }
            else {
                // If the ready queue is empty, and there are still processes that haven't arrived yet,
                // advance time to the arrival time of the next process to avoid busy-waiting in an idle state.
                if (processIndex < this.processes.length) {
                    currentTime = this.processes[processIndex].getArrivalTime();
                }
                else {
                    // No more processes to arrive and ready queue is empty.
                    // This means all processes have been completed or there are no processes at all.
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
            // Correctly handle the case where a process might not have run or was short
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
                    // // Advance timesIndex if the current segment ends
                    // if (timesIndex < completionTimes.length && (completionTimes[timesIndex] - 1) === index1) {
                    //     timesIndex++;
                    // }
                }
            }
        }
        ganttChartContainer.innerHTML = ganttChartInnerHtml;
    }
}
