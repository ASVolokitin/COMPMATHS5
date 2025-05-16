import {sendData} from './http.js'
import {handleFileUpload, fillTableWithData, fillTableWithFunction} from './file.js'
import {getBorderInputs, validateBorders, validateInputs} from './validateInput.js'
import { createApproximationBlock, generateTable, createTabs, addTableRow } from './uiBuilder.js';
import { getIntervalAmount, getIntervalEnd, getIntervalStart } from './utils.js';

export async function createResult(func=null) {
    if (!validateInputs()) {
        return;
    }
    const response = await sendData();

    const container = document.getElementById('resultContainer');
    container.style.display = "block"
    container.innerHTML = ''; 
    const tabData = [];

    for (const [method, data] of Object.entries(response)) {
        const block = createApproximationBlock(method, data, func);
        tabData.push({ title: method, content: block, isBest: data.best_approximation, isSuccessful: data.calculation_success });
        document.getElementById('mainContainer').classList.add('has-result');
        document.getElementById('resultContainer').classList.remove('invisible');
    }

    createTabs(container, tabData);
}

document.getElementById('sendButton').addEventListener('click', async () => {
    createResult();
});

document.getElementById('fillSinBtn').addEventListener('click', async () => {
    const X =  Array.from(document.querySelectorAll('.x-input')).map(input => input.value);
    const borders = getBorderInputs();
    console.log(borders);
    if (validateBorders(borders) && borders[0] <= borders[1]) {
        console.log(borders);
        const func = x => Math.sin(x);
        fillTableWithFunction(getIntervalStart(), getIntervalEnd(), getIntervalAmount(), func);        
        createResult(func);
    }
    
});

document.getElementById('fillSqrBtn').addEventListener('click', async () => {
    const X =  Array.from(document.querySelectorAll('.x-input')).map(input => input.value);
    const borders = getBorderInputs();
    console.log(borders);
    if (validateBorders(borders) && borders[0] <= borders[1]) {
        console.log(borders);
        const func = x => x * x;
        fillTableWithFunction(getIntervalStart(), getIntervalEnd(), getIntervalAmount(), func);        
        createResult(func);
    }
});

document.getElementById('fileInput').addEventListener('change', handleFileUpload);

document.getElementById('fileUploadBtn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('wheel', (e) => e.preventDefault(), {passive: false});
});

document.getElementById("addRowBtn").addEventListener('click', () => {
    addTableRow();
});

window.onload = generateTable(7);