import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export const chartFont = {
  family: "'Inter', sans-serif",
  size: 12,
};

export const brandPalette = ['#2f63f6', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];
