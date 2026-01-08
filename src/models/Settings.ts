export interface Settings {
    id: string;
    weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
    updatedAt: string;
}

export const DEFAULT_SETTINGS: Omit<Settings, 'updatedAt'> = {
    id: 'default',
    weekStartsOn: 1, // Monday
};
