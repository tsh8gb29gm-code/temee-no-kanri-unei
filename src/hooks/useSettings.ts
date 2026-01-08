import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { DEFAULT_SETTINGS } from '../models/Settings';

export function useSettings() {
    const settings = useLiveQuery(async () => {
        let s = await db.settings.get('default');
        if (!s) {
            const now = new Date().toISOString();
            s = { ...DEFAULT_SETTINGS, updatedAt: now };
            await db.settings.add(s);
        }
        return s;
    }, []);

    const updateSettings = async (weekStartsOn: 0 | 1): Promise<void> => {
        const now = new Date().toISOString();
        await db.settings.put({
            id: 'default',
            weekStartsOn,
            updatedAt: now,
        });
    };

    return {
        settings: settings ?? { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() },
        updateSettings,
    };
}
