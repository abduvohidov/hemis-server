import { Bachelor } from '@prisma/client';
import { BachelorCreateDto } from '../dto/bacherlor-create.dto';
import { BachelorUpdateDto } from '../dto/bacherlor-update.dto';

export interface IBachelorRepository {
	create: (params: BachelorCreateDto) => Promise<Bachelor | null>;
	update: (id: number, params: BachelorUpdateDto) => Promise<Bachelor | null>;
	delete: (id: number) => Promise<Bachelor | null>;

	//find
	find: () => Promise<Bachelor[]>;
	findById: (id: number) => Promise<Bachelor | null>;
	findByPreviousUniversity: (previousUniversity: string) => Promise<Bachelor[] | null>;
	findGraduationYear: (graduationYear: string) => Promise<Bachelor[] | null>;
	findDiplomaNumber: (diplomaNumber: string) => Promise<Bachelor | null>;
	findPreviousSpecialization: (previousSpecialization: string) => Promise<Bachelor | null>;
}
