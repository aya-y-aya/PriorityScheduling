import { Process } from "./process_class.js"
import { Priority } from "./priority.js"

const tableBody = document.getElementById("table-body") as HTMLElement
const addRowButton = document.getElementById("add-row-button") as HTMLElement
const decreaseRowButton = document.getElementById("decrease-row-button") as HTMLElement
const submitButton = document.getElementById("submit-button") as HTMLInputElement
const timeQuantumInput = document.getElementById("time-quantum-input") as HTMLInputElement

let processNumber = 1;

addRowButton.addEventListener("click", () => {
    console.log("Add")
    processNumber++;

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <th class="has-text-centered is-align-content-center">P${processNumber}</th>
        <td class="has-text-centered is-align-content-center">
            <input min="0" required type="number" class="input arrival-time" />
        </td>
        <td class="has-text-centered is-align-content-center">
            <input min="1" required type="number" class="input burst-time" />
        </td>
        <td class="has-text-centered is-align-content-center completion-time">-</td>
        <td class="has-text-centered is-align-content-center turn-around-time">-</td>
        <td class="has-text-centered is-align-content-center waiting-time">-</td>
        <td class="has-text-centered is-align-content-center response-time">-</td>
    `;

    const completionTimestd = tableBody.querySelectorAll(".completion-time")
    const turnaroundTimestd = tableBody.querySelectorAll(".turn-around-time")
    const waitingTimestd = tableBody.querySelectorAll(".waiting-time")
    const responseTimestd = tableBody.querySelectorAll(".response-time")

    for (let index = 0; index < completionTimestd.length; index++) {
        const completionTime = completionTimestd[index] as HTMLTableCellElement;
        const turnaroundTime = turnaroundTimestd[index] as HTMLTableCellElement;
        const waitingTime = waitingTimestd[index] as HTMLTableCellElement;
        const responseTime = responseTimestd[index] as HTMLTableCellElement;

        completionTime.textContent = "-";
        turnaroundTime.textContent = "-";
        waitingTime.textContent = "-"
        responseTime.textContent = "-"
    }

    tableBody.appendChild(newRow);
});


decreaseRowButton.addEventListener("click", () => {
    console.log("Decrease")
    const items = tableBody.querySelectorAll("tr")

    if (items.length > 1) {
        processNumber--;
        const lastItem = items[items.length - 1]
        tableBody.removeChild(lastItem);
    }

    const completionTimestd = tableBody.querySelectorAll(".completion-time")
    const turnaroundTimestd = tableBody.querySelectorAll(".turn-around-time")
    const waitingTimestd = tableBody.querySelectorAll(".waiting-time")
    const responseTimestd = tableBody.querySelectorAll(".response-time")

    for (let index = 0; index < completionTimestd.length; index++) {
        const completionTime = completionTimestd[index] as HTMLTableCellElement;
        const turnaroundTime = turnaroundTimestd[index] as HTMLTableCellElement;
        const waitingTime = waitingTimestd[index] as HTMLTableCellElement;
        const responseTime = responseTimestd[index] as HTMLTableCellElement;

        completionTime.textContent = "-";
        turnaroundTime.textContent = "-";
        waitingTime.textContent = "-"
        responseTime.textContent = "-"
    }
})

submitButton.addEventListener("click", () => {
    const arrivalTimesInputs = tableBody.querySelectorAll(".arrival-time")
    const burstTimesInputs = tableBody.querySelectorAll(".burst-time")
    const priorityNumberInputs = tableBody.querySelectorAll(".priority-number")
    let isValid = true;

    if(!timeQuantumInput.value) {
        timeQuantumInput.classList.add("is-danger")
        isValid = false;
    }

    priorityNumberInputs.forEach(priorityNumbers => {
        const priorityNumberInputs = priorityNumbers as HTMLInputElement

        if (!priorityNumberInputs.value) {
            priorityNumberInputs.classList.add("is-danger");
            priorityNumberInputs.addEventListener("focus", () => {
                priorityNumberInputs.classList.remove("is-danger")
                isValid = false;
            })
        }
    });    

    arrivalTimesInputs.forEach(arrivalTimes => {
        const arrivalTimesInput = arrivalTimes as HTMLInputElement

        if (!arrivalTimesInput.value) {
            arrivalTimesInput.classList.add("is-danger");
            arrivalTimesInput.addEventListener("focus", () => {
                arrivalTimesInput.classList.remove("is-danger")
                isValid = false;
            })
        }
    });    

    burstTimesInputs.forEach(burstTimes => {
        const burstTimesInput = burstTimes as HTMLInputElement

        if (!burstTimesInput.value) {
            burstTimesInput.classList.add("is-danger");
            burstTimesInput.addEventListener("focus", () => {
                burstTimesInput.classList.remove("is-danger")
                isValid = false;
            })
        }
    });    

    if (isValid) {
        if (arrivalTimesInputs.length <= 1) {
            // Only one process, don't compute
        
            const averageTurnaroundTimeCell = document.getElementById("average-turnaround-time") as HTMLElement;
            const averageResponseTimeCell = document.getElementById("average-response-time") as HTMLElement;
            const averageWaitingTimeCell = document.getElementById("average-waiting-time") as HTMLElement;
            const cpuUtilizationCell = document.getElementById("cpu-utilization") as HTMLElement;
            const aveIdleTimeCell = document.getElementById("ave-idle-time") as HTMLElement;
        
        
            averageTurnaroundTimeCell.textContent = `Average Turn Around Time:\n0`;
            averageResponseTimeCell.textContent = `Average Response Time:\n0`;
            averageWaitingTimeCell.textContent = `Average Waiting Time:\n0`;
            cpuUtilizationCell.textContent = `0`;
            aveIdleTimeCell.textContent = `0`;
        
            // Clear Gantt Chart
            const ganttChartContainer = document.getElementById("gantt-chart") as HTMLElement;
            const numberBar = document.getElementById("number-bar") as HTMLElement;
        
            ganttChartContainer.innerHTML = "";
            numberBar.innerHTML = "";
        
            return; // Stop executing further
        }
        
        let turnaroundTimeSum: number = 0;
        let responseTimeSum: number = 0;
        let waitingTimeSum: number = 0;
        let expectedTotalBurstTime = 0;
        let finalCompletionTime = 0;
        const processValues : Process[] = [];

        for (let index = 0; index < arrivalTimesInputs.length; index++) {
            const arrivalTimesInput = arrivalTimesInputs[index] as HTMLInputElement
            const burstTimeInput = burstTimesInputs[index] as HTMLInputElement

            const process : Process = new Process(index, Number(arrivalTimesInput.value), Number(burstTimeInput.value), 0);

            processValues.push(process)
        }

        const PrioritySched = new Priority(processValues, Number(timeQuantumInput.value), 0);
        PrioritySched.computeProcess();

        const completionTimestd = tableBody.querySelectorAll(".completion-time")
        const turnaroundTimestd = tableBody.querySelectorAll(".turn-around-time")
        const waitingTimestd = tableBody.querySelectorAll(".waiting-time")
        const responseTimestd = tableBody.querySelectorAll(".response-time")

        for (let index = 0; index < turnaroundTimestd.length; index++) {
            const completionTime = completionTimestd[index] as HTMLTableCellElement;
            const turnaroundTime = turnaroundTimestd[index] as HTMLTableCellElement;
            const waitingTime = waitingTimestd[index] as HTMLTableCellElement;
            const responseTime = responseTimestd[index] as HTMLTableCellElement;

            completionTime.textContent = processValues[index].getCompletionTime().toString();

            turnaroundTime.textContent = processValues[index].getTurnaroundTime().toString();
            turnaroundTimeSum += processValues[index].getTurnaroundTime();

            waitingTime.textContent = processValues[index].getWaitingTime().toString();
            waitingTimeSum += processValues[index].getWaitingTime();

            responseTime.textContent = processValues[index].getResponseTime().toString();
            responseTimeSum += processValues[index].getResponseTime();
        }

        burstTimesInputs.forEach(element => {
            const burstTime = element as HTMLElement

            expectedTotalBurstTime += Number(burstTime.innerText)
        })

        completionTimestd.forEach(element => {
            const completionTime = element as HTMLElement

           if(Number(completionTime.innerText) > finalCompletionTime){
                finalCompletionTime = Number(completionTime.innerText);
           }
        });

        const averageTurnaroundTime = turnaroundTimeSum / turnaroundTimestd.length
        const averageResponseTime = responseTimeSum / turnaroundTimestd.length
        const averageWaitingTime = waitingTimeSum / turnaroundTimestd.length

        const averageTurnaroundTimeCell = document.getElementById("average-turnaround-time") as HTMLTableCellElement
        const averageResponseTimeCell = document.getElementById("average-response-time") as HTMLTableCellElement
        const averageWaitingTimeCell = document.getElementById("average-waiting-time") as HTMLTableCellElement;

        averageTurnaroundTimeCell.textContent =`Average Turn Around Time:\n${averageTurnaroundTime.toFixed(2).toString()}`;
        averageResponseTimeCell.textContent = `Average Response Time:\n${averageResponseTime.toFixed(2).toString()}`;
        averageWaitingTimeCell.textContent = `Average Waiting Time:\n${averageWaitingTime.toFixed(2).toString()}`;
    }
})

timeQuantumInput.addEventListener("focus", () => {
    timeQuantumInput.classList.remove("is-danger")
})

function clearCells() {
    const completionTimestd = tableBody.querySelectorAll(".completion-time")
    const turnaroundTimestd = tableBody.querySelectorAll(".turn-around-time")
    const waitingTimestd = tableBody.querySelectorAll(".waiting-time")
    const responseTimestd = tableBody.querySelectorAll(".response-time")

    for (let index = 0; index < completionTimestd.length; index++) {
        const completionTime = completionTimestd[index] as HTMLTableCellElement;
        const turnaroundTime = turnaroundTimestd[index] as HTMLTableCellElement;
        const waitingTime = waitingTimestd[index] as HTMLTableCellElement;
        const responseTime = responseTimestd[index] as HTMLTableCellElement;

        completionTime.innerHTML = "-";
        turnaroundTime.innerHTML = "-";
        waitingTime.innerText = "-"
        responseTime.innerText = "-"
    }
}