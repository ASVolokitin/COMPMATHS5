import { renderGraph, renderFuncGraph } from './graphRenderer.js';  
import { saveJsonToFile } from './file.js'

export function createTabs(container, tabData) {

    const nav = document.createElement('div');
    nav.className = 'tab-nav';

    const contentArea = document.createElement('div');
    contentArea.className = 'tab-content';

    tabData.forEach((tab, index) => {
        const btn = document.createElement('button');
        btn.textContent = tab.title;
        const tabId = tab.title.toLowerCase().replace(/\s+/g, '-');

        btn.addEventListener('click', () => {
            const buttons = document.querySelectorAll('.tab-nav button');
            buttons.forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => pane.classList.remove('active'));

            const activeTab = document.getElementById(tabId);
            if (activeTab) {
                activeTab.classList.add('active');
            }

            contentArea.style.opacity = 0;
            setTimeout(() => {
                contentArea.innerHTML = '';
                contentArea.appendChild(tab.content);
                contentArea.style.opacity = 1;
            }, 400);
        });

        if (tab.isBest) {
            btn.classList.add('best-tab');
        }

        if (tab.isSuccessful == false) {
            btn.classList.add('failed-tab');
        }

        nav.appendChild(btn);

        if (index === 0) {
            contentArea.appendChild(tab.content); 
            btn.classList.add('active');
        }

        tab.content.id = tabId;
    });

    container.appendChild(nav);
    container.appendChild(contentArea);
}

export function createApproximationBlock(method, data, func) {
    const wrapper = document.createElement('div');

    const canvasContainer = document.createElement('div');
    canvasContainer.style.height = "500px";
    const graphCanvas = document.createElement('canvas');
    graphCanvas.style.border = "2px solid #f0f0f0";
    graphCanvas.id = `graph-${method}`;
    canvasContainer.appendChild(graphCanvas);
    wrapper.appendChild(canvasContainer);
    if (func == null) renderGraph(graphCanvas, data.x_for_graph, data.p_for_graph, data.x_arr, data.y_arr, data.target_x, data.target_y);
    else renderFuncGraph(graphCanvas, data.x_for_graph, data.p_for_graph, data.x_arr, data.target_x, data.target_y, func)

    const paramsTable = document.createElement('table');
    paramsTable.className = 'params-table';
    const tbody = document.createElement('tbody');
    
    for (const [key, value] of Object.entries(data)) {
        if (!key.endsWith("_for_graph") && key !== "finite_differences") {
            const row = document.createElement('tr');
            
            let cellKey = document.createElement('td');
            cellKey.className = 'param-key'; 
            cellKey.textContent = key.replace(/_/g, " ");
            if (key === "mse") cellKey.textContent = cellKey.textContent.toUpperCase();
            row.appendChild(cellKey);

            const cellValue = document.createElement('td');
            cellValue.className = 'param-value';

            let formattedValue = value; 
            if (key === "x" || key === "y") {
                if (Array.isArray(formattedValue)) {
                    formattedValue = formattedValue.map(item => (typeof Decimal(item).toNumber() === 'number') ? parseFloat(Decimal(item).toNumber().toFixed(10)) : item);
                } else if (typeof formattedValue === 'number') {
                    formattedValue = parseFloat(formattedValue);
                }
            }

            if (formattedValue === "" || formattedValue === null || formattedValue === undefined || (Array.isArray(value) && value.length === 0)) {
                continue;
            }

            if (key.toLowerCase() === "errors" && !formattedValue) {
                continue;
            }

            if (typeof value === "boolean") {
                formattedValue = value ? "✅" : "❌";
            }

            if (Array.isArray(formattedValue)) {
                if (key.toLowerCase() === "errors") {
                    formattedValue = formattedValue.join('\n\n');
                }
                else if (key.toLowerCase() === "y_arr") {
                    formattedValue = "• " + formattedValue.join('\n• ');
                }
                else formattedValue = formattedValue.join(', ');
            }

            if (key.toLowerCase() == "coefficient_of_determination") {
                cellValue.innerHTML = `
                    <div class="result-value-container">
                        <a class='result-value'>${formattedValue}</a>
                        <a class='underline-value'>${interpretDetermination(formattedValue)}</a>
                    </div>
                    `;
                cellValue.style.display = 'contents';
                cellValue.style.gap = '5px';
            }
            else cellValue.textContent = formattedValue;
            row.appendChild(cellValue);

            tbody.appendChild(row);
        }
    }

    paramsTable.appendChild(tbody);
    wrapper.appendChild(paramsTable);
    if (data.finite_differences && data.finite_differences.length > 1) {
        const diffHeader = document.createElement('h3');
        diffHeader.textContent = 'Finite Differences Table';
        diffHeader.style.marginTop = '20px';
        wrapper.appendChild(diffHeader);

        const diffTableContainer = document.createElement('div');
        diffTableContainer.classList.add("table-scroll-container")
        const diffTable = document.createElement('table');
        diffTable.className = 'finite-differences-table';
        diffTable.style.marginTop = '10px';
        diffTable.style.borderCollapse = 'collapse';
        diffTable.style.width = '100%';

        const diffThead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        headerRow.appendChild(document.createElement('th'));
        for (let i = 0; i < data.finite_differences[0].length; i++) {
            const th = document.createElement('th');
            th.textContent = `Δ${i}`;
            th.style.padding = '8px';
            th.style.border = '1px solid #ddd';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        }
        diffThead.appendChild(headerRow);
        diffTable.appendChild(diffThead);

        const diffTbody = document.createElement('tbody');
        diffTbody.classList.add("scrollable-tbody");
        for (let i = 0; i < data.finite_differences.length; i++) {
            const row = document.createElement('tr');
            
            const indexCell = document.createElement('td');
            indexCell.textContent = i;
            indexCell.style.padding = '8px';
            indexCell.style.border = '1px solid #ddd';
            indexCell.style.textAlign = 'center';
            indexCell.style.fontWeight = 'bold';
            row.appendChild(indexCell);

            for (let j = 0; j < data.finite_differences[i].length; j++) {
                const cell = document.createElement('td');
                const num = parseFloat(data.finite_differences[i][j]);
                cell.textContent = isNaN(num) ? data.finite_differences[i][j] : num.toFixed(4);
                cell.style.padding = '8px';
                cell.style.border = '1px solid #ddd';
                cell.style.textAlign = 'center';
                row.appendChild(cell);
            }
            diffTbody.appendChild(row);
        }
        diffTable.appendChild(diffTbody);
        diffTableContainer.appendChild(diffTable);
        wrapper.appendChild(diffTableContainer);
    }

    const saveBtn = document.createElement('button');
    saveBtn.id = 'save-results';
    saveBtn.style.marginTop = '20px';
    saveBtn.className = 'button';
    saveBtn.textContent = 'Save result';
    saveBtn.addEventListener('click', () => saveJsonToFile(method, data));

    wrapper.appendChild(saveBtn);
    
    return wrapper;
}

function interpretDetermination(val) {
    const num = new Decimal(val).toNumber();
    if (isNaN(num)) return '';
    if (num == 1) return "Amazing result!";
    if (num >= 0.95) return 'High precision approximation';
    if (num >= 0.75) return 'Satisfactory approximation';
    if (num >= 0.5) return 'Weak approximation';
    if (num == -1) return "It is impossible to interpolate these points with this function";
    return 'Model requires modification, approximation accuracy is inadequate';
}

export function generateTable(count) {
    const table_container = document.getElementById('data-table');
    const tbody = document.getElementById('data-table').querySelector('tbody');
    tbody.innerHTML = "";

    const defaultX = Array.from({length: count  + 1}, (_, i) => i + 1);
    const defaultY = defaultX.map(xi => (2 * xi + 1 + Math.random() * 20 - 1).toFixed(2)); 

    for (let i = 0; i < count; i++) {
        const row = document.createElement('tr');

        const cellX = document.createElement('td');
        const inputX = document.createElement('input');
        inputX.type = 'number';
        inputX.step = 'any';
        inputX.required = true;
        inputX.classList.add("x-input");
        inputX.value = defaultX[i];
        cellX.appendChild(inputX);

        const cellY = document.createElement('td');
        const inputY = document.createElement('input');
        inputY.type = 'number';
        inputY.step = 'any';
        inputY.required = true;
        inputY.value = defaultY[i];
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
    }

}

export function addTableRow() {
    const tbody = document.getElementById('data-table').querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const lastXInput = rows.length > 0 ? 
        rows[rows.length - 1].querySelector('.x-input') : null;
    
    const newX = lastXInput ? parseFloat(lastXInput.value) + 1 : 1;
    const newY = Math.round(Math.random() * 10 * 100) / 100;
    
    const row = document.createElement('tr');

    const cellX = document.createElement('td');
    const inputX = document.createElement('input');
    inputX.type = 'number';
    inputX.step = 'any';
    inputX.required = true;
    inputX.classList.add('x-input');
    inputX.value = newX;
    cellX.appendChild(inputX);

    const cellY = document.createElement('td');
    const inputY = document.createElement('input');
    inputY.type = 'number';
    inputY.step = 'any';
    inputY.required = true;
    inputY.classList.add('y-input');
    inputY.value = newY;
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

    updatePointsCount();
}

export function deleteTableRow(row) {
    row.remove();
    updatePointsCount();
}

export function getTableData() {
    const tbody = document.getElementById('data-table').querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const data = [];
    
    rows.forEach(row => {
        const x = parseFloat(row.querySelector('.x-input').value);
        const y = parseFloat(row.querySelector('.y-input').value);
        data.push([x, y]);
    });
    
    return data;
}