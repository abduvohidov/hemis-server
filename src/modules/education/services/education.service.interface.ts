import { Education } from '@prisma/client';
import { CreateEducationDto, UpdateEducationDto } from '../index';

export interface IEducationService {
	prepareEducation: (data: CreateEducationDto) => Promise<Education | null>;
	removeEducation: (id: number) => Promise<Education | null>;
	changeEducation: (id: number, data: UpdateEducationDto) => Promise<Education | null>;

	//gets
	getAll: () => Promise<Education[]>;
	getById: (id: number) => Promise<Education | null>;
	getByFilters: (filters: Partial<Education>) => Promise<Education[] | []>;
}
