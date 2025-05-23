export function renderGraph(canvas, x, y, original_X, original_Y, target_x, target_y) {
  if (!canvas || !x || !y || !original_X || !original_Y) {
    console.error('Not enough data to plot a graph');
    return;
  }
  console.log(target_y);
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
        },
        {
          label: 'Target point',
          data: [{ x: target_x, y: target_y }],
          backgroundColor: 'rgb(200, 99, 255)',
          pointRadius: 8,
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
          // min: Math.floor(x[0]),
          // max: Math.floor(x[x.length - 1])
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

export function renderFuncGraph(canvas, x, y, original_X, target_x, target_y, func) {
  if (!canvas || !x || !y || !original_X || !func) {
    console.error('Not enough data to plot a graph');
    return;
  }

  const ctx = canvas.getContext('2d');

  const funcPoints = x.map(xi => ({ x: xi, y: func(xi) }));

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
          label: 'Original function',
          data: funcPoints,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Input points',
          data: original_X.map(xi => ({ x: xi, y: func(xi) })),
          backgroundColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 5,
          pointHoverRadius: 6,
          showLine: false,
          type: 'scatter'
        },
        {
          label: 'Target point',
          data: [{ x: target_x, y: target_y }],
          backgroundColor: 'rgb(200, 99, 255)',
          pointRadius: 8,
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
          min: Math.min(...x),
          max: Math.max(...x)
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: 'Y'
          },
          min: Math.min(...y, ...funcPoints.map(p => p.y)),
          max: Math.max(...y, ...funcPoints.map(p => p.y))
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
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
              return label;
            }
          }
        }
      }
    }
  });
}