import { Bar } from 'react-chartjs-2';
import { chartFont, brandPalette } from './chartSetup';

export default function BarChartWidget({ labels = [], data = [], label = 'Value', horizontal = false }) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: brandPalette[0],
        borderRadius: 8,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: { titleFont: chartFont, bodyFont: chartFont, padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: !horizontal, color: 'rgba(148,163,184,0.15)' }, ticks: { font: chartFont } },
      y: { grid: { display: horizontal, color: 'rgba(148,163,184,0.15)' }, ticks: { font: chartFont } },
    },
  };

  return (
    <div className="h-72 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
