import { Bachelor } from '@prisma/client';
import { BachelorCreateDto } from '../dto/bacherlor-create.dto';
import { BachelorUpdateDto } from '../dto/bacherlor-update.dto';

export interface IBachelorService {
	create: (params: BachelorCreateDto) => Promise<Bachelor | null>;
	update: (id: number, params: BachelorUpdateDto) => Promise<Bachelor | null>;
	delete: (id: number) => Promise<Bachelor | null>;

	//find
	find: () => Promise<Bachelor[]>;
	findById: (id: number) => Promise<Bachelor | null>;
	findByFilter: (data: Partial<Bachelor>) => Promise<Bachelor[] | []>;
}
