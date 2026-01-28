import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import type { Session, CreateSessionInput, UpdateSessionInput } from '../models/Session';

export function useSessions() {
    const sessions = useLiveQuery(
        () => db.sessions.orderBy('startAt').reverse().toArray(),
        []
    );

    const runningSession = useLiveQuery(
        () => db.sessions.filter((s) => s.endAt === null).first(),
        []
    );

    const addSession = async (input: CreateSessionInput): Promise<Session> => {
        const now = new Date().toISOString();
        const session: Session = {
            id: uuidv4(),
            itemId: input.itemId,
            startAt: input.startAt ?? now,
            endAt: input.endAt ?? null,
            createdAt: now,
            updatedAt: now,
            note: input.note,
        };
        await db.sessions.add(session);
        return session;
    };

    const updateSession = async (id: string, input: UpdateSessionInput): Promise<void> => {
        const now = new Date().toISOString();
        await db.sessions.update(id, {
            ...input,
            updatedAt: now,
        });
    };

    const endSession = async (id: string): Promise<void> => {
        const now = new Date().toISOString();
        await db.sessions.update(id, {
            endAt: now,
            updatedAt: now,
        });
    };

    const deleteSession = async (id: string): Promise<void> => {
        await db.sessions.delete(id);
    };

    const getSessionsByDateRange = async (
        startDate: Date,
        endDate: Date
    ): Promise<Session[]> => {
        return db.sessions
            .where('startAt')
            .between(startDate.toISOString(), endDate.toISOString(), true, true)
            .toArray();
    };

    const deleteSessionsByItemId = async (itemId: string): Promise<void> => {
        await db.sessions.where('itemId').equals(itemId).delete();
    };

    return {
        sessions: sessions ?? [],
        runningSession: runningSession ?? null,
        addSession,
        updateSession,
        endSession,
        deleteSession,
        deleteSessionsByItemId,
        getSessionsByDateRange,
    };
}
