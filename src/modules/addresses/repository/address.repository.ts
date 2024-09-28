import { inject, injectable } from 'inversify';
import { IAddressRepository } from './address.repository.interface';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { Address } from '@prisma/client';

@injectable()
export class AddressRepository implements IAddressRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(address: Address): Promise<Address> {
		return await this.prismaService.client.address.create({
			data: {
				country: address.country,
				region: address.region,
				address: address.address,
				studentId: address.studentId,
			},
		});
	}

	async findByCountry(country: string): Promise<Address[] | null> {
		return await this.prismaService.client.address.findMany({
			include: { student: true },
			where: { country },
		});
	}
}
