import { showModal } from './validateInput.js'
import {deleteTableRow} from './uiBuilder.js'


export function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.trim().split('\n');
        const data = lines.map(line => line.replace(',', '.').trim().split(/[ ;\t]+/).map(Number));

        const validData = data.filter(pair => pair.length === 2 && !isNaN(pair[0]) && !isNaN(pair[1]));
        console.log(content, validData);
        if (validData.length === 0) {
            showModal("Incorrect input format");
            event.target.value = "";
            return;
        }

        if (validData.length < 2) {
            showModal("You need to provide at least 2 points");
            event.target.value = "";
            return;
        }

        if (validData.length > 15) {
            showModal("You need to provide not more than 15 points");
            event.target.value = "";
            return;
        }

        fillTableWithData(validData);
    };

    reader.readAsText(file);
}


export function fillTableWithData(data) {
    
    const tbody = document.getElementById('data-table').querySelector('tbody');
    tbody.innerHTML = '';

    data.forEach(([x, y]) => {
        const row = document.createElement('tr');

        const cellX = document.createElement('td');
        const inputX = document.createElement('input');
        inputX.type = 'number';
        inputX.step = 'any';
        inputX.required = true;
        inputX.classList.add('x-input');
        inputX.value = x;
        cellX.appendChild(inputX);

        const cellY = document.createElement('td');
        const inputY = document.createElement('input');
        inputY.type = 'number';
        inputY.step = 'any';
        inputY.required = true;
        inputY.value = y;
        cellY.appendChild(inputY);

        const cellAction = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTableRow(row));
        cellAction.appendChild(deleteBtn);

        row.appendChild(cellX);
        row.appendChild(cellY);
        row.appendChild(cellAction);
        tbody.appendChild(row);
    });
}

export function fillTableWithFunction(start, end, intervalsCount, func) {

    const step = (end - start) / intervalsCount;
    const pointsCount = intervalsCount + 1;
    
    const data = [];
    for (let i = 0; i < pointsCount; i++) {
        const x = start + i * step;
        const y = func(x);
        data.push([x, y]);
    }

    const tbody = document.getElementById('data-table').querySelector('tbody');
    
    tbody.innerHTML = '';


    data.forEach(([x, y]) => {
        const row = document.createElement('tr');

        const cellX = document.createElement('td');
        const inputX = document.createElement('input');
        inputX.type = 'number';
        inputX.step = 'any';
        inputX.required = true;
        inputX.classList.add('x-input');
        inputX.value = x;
        cellX.appendChild(inputX);

        const cellY = document.createElement('td');
        const inputY = document.createElement('input');
        inputY.type = 'number';
        inputY.step = 'any';
        inputY.required = true;
        inputY.value = y;
        cellY.appendChild(inputY);

        const cellAction = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTableRow(row));
        cellAction.appendChild(deleteBtn);

        row.appendChild(cellX);
        row.appendChild(cellY);
        row.appendChild(cellAction);
        tbody.appendChild(row);
    });
}


export function saveJsonToFile(method, data) {
    const { x_for_graph, y_for_graph, p_for_graph, ...filteredData } = data;

    const jsonString = JSON.stringify(filteredData, null, 4); 
    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = method;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}