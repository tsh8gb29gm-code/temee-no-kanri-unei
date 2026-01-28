import { db } from '../db/database';

export function useBackup() {
    const exportData = async () => {
        const items = await db.items.toArray();
        const sessions = await db.sessions.toArray();
        const settings = await db.settings.toArray();

        const data = {
            items,
            sessions,
            settings,
            exportedAt: new Date().toISOString(),
            version: 1,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `temee-no-kanri-backup-${new Date()
            .toISOString()
            .slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importData = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);

                if (!data.items || !data.sessions) {
                    throw new Error('無効なバックアップファイルです。');
                }

                if (!confirm('既存のデータが上書き（追加）されます。よろしいですか？')) {
                    return;
                }

                // Simple merge for items and sessions
                for (const item of data.items) {
                    await db.items.put(item);
                }
                for (const session of data.sessions) {
                    await db.sessions.put(session);
                }
                if (data.settings) {
                    for (const setting of data.settings) {
                        await db.settings.put(setting);
                    }
                }

                alert('データの復元が完了しました。');
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert('エラー: バックアップの読み込みに失敗しました。');
            }
        };
        reader.readAsText(file);
    };

    const requestPersistence = async () => {
        if (navigator.storage && navigator.storage.persist) {
            const isPersisted = await navigator.storage.persist();
            if (isPersisted) {
                alert('永続ストレージが承認されました。ブラウザによってデータが削除されにくくなります。');
            } else {
                alert('永続ストレージの承認が得られませんでした。PWAとしてインストールすると承認されやすくなる場合があります。');
            }
        } else {
            alert('お使いのブラウザは永続ストレージに対応していません。');
        }
    };

    const checkPersistence = async () => {
        if (navigator.storage && navigator.storage.persisted) {
            return await navigator.storage.persisted();
        }
        return false;
    };

    return { exportData, importData, requestPersistence, checkPersistence };
}
