import { Address } from '@prisma/client';
import { AddressCreateDto, IAddress } from '../index';

export interface IAddressService {
	create: (address: AddressCreateDto) => Promise<IAddress | null>;
	findByCountry: (country: string) => Promise<Address | null>;
}
