import { Faculty } from '@prisma/client';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { IFaculty } from '../models/faculty.entity.interface';

export interface IFacultyService {
	create: (params: FacultyCreateDto) => Promise<IFaculty | null>;
	find: () => Promise<Faculty[]>;
	update: (id: number, params: Faculty) => Promise<Faculty | null>;
	delete: (id: number) => Promise<Faculty | null>;
	findById: (id: number) => Promise<Faculty | null>;
	findByName: (params: { name: string }) => Promise<Faculty | null>;
}
