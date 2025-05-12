export function renderGraph(canvas, x, y, original_X, original_Y) {
  if (!canvas || !x || !y || !original_X || !original_Y) {
    console.error('Not enough data to plot a graph');
    return;
  }

  const ctx = canvas.getContext('2d');

  return new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Approximation',
          data: x.map((xi, i) => ({ x: xi, y: y[i] })),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointRadius: 0
        },
        {
          label: 'Input points',
          data: original_X.map((xi, i) => ({ x: xi, y: original_Y[i] })),
          backgroundColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 5,
          pointHoverRadius: 6,
          showLine: false,
          type: 'scatter'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'X'
          },
          min: Math.floor(x[0]),
          max: Math.floor(x[x.length - 1])
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: 'Y'
          }
        }
      },
      plugins: {
        zoom: {
            pan: {
                enabled: true,
                mode: 'xy',
                modifierKey: null
            },
            zoom: {
                wheel: {
                    enabled: true
                },
                pinch: {
                    enabled: true
                },
                mode: 'xy'
            }
        }
    }
}
  });
}