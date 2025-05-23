import { fillTableWithData } from './file.js'

export async function sendData() {
    const tbody = document.getElementById('data-table').querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const x = [];
    const y = [];

    document.getElementById('resultContainer').classList.add('invisible');

    for (const row of rows) {
        const inputs = row.querySelectorAll('input');
        const xi = parseFloat(inputs[0].value);
        const yi = parseFloat(inputs[1].value);

        if (isNaN(xi) || isNaN(yi)) {
            document.getElementById('mainContainer').classList.remove('has-result');
            alert('Please, fill all the fields with real numbers.');
            return;
        }

        x.push(xi);
        y.push(yi);
    }

    const inputRequestedX = document.querySelector('.target-x-input-field');
    const targetX = parseFloat(inputRequestedX?.value);

    if (isNaN(targetX)) {
        alert('Please enter a valid x value for interpolation.');
        return;
    }

    document.getElementById("resultContainer").classList.remove("shutdown");

    const response = await fetch('http://localhost:8000/interpolate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            x_arr: x,
            y_arr: y,
            target_x: targetX
        })
    });

    const result = await response.json();
    return result;
}

function sendFuncData(data) {
    fillTableWithData(data);
    sendData();
    addGraph(data);
}

export function sendSinData(data) {
    const X =  Array.from(document.querySelectorAll('.x-input')).map(input => input.value);
    sendFuncData(X.map(x => [x, Math.sin]));
}

export function sendSqrData(data) {
    const X =  Array.from(document.querySelectorAll('.x-input')).map(input => input.value);
    sendFuncData(X.map(x => [x, x * x]));
}