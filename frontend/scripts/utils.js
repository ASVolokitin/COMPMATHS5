export function getIntervalStart() {
    const start = parseFloat(document.getElementById("interval-start").value.replace(",", "."));
    return start;
}

export function getIntervalEnd() {
    const end = parseFloat(document.getElementById("interval-end").value.replace(",", "."));
    return end;
}

export function getIntervalAmount() {
    const amount = parseInt(document.getElementById("interval-amount").value.replace(",", "."));
    document.getElementById("interval-amount").value = amount;
    return amount;
}