function plotLinear(xValues, yValues) {
    plotLinearLine(xValues[0], yValues[0], xValues[xValues.length - 1], yValues[yValues.length - 1]);
}

export { plotLinear };

function plotLinearLine(x1, y1, x2, y2) {
    const ctx = document.getElementById('chart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [x1, x2],
            datasets: [{
                label: 'Прямая',
                data: [y1, y2],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0  // чтобы линия была строго прямой
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'X'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y'
                    }
                }
            },
            responsive: true
        }
    });
}