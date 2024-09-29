import { Address } from '@prisma/client';
import { AddressCreateDto, IAddress } from '../index';

export interface IAddressService {
	create: (address: AddressCreateDto) => Promise<IAddress | null>;
	find: () => Promise<Address[]>;
	update: (id: number, address: Partial<Address>) => Promise<Address | null>;
	delete: (id: number) => Promise<void | null>;
	findById: (id: number) => Promise<Address | null>;
	findByCountry: (country: string) => Promise<Address | null>;
	findByRegion: (region: string) => Promise<Address | null>;
	findByAddress: (address: string) => Promise<Address | null>;
}
