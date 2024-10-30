import { Faculty, Master } from '@prisma/client';
import { FacultyCreateDto } from '../dto/faculty-create.dto';

export interface IFacultyService {
	createOrFind: (name: string) => Promise<Faculty>;
	find: () => Promise<Faculty[]>;
	update: (id: number, params: Faculty) => Promise<Faculty | null>;
	delete: (id: number) => Promise<Faculty | null>;
	findById: (id: number) => Promise<Faculty | null>;
	findByName: (name: string) => Promise<Faculty | null>;
	filterByName: (name: string) => Promise<Master[] | []>;
}
