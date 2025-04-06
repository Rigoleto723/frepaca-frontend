interface Group {
    id: number;
    name: string;
}

export interface User {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    groups?: (Group | string)[];
    active?: boolean;
    status?: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
} 