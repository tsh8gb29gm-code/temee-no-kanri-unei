import Dexie, { type EntityTable } from 'dexie';
import type { Item } from '../models/Item';
import type { Session } from '../models/Session';
import type { Settings } from '../models/Settings';

const db = new Dexie('TemeeNoKanriUnei') as Dexie & {
    items: EntityTable<Item, 'id'>;
    sessions: EntityTable<Session, 'id'>;
    settings: EntityTable<Settings, 'id'>;
};

db.version(1).stores({
    items: 'id, name, sortOrder, createdAt',
    sessions: 'id, itemId, startAt, endAt, createdAt',
    settings: 'id',
});

export { db };
