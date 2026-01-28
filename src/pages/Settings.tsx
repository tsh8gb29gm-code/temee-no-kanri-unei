import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useBackup } from '../hooks/useBackup';
import './Settings.css';

export function Settings() {
    const { settings, updateSettings } = useSettings();
    const { exportData, importData, requestPersistence, checkPersistence } = useBackup();
    const [isPersisted, setIsPersisted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        checkPersistence().then(setIsPersisted);
    }, []);

    const handleWeekStartChange = (value: 0 | 1) => {
        updateSettings(value);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            importData(file);
        }
    };

    return (
        <div className="settings-page">
            <h2 className="page-title">設定</h2>

            <div className="settings-section">
                <h3 className="section-title">一般設定</h3>
                <div className="setting-item">
                    <div className="setting-info">
                        <h4 className="setting-label">週の開始曜日</h4>
                        <p className="setting-description">
                            週単位の集計で使用される曜日を設定します。
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
                <h3 className="section-title">データ管理</h3>
                <div className="setting-item vertical">
                    <div className="setting-info">
                        <h4 className="setting-label">ストレージの永続化</h4>
                        <p className="setting-description">
                            ブラウザによるデータの自動削除を防ぐようリクエストします。<br />
                            現在の状態: <strong>{isPersisted ? '✅ 永続化済み' : '⚠️ 一時的 なストレージ'}</strong>
                        </p>
                    </div>
                    {!isPersisted && (
                        <button className="settings-button secondary" onClick={requestPersistence}>
                            永続化をリクエスト
                        </button>
                    )}
                </div>

                <div className="setting-item vertical">
                    <div className="setting-info">
                        <h4 className="setting-label">バックアップと復元</h4>
                        <p className="setting-description">
                            データをファイルに保存したり、過去のバックアップから復元します。
                        </p>
                    </div>
                    <div className="button-group">
                        <button className="settings-button" onClick={exportData}>
                            データをファイルに保存
                        </button>
                        <button className="settings-button secondary" onClick={handleImportClick}>
                            ファイルから復元
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="settings-section">
                <h3 className="section-title">アプリについて</h3>
                <div className="about-info">
                    <p><strong>てめえの管理運営</strong> v1.1.0</p>
                    <p>作業時間集計ツール</p>
                    <p className="note">OSのホーム画面に追加して使うと、より安定してデータを保存できます。</p>
                </div>
            </div>
        </div>
    );
}
