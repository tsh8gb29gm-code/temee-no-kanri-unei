import { format, addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { PeriodType } from '../hooks/useAggregation';
import './PeriodSelector.css';

interface PeriodSelectorProps {
    periodType: PeriodType;
    referenceDate: Date;
    onPeriodTypeChange: (type: PeriodType) => void;
    onReferenceDateChange: (date: Date) => void;
}

const periodLabels: Record<PeriodType, string> = {
    day: '日',
    week: '週',
    month: '月',
    year: '年',
    all: '全期間',
};

export function PeriodSelector({
    periodType,
    referenceDate,
    onPeriodTypeChange,
    onReferenceDateChange,
}: PeriodSelectorProps) {
    const formatDateLabel = (): string => {
        switch (periodType) {
            case 'day':
                return format(referenceDate, 'yyyy年M月d日(E)', { locale: ja });
            case 'week':
                return format(referenceDate, 'yyyy年M月d日週', { locale: ja });
            case 'month':
                return format(referenceDate, 'yyyy年M月', { locale: ja });
            case 'year':
                return format(referenceDate, 'yyyy年', { locale: ja });
            case 'all':
                return '全期間';
        }
    };

    const goToPrevious = () => {
        switch (periodType) {
            case 'day':
                onReferenceDateChange(subDays(referenceDate, 1));
                break;
            case 'week':
                onReferenceDateChange(subWeeks(referenceDate, 1));
                break;
            case 'month':
                onReferenceDateChange(subMonths(referenceDate, 1));
                break;
            case 'year':
                onReferenceDateChange(subYears(referenceDate, 1));
                break;
        }
    };

    const goToNext = () => {
        switch (periodType) {
            case 'day':
                onReferenceDateChange(addDays(referenceDate, 1));
                break;
            case 'week':
                onReferenceDateChange(addWeeks(referenceDate, 1));
                break;
            case 'month':
                onReferenceDateChange(addMonths(referenceDate, 1));
                break;
            case 'year':
                onReferenceDateChange(addYears(referenceDate, 1));
                break;
        }
    };

    const goToToday = () => {
        onReferenceDateChange(new Date());
    };

    return (
        <div className="period-selector">
            <div className="period-tabs">
                {(Object.keys(periodLabels) as PeriodType[]).map((type) => (
                    <button
                        key={type}
                        className={`period-tab ${periodType === type ? 'active' : ''}`}
                        onClick={() => onPeriodTypeChange(type)}
                    >
                        {periodLabels[type]}
                    </button>
                ))}
            </div>

            {periodType !== 'all' && (
                <div className="period-navigation">
                    <button className="nav-button" onClick={goToPrevious} aria-label="前へ">
                        ◀
                    </button>
                    <span className="period-label">{formatDateLabel()}</span>
                    <button className="nav-button" onClick={goToNext} aria-label="次へ">
                        ▶
                    </button>
                    <button className="today-button" onClick={goToToday}>
                        今日
                    </button>
                </div>
            )}
        </div>
    );
}
