import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import type { Item, CreateItemInput, UpdateItemInput } from '../models/Item';

export function useItems() {
    const items = useLiveQuery(
        async () => {
            const all = await db.items.toArray();
            return all
                .filter((item) => !item.archived)
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        },
        []
    );

    const allItems = useLiveQuery(() => db.items.toArray(), []);

    const archivedItems = useLiveQuery(
        async () => {
            const all = await db.items.toArray();
            return all.filter((item) => item.archived);
        },
        []
    );

    const addItem = async (input: CreateItemInput): Promise<Item> => {
        const now = new Date().toISOString();
        const item: Item = {
            id: uuidv4(),
            name: input.name,
            color: input.color,
            sortOrder: input.sortOrder ?? (items?.length ?? 0),
            archived: false,
            createdAt: now,
            updatedAt: now,
        };
        await db.items.add(item);
        return item;
    };

    const updateItem = async (id: string, input: UpdateItemInput): Promise<void> => {
        const now = new Date().toISOString();
        await db.items.update(id, {
            ...input,
            updatedAt: now,
        });
    };

    const archiveItem = async (id: string): Promise<void> => {
        await updateItem(id, { archived: true });
    };

    const restoreItem = async (id: string): Promise<void> => {
        await updateItem(id, { archived: false });
    };

    const getItemById = (id: string): Item | undefined => {
        return allItems?.find((item) => item.id === id);
    };

    return {
        items: items ?? [],
        allItems: allItems ?? [],
        archivedItems: archivedItems ?? [],
        addItem,
        updateItem,
        archiveItem,
        restoreItem,
        getItemById,
    };
}
