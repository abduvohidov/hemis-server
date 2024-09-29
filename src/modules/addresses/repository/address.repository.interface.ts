import { Address } from '@prisma/client';
import { IAddress } from '../model/address.entity.interface';

export interface IAddressRepository {
	create: ({ country, region, address, studentId }: IAddress) => Promise<IAddress>;
	findByCountry: (country: string) => Promise<Address | null>;
}
