export function validateInputs() {
    const inputs = document.getElementById('data-table').querySelectorAll('input[type="number"]');
    let valid = true;

    console.log(inputs);
    if (inputs.length < 4) {
        showModal("You should have at least 2 points.");
        valid = false;
    }

    if (inputs.length > 32) {
        showModal("You should have not more than 16 points.");
        valid = false;
    }

    inputs.forEach(input => {
        input.classList.remove('input-error');
        clearErrorMessage(input);

        const value = input.value.replace(',', '.');
        const number = parseFloat(value);

        if (isNaN(number)) {
            markAsInvalid(input, 'Enter a number');
            valid = false;
        }
    });

    const targetXInput = document.getElementById('target-x-input-field');
    if (targetXInput) {
        valid = validateTargetX(targetXInput) && valid;
    }

    return valid;
}

export function getBorderInputs() {
    const allInputs = document.getElementsByTagName('input');
    const result = [];

    for (const input of allInputs) {
        if (input.type === 'number') {
            const hasIntervalClass = Array.from(input.classList).some(
                className => className.startsWith('interval-')
            );
            
            if (hasIntervalClass) {
                result.push(input);
            }
        }
    }

    return result;
}

export function validateBorders(inputs) {

    let valid = true;

    inputs.forEach(input => {
        input.classList.remove('input-error');
        clearErrorMessage(input);

        const value = input.value.replace(',', '.');
        const number = parseFloat(value);

        if (isNaN(number)) {
            markAsInvalid(input, 'Enter a number');
            valid = false;
        }

        if (Math.abs(number) > 1e40) {
            markAsInvalid(input, "А губозакаточную машинку?");
        }
    });

    const l = parseFloat(document.getElementById('interval-start').value.replace(',', '.'));
    const r = parseFloat(document.getElementById('interval-end').value.replace(',', '.'));
    const interval_amount = parseFloat(document.getElementById('interval-amount').value.replace(',', '.'));

    
    if (l > r) {
        markAsInvalid(document.getElementById('interval-end'), "Left border can not be greater than right.");
        valid = false;
    }

    if (interval_amount < 2) {
        markAsInvalid(document.getElementById('interval-amount'), "You should have at least 2 intervals");
        valid = false;
    }

    if (interval_amount > 15) {
        markAsInvalid(document.getElementById('interval-amount'), "You can create up to 15 intervals.");
        valid = false;
    }

    console.log(l, r);
    

    return valid;
}

export function getBorders() {
    const l = document.getElementById("interval-start").value.replace(',', '.');
    const r = document.getElementById("interval-end").value.replace(',', '.');
    return [l, r];
}

function validateTargetX(targetXInput) {
    clearErrorMessage(targetXInput);
    const targetValue = parseFloat(targetXInput.value.replace(',', '.'));

    if (isNaN(targetValue)) {
        markAsInvalid(targetXInput, 'Enter a number');
        return false;
    }

    const xValues = Array.from(
        document.querySelectorAll('#data-table tbody tr')
    ).map(row => {
        const xInput = row.querySelector('td:first-child input[type="number"]');
        return parseFloat(xInput?.value.replace(',', '.'));
    }).filter(val => !isNaN(val));


    if (xValues.length === 0) {
        markAsInvalid(targetXInput, 'No valid X values in table');
        return false;
    }

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    if (targetValue < minX || targetValue > maxX) {
        markAsInvalid(targetXInput, `X must be between ${minX} and ${maxX}`);
        return false;
    }
    targetXInput.classList.remove('input-error');

    return true;
}

function clearErrorMessage(input) {
    const existingMessage = input.parentElement.querySelector('.error-message');
    if (existingMessage) existingMessage.remove();
}

function markAsInvalid(input, message) {
    input.classList.add('input-error');
    const msg = document.createElement('div');
    msg.className = 'error-message';
    msg.textContent = message;
    input.parentElement.appendChild(msg);
}

export function showModal(message) {
    let alertBox = document.getElementById('customAlertBox');
    let overlay = document.getElementById('modalOverlay');
    
    if (alertBox) document.body.removeChild(alertBox);
    if (overlay) document.body.removeChild(overlay);
    
    alertBox = document.createElement('div');
    alertBox.id = 'customAlertBox';
    alertBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        padding: 25px;
        background: #ffffff;
        border: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        border-radius: 12px;
        text-align: center;
        max-width: 80%;
        width: 300px;
        opacity: 0;
        transition: all 0.3s ease-out;
        font-family: 'Segoe UI', Roboto, sans-serif;
    `;
    
    const messageEl = document.createElement('div');
    messageEl.id = 'customAlertMessage';
    messageEl.style.cssText = `
        margin-bottom: 20px;
        font-size: 16px;
        color: #333;
        line-height: 1.5;
    `;
    
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.cssText = `
        padding: 8px 20px;
        background: #4a6bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
    `;
    
    okButton.onmouseover = function() {
        this.style.background = '#3a56e0';
        this.style.transform = 'translateY(-1px)';
    };
    
    okButton.onmouseout = function() {
        this.style.background = '#4a6bff';
        this.style.transform = 'translateY(0)';
    };
    
    const closeModal = () => {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
        if (overlay) overlay.style.opacity = '0';
        
        setTimeout(() => {
            if (alertBox.parentNode) document.body.removeChild(alertBox);
            if (overlay && overlay.parentNode) document.body.removeChild(overlay);
        }, 300);
    };
    
    okButton.onclick = closeModal;
    
    alertBox.appendChild(messageEl);
    alertBox.appendChild(okButton);
    document.body.appendChild(alertBox);
    
    messageEl.textContent = message;
    
    setTimeout(() => {
        alertBox.style.opacity = '1';
        alertBox.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    overlay.id = 'modalOverlay';
    
    overlay.onclick = closeModal;
    
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
}