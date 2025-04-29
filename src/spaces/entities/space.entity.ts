export interface Space {
    id: number;
    name: string;
    description?: string;
    capacity: number;
    createdAt: Date;
    updatedAt?: Date;
}
    