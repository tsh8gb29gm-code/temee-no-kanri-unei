export interface Session {
    id: string;
    itemId: string;
    startAt: string;
    endAt: string | null;
    createdAt: string;
    updatedAt: string;
    note?: string;
}

export interface CreateSessionInput {
    itemId: string;
    startAt?: string;
    endAt?: string | null;
    note?: string;
}

export interface UpdateSessionInput {
    itemId?: string;
    startAt?: string;
    endAt?: string | null;
    note?: string;
}
