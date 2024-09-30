import { inject, injectable } from 'inversify';
import { IAddressRepository } from './address.repository.interface';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { Address } from '@prisma/client';
import { IAddress } from '../model/address.entity.interface';
import 'reflect-metadata';

@injectable()
export class AddressRepository implements IAddressRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(address: IAddress): Promise<IAddress> {
		return await this.prismaService.client.address.create({
			include: { student: true },
			data: {
				country: address.country,
				region: address.region,
				address: address.address,
				studentId: address.studentId,
			},
		});
	}

	async find(): Promise<Address[]> {
		return await this.prismaService.client.address.findMany({
			include: { student: true },
		});
	}

	async findById(id: number): Promise<Address | null> {
		return await this.prismaService.client.address.findFirst({
			include: { student: true },
			where: { id },
		});
	}
	async findByFilters(data: Partial<Address>): Promise<Address[] | []> {
		return await this.prismaService.client.address.findMany({
			include: { student: true },
			where: {
				...(data.address && { address: data.address }),
				...(data.country && { country: data.country }),
				...(data.region && { region: data.region }),
				...(data.studentId && { studentId: data.studentId }),
			},
		});
	}

	async update(id: number, address: Partial<Address>): Promise<Address> {
		return await this.prismaService.client.address.update({
			include: { student: true },
			where: { id },
			data: address,
		});
	}

	async delete(id: number): Promise<void> {
		await this.prismaService.client.address.delete({
			where: { id },
		});
	}
}
