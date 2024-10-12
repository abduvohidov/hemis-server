import xlsx from 'xlsx';
import path from 'path';
import { TYPES } from '../../../types';
import { Master } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config';
import { IMasterService } from './master.service.interface';
import { MasterRegisterDto } from '../dto/master-register.dto';
import { IMasterEntity } from '../models/master.entity.interface';
import { Master as MasterEntity, IMasterRepository } from '../index';

@injectable()
export class MasterService implements IMasterService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MasterRepository) private masterRepository: IMasterRepository,
	) {}

	async create(master: MasterRegisterDto): Promise<IMasterEntity | null> {
		const newmaster = new MasterEntity(
			master.lastName,
			master.firstName,
			master.middleName,
			master.passportNumber,
			master.jshshr,
			master.dateOfBirth,
			master.gender,
			master.nationality,
			master.email,
			master.phoneNumber,
			master.parentPhoneNumber,
			master.password,
		);
		const salt = this.configService.get('SALT');
		await newmaster.setPassword(master.password, Number(salt));
		const existedmaster = await this.masterRepository.findByEmail(master.email);
		if (existedmaster) {
			return null;
		}
		return this.masterRepository.create(newmaster);
	}

	async getAll(): Promise<Master[]> {
		return this.masterRepository.findAll();
	}
	async update(id: number, master: Partial<Master>): Promise<Master> {
		const existingmaster = await this.masterRepository.findById(id);
		if (!existingmaster) {
			throw new Error(`Студент с идентификатором ${id} не найден.`);
		}

		// Check if the password is included in the update data
		if (master.password) {
			// Only hash and update the password if it was provided
			const updatedmasterEntity = new MasterEntity(
				existingmaster.lastName,
				existingmaster.firstName,
				existingmaster.middleName,
				existingmaster.passportNumber,
				existingmaster.jshshr,
				existingmaster.dateOfBirth,
				existingmaster.gender,
				existingmaster.nationality,
				existingmaster.email,
				existingmaster.phoneNumber,
				existingmaster.parentPhoneNumber,
				master.password, // Use the updated password
			);

			const salt = this.configService.get('SALT');
			await updatedmasterEntity.setPassword(master.password, Number(salt));

			// Replace the plaintext password with the hashed one
			master.password = updatedmasterEntity.password;
		}

		return this.masterRepository.update(id, master);
	}

	async delete(id: number): Promise<void> {
		try {
			const existingmaster = await this.masterRepository.findById(id);

			if (!existingmaster) {
				throw new Error(`Студент с идентификатором ${id} не найден.`);
			}
			await this.masterRepository.delete(id);
		} catch (error) {
			console.error(`Ошибка при удалении студента с идентификатором ${id}:`, error);
			throw error;
		}
	}

	async getByEmail(email: string): Promise<Master | null> {
		return this.masterRepository.findByEmail(email);
	}

	async getById(id: number): Promise<Master | null> {
		return this.masterRepository.findById(id);
	}

	async getByFilters(data: Partial<Master>): Promise<Master[] | []> {
		const birthDate = new Date(`${data?.dateOfBirth}T00:00:00.000Z`);
		const masterFilters = {
			...(data.lastName && { lastName: data.lastName }),
			...(data.firstName && { firstName: data.firstName }),
			...(data.middleName && { middleName: data.middleName }),
			...(data.passportNumber && { passportNumber: data.passportNumber }),
			...(data.jshshr && { jshshr: data.jshshr }),
			...(data.dateOfBirth && { dateOfBirth: birthDate }),
			...(data.gender && { gender: data.gender }),
			...(data.nationality && { nationality: data.nationality }),
			...(data.email && { email: data.email }),
			...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
			...(data.parentPhoneNumber && { parentPhoneNumber: data.parentPhoneNumber }),
			...(data.password && { password: data.password }),
		};
		const hasmasterFilters = Object.keys(masterFilters).length > 0;
		if (!hasmasterFilters) {
			return [];
		}
		return this.masterRepository.findByFilters(masterFilters);
	}

	async generateXlsxFile(data: Master[]): Promise<string> {
		const workbook = xlsx.utils.book_new();
		const worksheet = xlsx.utils.json_to_sheet(data);
		xlsx.utils.book_append_sheet(workbook, worksheet, 'masters_data');
		const filePath = path.join(__dirname, '../data.xlsx');
		xlsx.writeFile(workbook, filePath);

		return filePath;
	}
}
