import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatDuration } from '../hooks/useAggregation';
import type { Item } from '../models/Item';
import './BarChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    data: Array<{
        itemId: string;
        seconds: number;
    }>;
    items: Item[];
}

// Default color palette for items without custom colors
const DEFAULT_COLORS = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f43f5e', // rose
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#3b82f6', // blue
];

export function BarChart({ data, items }: BarChartProps) {
    // Sort by seconds descending
    const sortedData = [...data].sort((a, b) => b.seconds - a.seconds);

    const getItemName = (itemId: string): string => {
        return items.find((i) => i.id === itemId)?.name ?? '不明';
    };

    const getItemColor = (itemId: string, index: number): string => {
        const item = items.find((i) => i.id === itemId);
        return item?.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    };

    const chartData = {
        labels: sortedData.map((d) => getItemName(d.itemId)),
        datasets: [
            {
                label: '作業時間',
                data: sortedData.map((d) => d.seconds / 60), // 元々は / 3600 (hours)
                backgroundColor: sortedData.map((d, i) => getItemColor(d.itemId, i)),
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: { raw: unknown }) => {
                        const minutes = context.raw as number;
                        const seconds = Math.round(minutes * 60);
                        return formatDuration(seconds);
                    },
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    callback: (value: number | string) => {
                        const minutes = Number(value);
                        return `${minutes}min`;
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        weight: 500,
                    },
                },
            },
        },
    };

    if (sortedData.length === 0) {
        return (
            <div className="bar-chart-empty">
                <p>この期間のデータがありません</p>
            </div>
        );
    }

    return (
        <div className="bar-chart-container">
            <Bar data={chartData} options={options} />
        </div>
    );
}
