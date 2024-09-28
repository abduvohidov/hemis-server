import { Address } from '@prisma/client';

export interface IAddressRepository {
	create: (address: Address) => Promise<Address>;
	findByCountry: (country: string) => Promise<Address[] | null>;
}
