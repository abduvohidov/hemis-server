import 'reflect-metadata';
import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { Bachelor, Master } from '@prisma/client';
import { IEducation } from '../../education/types';
import { IEducationRepository } from '../../education';
import { IBachelorService } from './bachelor.service.interface';
import { BachelorCreateDto } from '../dto/bacherlor-create.dto';
import { BachelorUpdateDto } from '../dto/bacherlor-update.dto';
import { BacherlorRepository } from '../repository/bachelor.repository';
import { IMasterRepository } from '../../masters';

@injectable()
export class BachelorService implements IBachelorService {
	constructor(
		@inject(TYPES.MasterRepository) private masterRepository: IMasterRepository,
		@inject(TYPES.BachelorRepository) private bachelorRepository: BacherlorRepository,
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
	) {}

	async create(params: BachelorCreateDto): Promise<Bachelor | string | null> {
		const education = await this.educationRepository.findByMasterId(params.masterId);
		if (!education) return 'Bunday magistrant topilmadi';
		const existed = await this.bachelorRepository.findByDiplomaNumber(params.diplomaNumber);
		if (existed) return 'Bunday diplom raqami avval kiritilgan';
		const finalData = {
			previousUniversity: params.previousUniversity,
			graduationYear: params.graduationYear,
			diplomaNumber: params.diplomaNumber,
			previousSpecialization: params.previousSpecialization,
		};
		const bachelor = await this.bachelorRepository.create(finalData);
		await this.educationRepository.update(education.id, { bachelorId: bachelor?.id });
		return bachelor;
	}

	async update(id: number, params: BachelorUpdateDto): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findById(id);
		if (!existed) {
			return null;
		}
		const data = {
			previousUniversity: params.previousUniversity,
			graduationYear: params.graduationYear,
			diplomaNumber: params.diplomaNumber,
			previousSpecialization: params.previousSpecialization,
		};
		return this.bachelorRepository.update(id, data);
	}

	async delete(id: number): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findById(id);
		if (!existed) {
			return null;
		}
		return this.bachelorRepository.delete(id);
	}

	//finds
	async find(): Promise<Bachelor[]> {
		return await this.bachelorRepository.find();
	}

	async findById(id: number): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findById(id);
		if (!existed) {
			return null;
		}
		return await this.bachelorRepository.findById(id);
	}

	async findByFilter(data: Partial<Bachelor>): Promise<Master[] | []> {
		const bachelorFilters = {
			...(data.previousUniversity && { previousUniversity: data.previousUniversity }),
			...(data.graduationYear && { graduationYear: data.graduationYear }),
			...(data.diplomaNumber && { diplomaNumber: data.diplomaNumber }),
			...(data.previousSpecialization && { previousSpecialization: data.previousSpecialization }),
		};

		const hasBachelorFilters = Object.keys(bachelorFilters).length > 0;
		if (!hasBachelorFilters) return [];

		const bachelors = await this.bachelorRepository.findByFilters(bachelorFilters);
		if (bachelors.length === 0) return [];

		const bachelorIds = bachelors.map((bachelor) => bachelor.id);
		const education = await this.educationRepository.findByArticlesId(bachelorIds);
		const educationMasterIds = education?.map((edu) => edu.masterId);
		const masters = await this.masterRepository.findByIds(educationMasterIds);

		return masters;
	}
}
