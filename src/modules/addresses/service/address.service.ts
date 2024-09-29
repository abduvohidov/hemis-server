import { inject, injectable } from 'inversify';
import { IAddressService } from './address.service.interface';
import { TYPES } from '../../../types';
import { AddressRepository } from '../repository/address.repository';
import { Address } from '@prisma/client';
import { Address as AddressEntity } from '../model/address.entitiy';
import { AddressCreateDto } from '../dto/address-create.dto';
import { IAddress } from '../model/address.entity.interface';

@injectable()
export class AddressService implements IAddressService {
	constructor(@inject(TYPES.AddressRepository) private addressRepository: AddressRepository) {}

	async create(address: AddressCreateDto): Promise<IAddress | null> {
		const newAddress = new AddressEntity(
			address.country,
			address.region,
			address.address,
			address.studentId,
		);

		const existedAddress = await this.addressRepository.findByCountry(address.country);
		console.log(newAddress);
		if (existedAddress) {
			return null;
		}

		return this.addressRepository.create(newAddress);
	}
	async findByCountry(country: string): Promise<Address | null> {
		const existedCuntry = await this.addressRepository.findByCountry(country);

		if (!existedCuntry) {
			return null;
		}

		return this.addressRepository.findByCountry(country);
	}
}
