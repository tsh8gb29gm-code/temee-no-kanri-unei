import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { db } from '../db/database';
import { DEFAULT_SETTINGS } from '../models/Settings';

export function useSettings() {
    const settings = useLiveQuery(() => db.settings.get('default'), []);

    // Initialize default settings if not exists
    useEffect(() => {
        const initSettings = async () => {
            const count = await db.settings.count();
            if (count === 0) {
                const now = new Date().toISOString();
                await db.settings.add({ ...DEFAULT_SETTINGS, updatedAt: now });
            }
        };
        initSettings();
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
