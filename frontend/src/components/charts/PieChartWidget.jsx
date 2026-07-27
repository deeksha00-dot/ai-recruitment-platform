import { Doughnut } from 'react-chartjs-2';
import { chartFont, brandPalette } from './chartSetup';

export default function PieChartWidget({ labels = [], data = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: brandPalette,
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    animation: { duration: 700, easing: 'easeOutQuart' },
    plugins: {
      legend: { position: 'bottom', labels: { font: chartFont, usePointStyle: true, padding: 16 } },
      tooltip: { titleFont: chartFont, bodyFont: chartFont, padding: 10, cornerRadius: 8 },
    },
  };

  return (
    <div className="h-72 w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
