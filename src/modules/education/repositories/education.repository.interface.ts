import { Education } from '@prisma/client';
import { CreateEducationDto, UpdateEducationDto } from '../index';

export interface IEducationRepository {
	create: (data: CreateEducationDto) => Promise<Education | null>;
	delete: (id: number) => Promise<Education | null>;
	update: (id: number, data: UpdateEducationDto) => Promise<Education | null>;

	//gets
	findAll: () => Promise<Education[]>;
	findById: (id: number) => Promise<Education | null>;
	findByMasterId: (masterId: number) => Promise<Education | null>;
	findByFacultyId: (ids: number[]) => Promise<Education[] | []>;
	findByBachelorsId: (ids: number[]) => Promise<Education[] | []>;
	findByArticlesId: (ids: number[]) => Promise<Education[] | []>;
	findByValues: (data: Partial<Education>) => Promise<Education[] | []>;
}
