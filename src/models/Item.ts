export interface Item {
    id: string;
    name: string;
    color?: string;
    sortOrder?: number;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateItemInput {
    name: string;
    color?: string;
    sortOrder?: number;
}

export interface UpdateItemInput {
    name?: string;
    color?: string;
    sortOrder?: number;
    archived?: boolean;
}
