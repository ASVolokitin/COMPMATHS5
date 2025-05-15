import {sendData} from './http.js'
import {handleFileUpload, fillTableWithData} from './file.js'
import {validateInputs} from './validateInput.js'
import { createApproximationBlock, generateTable, createTabs } from './uiBuilder.js';

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
    fillTableWithData(X.map(x => [x, Math.sin(x)]));
    const func = x => Math.sin(x);
    createResult(func);
});

document.getElementById('fillSqrBtn').addEventListener('click', async () => {
    const X =  Array.from(document.querySelectorAll('.x-input')).map(input => input.value);
    fillTableWithData(X.map(x => [x, x * x]));
    const func = x => x * x;
    createResult(func);
});

document.getElementById('points-count').addEventListener('change', async () => {
    generateTable();
});

document.getElementById('fileInput').addEventListener('change', handleFileUpload);

document.getElementById('fileUploadBtn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('wheel', (e) => e.preventDefault(), {passive: false});
});

document.getElementById('fillSinBtn').addEventListener('click', () => {
    
})

document.getElementById('fillSqrBtn').addEventListener('click', () => {
   
})

window.onload = generateTable;