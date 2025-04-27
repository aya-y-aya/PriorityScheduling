import { Process } from "./process_class.js";
import { RoundRobin } from "./round_robin.js";
const tableBody = document.getElementById("table-body");
const addRowButton = document.getElementById("add-row-button");
const decreaseRowButton = document.getElementById("decrease-row-button");
const submitButton = document.getElementById("submit-button");
const timeQuantumInput = document.getElementById("time-quantum-input");
let processNumber = 1;
addRowButton.addEventListener("click", () => {
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
    tableBody.appendChild(newRow);
});
decreaseRowButton.addEventListener("click", () => {
    const items = tableBody.querySelectorAll("tr");
    if (items.length > 1) {
        processNumber--;
        const lastItem = items[items.length - 1];
        tableBody.removeChild(lastItem);
    }
    console.log(items);
});
submitButton.addEventListener("click", () => {
    const arrivalTimesInputs = tableBody.querySelectorAll(".arrival-time");
    const burstTimesInputs = tableBody.querySelectorAll(".burst-time");
    let isValid = true;
    if (!timeQuantumInput.value) {
        timeQuantumInput.classList.add("is-danger");
        isValid = false;
    }
    arrivalTimesInputs.forEach(arrivalTimes => {
        const arrivalTimesInput = arrivalTimes;
        if (!arrivalTimesInput.value) {
            arrivalTimesInput.classList.add("is-danger");
            arrivalTimesInput.addEventListener("focus", () => {
                arrivalTimesInput.classList.remove("is-danger");
                isValid = false;
            });
        }
    });
    burstTimesInputs.forEach(burstTimes => {
        const burstTimesInput = burstTimes;
        if (!burstTimesInput.value) {
            burstTimesInput.classList.add("is-danger");
            burstTimesInput.addEventListener("focus", () => {
                burstTimesInput.classList.remove("is-danger");
                isValid = false;
            });
        }
    });
    if (isValid) {
        if (arrivalTimesInputs.length <= 1) {
            // Only one process, don't compute
            const averageTurnaroundTimeCell = document.getElementById("average-turnaround-time");
            const averageResponseTimeCell = document.getElementById("average-response-time");
            const averageWaitingTimeCell = document.getElementById("average-waiting-time");
            averageTurnaroundTimeCell.textContent = `Average Turn Around Time:\n0`;
            averageResponseTimeCell.textContent = `Average Response Time:\n0`;
            averageWaitingTimeCell.textContent = `Average Waiting Time:\n0`;
            // Clear Gantt Chart
            const ganttChartContainer = document.getElementById("gantt-chart");
            const numberBar = document.getElementById("number-bar");
            ganttChartContainer.innerHTML = "";
            numberBar.innerHTML = "";
            return; // Stop executing further
        }
        let turnaroundTimeSum = 0;
        let responseTimeSum = 0;
        let waitingTimeSum = 0;
        const processValues = [];
        for (let index = 0; index < arrivalTimesInputs.length; index++) {
            const arrivalTimesInput = arrivalTimesInputs[index];
            const burstTimeInput = burstTimesInputs[index];
            const process = new Process(index, Number(arrivalTimesInput.value), Number(burstTimeInput.value));
            processValues.push(process);
        }
        const roundRobin = new RoundRobin(processValues, Number(timeQuantumInput.value));
        roundRobin.computeProcess();
        console.log(processValues);
        const completionTimestd = tableBody.querySelectorAll(".completion-time");
        const turnaroundTimestd = tableBody.querySelectorAll(".turn-around-time");
        const waitingTimestd = tableBody.querySelectorAll(".waiting-time");
        const responseTimestd = tableBody.querySelectorAll(".response-time");
        for (let index = 0; index < turnaroundTimestd.length; index++) {
            const completionTime = completionTimestd[index];
            const turnaroundTime = turnaroundTimestd[index];
            const waitingTime = waitingTimestd[index];
            const responseTime = responseTimestd[index];
            completionTime.textContent = processValues[index].getCompletionTime().toString();
            turnaroundTime.textContent = processValues[index].getTurnaroundTime().toString();
            turnaroundTimeSum += processValues[index].getTurnaroundTime();
            waitingTime.textContent = processValues[index].getWaitingTime().toString();
            waitingTimeSum += processValues[index].getWaitingTime();
            responseTime.textContent = processValues[index].getResponseTime().toString();
            responseTimeSum += processValues[index].getResponseTime();
            console.log(processValues[index].getArrivalTimes());
            console.log(processValues[index].getCompletionTimes());
        }
        const averageTurnaroundTime = turnaroundTimeSum / turnaroundTimestd.length;
        const averageResponseTime = responseTimeSum / turnaroundTimestd.length;
        const averageWaitingTime = waitingTimeSum / turnaroundTimestd.length;
        const averageTurnaroundTimeCell = document.getElementById("average-turnaround-time");
        const averageResponseTimeCell = document.getElementById("average-response-time");
        const averageWaitingTimeCell = document.getElementById("average-waiting-time");
        averageTurnaroundTimeCell.textContent = `Average Turn Around Time:\n${averageTurnaroundTime.toFixed(2).toString()}`;
        averageResponseTimeCell.textContent = `Average Response Time:\n${averageResponseTime.toFixed(2).toString()}`;
        averageWaitingTimeCell.textContent = `Average Waiting Time:\n${averageWaitingTime.toFixed(2).toString()}`;
    }
});
timeQuantumInput.addEventListener("focus", () => {
    timeQuantumInput.classList.remove("is-danger");
});
