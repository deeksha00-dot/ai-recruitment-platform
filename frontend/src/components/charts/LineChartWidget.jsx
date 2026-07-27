import { Line } from 'react-chartjs-2';
import { chartFont } from './chartSetup';

export default function LineChartWidget({ labels = [], data = [], label = 'Applications' }) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: '#2f63f6',
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return 'rgba(47,99,246,0.15)';
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(47,99,246,0.35)');
          gradient.addColorStop(1, 'rgba(47,99,246,0.02)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#2f63f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: { titleFont: chartFont, bodyFont: chartFont, padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: chartFont } },
      y: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { font: chartFont } },
    },
  };

  return (
    <div className="h-72 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
