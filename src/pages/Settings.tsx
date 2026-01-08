import { useSettings } from '../hooks/useSettings';
import './Settings.css';

export function Settings() {
    const { settings, updateSettings } = useSettings();

    const handleWeekStartChange = (value: 0 | 1) => {
        updateSettings(value);
    };

    return (
        <div className="settings-page">
            <h2 className="page-title">設定</h2>

            <div className="settings-section">
                <div className="setting-item">
                    <div className="setting-info">
                        <h3 className="setting-label">週の開始曜日</h3>
                        <p className="setting-description">
                            週単位の集計で使用される週の開始曜日を設定します。
                        </p>
                    </div>
                    <div className="setting-control">
                        <label className={`radio-option ${settings.weekStartsOn === 1 ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="weekStart"
                                checked={settings.weekStartsOn === 1}
                                onChange={() => handleWeekStartChange(1)}
                            />
                            <span>月曜日</span>
                        </label>
                        <label className={`radio-option ${settings.weekStartsOn === 0 ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="weekStart"
                                checked={settings.weekStartsOn === 0}
                                onChange={() => handleWeekStartChange(0)}
                            />
                            <span>日曜日</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3 className="section-title">アプリについて</h3>
                <div className="about-info">
                    <p><strong>てめえの管理運営</strong> v1.0.0</p>
                    <p>作業時間集計ツール</p>
                    <p className="note">データは端末内に保存されます。</p>
                </div>
            </div>
        </div>
    );
}
