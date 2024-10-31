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
			include: { master: true },
			data: {
				country: address.country,
				region: address.region,
				address: address.address,
				masterId: Number(address.masterId),
			},
		});
	}

	async find(): Promise<Address[]> {
		return await this.prismaService.client.address.findMany({
			include: { master: true },
		});
	}

	async findById(id: number): Promise<Address | null> {
		return await this.prismaService.client.address.findFirst({
			include: { master: true },
			where: { id },
		});
	}
	async findByFilters(data: Partial<Address>): Promise<Address[] | []> {
		return await this.prismaService.client.address.findMany({
			include: { master: true },
			where: data,
		});
	}

	async update(id: number, address: Partial<Address>): Promise<Address> {
		return await this.prismaService.client.address.update({
			include: { master: true },
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
