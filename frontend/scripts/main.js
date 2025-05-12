import {sendData} from './http.js'
import {handleFileUpload} from './file.js'
import {validateInputs} from './validateInput.js'
import { createApproximationBlock, generateTable, createTabs } from './uiBuilder.js';

document.getElementById('sendButton').addEventListener('click', async () => {
    if (!validateInputs()) {
        return;
    }
    const response = await sendData();

    const container = document.getElementById('resultContainer');
    container.innerHTML = ''; 
    const tabData = [];

    for (const [method, data] of Object.entries(response)) {
        const block = createApproximationBlock(method, data);
        tabData.push({ title: method, content: block, isBest: data.best_approximation, isSuccessful: data.calculation_success });
        document.getElementById('mainContainer').classList.add('has-result');
        document.getElementById('resultContainer').classList.remove('invisible');
    }

    createTabs(container, tabData);
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

window.onload = generateTable;