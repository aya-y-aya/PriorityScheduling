export class Priority {
    constructor(processes, timeQuanta, contextSwitch) {
        this.processes = processes;
        this.timeQuanta = timeQuanta;
        this.contextSwitch = contextSwitch;
    }

computeProcess() {
    const tq = this.timeQuanta;
    const contextSwitch = this.contextSwitch;
    const processes = this.processes;
    let time = 0;
    let completed = 0;
    const n = processes.length;

    const ganttChartContainer = document.getElementById("gantt-chart");
    const numberBar = document.getElementById("number-bar");
    ganttChartContainer.innerHTML = "";
    numberBar.innerHTML = "";

    let priorityQueues = {};  // Priority level => queue
    let lastIndex = {};       // Tracks Round Robin within each priority

    processes.forEach(p => {
        if (!priorityQueues[p.priority]) {
            priorityQueues[p.priority] = [];
            lastIndex[p.priority] = 0;
        }
    });

    const isAllDone = () => processes.every(p => p.getIsDoneProcessing());

    while (completed < n) {
        // Enqueue arrived and not done processes
        processes.forEach(p => {
            if (p.arrivalTime <= time && !p.getIsDoneProcessing() && !priorityQueues[p.priority].includes(p)) {
                priorityQueues[p.priority].push(p);
            }
        });

        const priorities = Object.keys(priorityQueues).map(Number).sort((a, b) => a - b);

        let executed = false;

        for (let prio of priorities) {
            const queue = priorityQueues[prio];
            if (queue.length === 0) continue;

            const currentIndex = lastIndex[prio] % queue.length;
            const p = queue[currentIndex];

            if (p.arrivalTime > time || p.getIsDoneProcessing()) {
                lastIndex[prio]++;
                continue;
            }

            // Response Time
            if (p.getFirstArrivalTime() === -1) {
                p.setFirstArrivalTime(time);
                p.setResponseTime(time - p.arrivalTime);
            }

            p.pushToArrivalTimes(time);
            const execTime = p.updateRemainingTime(tq);
            time += execTime;
            p.pushToCompletionTimes(time);

            // Gantt drawing (same logic can remain)

            if (p.getIsDoneProcessing()) {
                p.computeValues(time);
                queue.splice(currentIndex, 1);  // Remove completed process
                if (queue.length === 0) delete priorityQueues[prio];
                completed++;
            } else {
                lastIndex[prio] = (currentIndex + 1) % queue.length;
            }

            executed = true;
            break;
        }

        if (!executed) {
            time++; // idle
        }
    }

    const completionTime = Math.max(...processes.map(p => p.getCompletionTime()));

    // Draw Gantt Chart time grid
    numberBar.style.gridTemplateColumns = `repeat(${completionTime + 1}, 1fr)`;
    for (let i = 0; i <= completionTime; i++) {
        numberBar.innerHTML += `<div class="has-text-white has-text-right">${i}</div>`;
    }

    ganttChartContainer.style.gridTemplateColumns = `repeat(${completionTime + 1}, 1fr)`;
    let ganttChartHtml = "";

    processes.forEach((p, idx) => {
        ganttChartHtml += `<div class="label"><strong>P${idx + 1}</strong></div>`;
        let tIndex = 0;
        const at = p.getArrivalTimes();
        const ct = p.getCompletionTimes();
        for (let t = 0; t < completionTime; t++) {
            if (at[tIndex] !== undefined && t >= at[tIndex] && t < ct[tIndex]) {
                ganttChartHtml += `<div class="has-background-primary has-text-black"></div>`;
            } else {
                ganttChartHtml += `<div class="has-background has-text-black"></div>`;
            }
            if (ct[tIndex] !== undefined && t === ct[tIndex] - 1) {
                tIndex++;
            }
        }
    });

    ganttChartContainer.innerHTML = ganttChartHtml;
}
}