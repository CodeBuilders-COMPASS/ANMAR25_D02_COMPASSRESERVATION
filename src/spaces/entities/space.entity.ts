export interface Space {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt?: Date;
}
