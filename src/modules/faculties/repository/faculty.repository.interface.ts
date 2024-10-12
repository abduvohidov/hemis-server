import { Faculty } from '@prisma/client';
import { IFaculty } from '../models/faculty.entity.interface';

export interface IFacultyRepository {
	create: (params: IFaculty) => Promise<IFaculty>;
	find: () => Promise<Faculty[]>;
	findById: (id: number) => Promise<Faculty | null>;
	findByName: (name: string) => Promise<Faculty | null>;
	update: (id: number, params: Faculty) => Promise<Faculty | null>;
	delete: (id: number) => Promise<Faculty>;
}
