import { Address } from '@prisma/client';
import { IAddress } from '../model/address.entity.interface';

export interface IAddressRepository {
	create: ({ country, region, address, studentId }: IAddress) => Promise<IAddress>;
	find: () => Promise<IAddress[]>;
	findById: (id: number) => Promise<Address | null>;
	findByCountry: (country: string) => Promise<Address | null>;
	findByRegion: (region: string) => Promise<Address | null>;
	findByAddress: (address: string) => Promise<Address | null>;
	update: (id: number, address: Partial<Address>) => Promise<Address>;
	delete: (id: number) => Promise<void>;
}
