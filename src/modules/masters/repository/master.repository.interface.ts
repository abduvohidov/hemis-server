import { Master } from '@prisma/client';
import { IMasterEntity } from '../models/master.entity.interface';

export interface IMasterRepository {
	create: ({
		firstName,
		lastName,
		middleName,
		passportNumber,
		jshshr,
		dateOfBirth,
		gender,
		nationality,
		email,
		phoneNumber,
		parentPhoneNumber,
		avatarUrl,
		password,
	}: IMasterEntity) => Promise<IMasterEntity>;
	findAll: () => Promise<Master[]>;
	update: (id: number, master: Partial<Master>) => Promise<any>;
	delete: (id: number) => Promise<void>;
	findById: (id: number) => Promise<Master | null>;
	findByEmail: (email: string) => Promise<Master | null>;
	findByFilters: (data: Partial<Master>) => Promise<Master[] | []>;
	findByIds: (ids: number[]) => Promise<Master[] | []>;
}
