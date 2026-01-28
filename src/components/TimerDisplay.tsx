import { useState, useEffect } from 'react';
import { formatDurationWithSeconds } from '../hooks/useAggregation';
import './TimerDisplay.css';

interface TimerDisplayProps {
    itemName: string;
    startAt: string;
    onStop: () => void;
}

export function TimerDisplay({ itemName, startAt, onStop }: TimerDisplayProps) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const startTime = new Date(startAt).getTime();

        const updateElapsed = () => {
            const now = Date.now();
            setElapsed(Math.floor((now - startTime) / 1000));
        };

        updateElapsed();
        const interval = setInterval(updateElapsed, 1000);

        return () => clearInterval(interval);
    }, [startAt]);

    const startTimeFormatted = new Date(startAt).toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="timer-display">
            <div className="timer-status">
                <span className="timer-pulse"></span>
                <span className="timer-label">計測中</span>
            </div>
            <div className="timer-info">
                <span className="timer-item-name">{itemName}</span>
                <div className="timer-details">
                    <span className="timer-start">開始: {startTimeFormatted}</span>
                </div>
                <div className="timer-elapsed-large">
                    {formatDurationWithSeconds(elapsed)}
                </div>
            </div>
            <button className="timer-stop-button" onClick={onStop}>
                作業を終了する
            </button>
        </div>
    );
}
