import { TYPES } from '../../../types';
import { Address } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { StudentRepository } from './../../students';
import { AddressCreateDto } from '../dto/address-create.dto';
import { IAddress } from '../model/address.entity.interface';
import { IAddressService } from './address.service.interface';
import { Address as AddressEntity } from '../model/address.entitiy';
import { AddressRepository } from '../repository/address.repository';

@injectable()
export class AddressService implements IAddressService {
	constructor(
		@inject(TYPES.AddressRepository) private addressRepository: AddressRepository,
		@inject(TYPES.StudentRepository) private studentRepository: StudentRepository,
	) {}

	async create(address: AddressCreateDto): Promise<IAddress | null> {
		const newAddress = new AddressEntity(
			address.country,
			address.region,
			address.address,
			address.studentId,
		);

		const existedStudent = await this.studentRepository.findById(address.studentId);
		if (!existedStudent) {
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

	async findByFilters(data: Partial<Address>): Promise<Address[] | []> {
		if (Object.keys(data).length == 0) return [];

		return await this.addressRepository.findByFilters(data);
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
