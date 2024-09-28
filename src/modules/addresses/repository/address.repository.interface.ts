import { Address } from '@prisma/client';
import { IAddress } from '../model/address.entity.interface';

export interface IAddressRepository {
	create: (address: IAddress) => Promise<IAddress>;
	findByCountry: (country: string) => Promise<Address[] | null>;
}
