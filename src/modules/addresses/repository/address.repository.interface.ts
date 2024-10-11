import { Address } from '@prisma/client';
import { IAddress } from '../model/address.entity.interface';

export interface IAddressRepository {
	create: ({ country, region, address, masterId }: IAddress) => Promise<IAddress>;
	find: () => Promise<IAddress[]>;
	findById: (id: number) => Promise<Address | null>;
	findByFilters: (data: Partial<Address>) => Promise<Address[] | []>;
	update: (id: number, address: Partial<Address>) => Promise<Address>;
	delete: (id: number) => Promise<void>;
}
