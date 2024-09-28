import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { IStudentRepository } from './student.repository.interface';
import { IStudentEntity } from '../models/student.entity.interface';
import { Student } from '../models/student.entity';
import 'reflect-metadata';

@injectable()
export class StudentRepository implements IStudentRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(student: Student): Promise<IStudentEntity> {
		return await this.prismaService.client.student.create({
			data: student,
		});
	}

	async findByEmail(email: string): Promise<IStudentEntity | null> {
		return await this.prismaService.client.student.findUnique({
			where: { email },
		});
	}

	async findById(id: number): Promise<IStudentEntity | null> {
		return await this.prismaService.client.student.findUnique({
			where: { id },
		});
	}

	async update(id: number, IStudentEntity: Partial<IStudentEntity>): Promise<IStudentEntity> {
		return await this.prismaService.client.student.update({
			where: { id },
			data: IStudentEntity,
		});
	}

	async delete(id: number): Promise<void> {
		await this.prismaService.client.student.delete({
			where: { id },
		});
	}

	async findAll(): Promise<IStudentEntity[]> {
		return await this.prismaService.client.student.findMany();
	}

	async findByLastName(lastName: string): Promise<IStudentEntity[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { lastName },
		});
	}

	async findByFirstName(firstName: string): Promise<IStudentEntity[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { firstName },
		});
	}

	async findByNationality(nationality: string): Promise<IStudentEntity[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { nationality },
		});
	}

	async findByGender(gender: string): Promise<IStudentEntity[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { gender },
		});
	}

	async findByPhoneNumber(phoneNumber: string): Promise<IStudentEntity[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { phoneNumber },
		});
	}

	async findByParentPhoneNumber(parentPhoneNumber: string): Promise<IStudentEntity[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { parentPhoneNumber },
		});
	}
	async findByPassportNumber(passportNumber: string): Promise<IStudentEntity | null> {
		return await this.prismaService.client.student.findUnique({
			where: { passportNumber },
		});
	}

	async findByJshshr(jshshr: string): Promise<IStudentEntity | null> {
		return await this.prismaService.client.student.findUnique({
			where: { jshshr },
		});
	}
}
