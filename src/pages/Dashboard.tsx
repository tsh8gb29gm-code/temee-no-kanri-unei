import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useSessions } from '../hooks/useSessions';
import { useSettings } from '../hooks/useSettings';
import { useTimer } from '../hooks/useTimer';
import { useAggregation, formatDuration, type PeriodType } from '../hooks/useAggregation';
import { PeriodSelector } from '../components/PeriodSelector';
import { KPICard } from '../components/KPICard';
import { BarChart } from '../components/BarChart';
import { TimerDisplay } from '../components/TimerDisplay';
import { ItemButton } from '../components/ItemButton';
import { ConfirmDialog } from '../components/ConfirmDialog';
import './Dashboard.css';

export function Dashboard() {
    const { items, allItems, getItemById } = useItems();
    const { sessions, endSession } = useSessions();
    const { settings } = useSettings();
    const {
        runningSession,
        handleItemClick,
        showSwitchDialog,
        switchDialogData,
        confirmSwitch,
        cancelSwitch,
    } = useTimer();

    const [periodType, setPeriodType] = useState<PeriodType>('day');
    const [referenceDate, setReferenceDate] = useState(new Date());

    const aggregation = useAggregation(
        sessions,
        periodType,
        referenceDate,
        settings.weekStartsOn
    );

    const chartData = Array.from(aggregation.byItemSeconds.entries()).map(
        ([itemId, seconds]) => ({ itemId, seconds })
    );

    const topItemName = aggregation.topItemId
        ? getItemById(aggregation.topItemId)?.name ?? '-'
        : '-';

    const currentItemName = switchDialogData
        ? getItemById(switchDialogData.currentItemId)?.name ?? ''
        : '';
    const newItemName = switchDialogData
        ? getItemById(switchDialogData.newItemId)?.name ?? ''
        : '';

    const handleStopTimer = () => {
        if (runningSession) {
            endSession(runningSession.id);
        }
    };

    return (
        <div className="dashboard">
            <PeriodSelector
                periodType={periodType}
                referenceDate={referenceDate}
                onPeriodTypeChange={setPeriodType}
                onReferenceDateChange={setReferenceDate}
            />

            <div className="kpi-grid">
                <KPICard
                    label="合計時間"
                    value={formatDuration(aggregation.totalSeconds)}
                    icon="⏱️"
                />
                <KPICard
                    label="セッション数"
                    value={aggregation.sessionCount.toString()}
                    icon="📊"
                />
                <KPICard
                    label="最多アイテム"
                    value={topItemName}
                    icon="🏆"
                />
            </div>

            <BarChart data={chartData} items={allItems} />

            {runningSession && (
                <TimerDisplay
                    itemName={getItemById(runningSession.itemId)?.name ?? '不明'}
                    startAt={runningSession.startAt}
                    onStop={handleStopTimer}
                />
            )}

            <section className="item-buttons-section">
                <h2 className="section-title">アイテム</h2>
                {items.length === 0 ? (
                    <p className="empty-message">
                        アイテムがありません。「アイテム」タブから追加してください。
                    </p>
                ) : (
                    <div className="item-buttons-grid">
                        {items.map((item) => (
                            <ItemButton
                                key={item.id}
                                name={item.name}
                                color={item.color}
                                isActive={runningSession?.itemId === item.id}
                                onClick={() => handleItemClick(item.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <ConfirmDialog
                isOpen={showSwitchDialog}
                title="作業を切り替える？"
                message={`現在「${currentItemName}」が進行中です。「${newItemName}」に切り替えますか？`}
                confirmLabel={`${currentItemName}を終了して${newItemName}を開始`}
                cancelLabel="キャンセル"
                onConfirm={confirmSwitch}
                onCancel={cancelSwitch}
            />
        </div>
    );
}
