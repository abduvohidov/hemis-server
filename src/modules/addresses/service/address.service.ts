import { TYPES } from '../../../types';
import { Address, Master } from '@prisma/client';
import { MasterRepository } from '../../masters';
import { inject, injectable } from 'inversify';
import { AddressCreateDto } from '../dto/address-create.dto';
import { IAddress } from '../model/address.entity.interface';
import { IAddressService } from './address.service.interface';
import { Address as AddressEntity } from '../model/address.entitiy';
import { AddressRepository } from '../repository/address.repository';

@injectable()
export class AddressService implements IAddressService {
	constructor(
		@inject(TYPES.AddressRepository) private addressRepository: AddressRepository,
		@inject(TYPES.MasterRepository) private masterRepository: MasterRepository,
	) {}

	async create(address: AddressCreateDto): Promise<IAddress | null> {
		const newAddress = new AddressEntity(
			address.country,
			address.region,
			address.address,
			address.masterId,
		);

		const existedMaster = await this.masterRepository.findById(address.masterId);
		if (!existedMaster) {
			return null;
		}

		return await this.addressRepository.create(newAddress);
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

	async findByFilters(data: Partial<Address>): Promise<Master[] | []> {
		const addressFilters = {
			...(data.address && { address: data.address }),
			...(data.country && { country: data.country }),
			...(data.region && { region: data.region }),
			...(data.masterId && { masterId: data.masterId }),
		};

		const hasAddressFilters = Object.keys(addressFilters).length > 0;
		if (!hasAddressFilters) {
			return [];
		}
		const address = await this.addressRepository.findByFilters(addressFilters);
		const addressMasterIds = address.map((add) => add.masterId);
		return await this.masterRepository.findByIds(addressMasterIds);
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
