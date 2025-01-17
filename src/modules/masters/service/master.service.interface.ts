import { Master, Address, Education, Bachelor, Faculty, Articles } from '@prisma/client';
import { MasterRegisterDto } from '../dto/master-register.dto';
import { IMasterEntity } from '../models/master.entity.interface';

export interface IMasterService {
	create: (master: MasterRegisterDto) => Promise<IMasterEntity | string | null>;
	getAll: () => Promise<Master[]>;
	update: (id: number, master: Partial<Master>) => Promise<any | string>;
	delete: (id: number) => Promise<void>;
	getByEmail: (email: string) => Promise<Master | null>;
	getByFilters: (data: Partial<Master>) => Promise<Master[] | []>;
	generateXlsxFile: (masters: Master[]) => Promise<string>;
}
