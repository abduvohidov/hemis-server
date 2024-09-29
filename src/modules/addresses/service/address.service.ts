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
		if (existedAddress) {
			return null;
		}

		return this.addressRepository.create(newAddress);
	}

	async find(): Promise<Address[]> {
		return this.addressRepository.find();
	}

	async findById(id: number): Promise<Address | null> {
		const existed = await this.addressRepository.findById(id);

		if (!existed) {
			return null;
		}

		return this.addressRepository.findById(id);
	}

	async findByCountry(country: string): Promise<Address | null> {
		const existedCuntry = await this.addressRepository.findByCountry(country);

		if (!existedCuntry) {
			return null;
		}

		return this.addressRepository.findByCountry(country);
	}

	async findByRegion(region: string): Promise<Address | null> {
		const existedRegion = await this.addressRepository.findByRegion(region);

		if (!existedRegion) {
			return null;
		}

		return this.addressRepository.findByRegion(region);
	}

	async findByAddress(address: string): Promise<Address | null> {
		const existedAddress = await this.addressRepository.findByAddress(address);

		if (!existedAddress) {
			return null;
		}

		return this.addressRepository.findByAddress(address);
	}

	async update(id: number, address: Partial<Address>): Promise<Address | null> {
		const existingAddress = await this.addressRepository.findById(id);
		if (!existingAddress) {
			return null;
		}
		return this.addressRepository.update(id, address);
	}

	async delete(id: number): Promise<void | null> {
		const existingAddress = await this.addressRepository.findById(id);
		if (!existingAddress) {
			return null;
		}
		await this.addressRepository.delete(id);
	}
}
