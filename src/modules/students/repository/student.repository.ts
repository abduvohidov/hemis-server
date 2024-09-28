import { Student } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IStudentRepository } from './student.repository.interface';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import 'reflect-metadata';

@injectable()
export class StudentRepository implements IStudentRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(student: Student): Promise<Student> {
		return await this.prismaService.client.student.create({
			data: student,
		});
	}

	async findByEmail(email: string): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			where: { email },
		});
	}

	async findById(id: number): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			where: { id },
		});
	}

	async update(id: number, student: Partial<Student>): Promise<Student> {
		return await this.prismaService.client.student.update({
			where: { id },
			data: student,
		});
	}

	async delete(id: number): Promise<void> {
		await this.prismaService.client.student.delete({
			where: { id },
		});
	}

	async findAll(): Promise<Student[]> {
		return await this.prismaService.client.student.findMany();
	}

	async findByLastName(lastName: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { lastName },
		});
	}

	async findByFirstName(firstName: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { firstName },
		});
	}

	async findByNationality(nationality: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { nationality },
		});
	}

	async findByGender(gender: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { gender },
		});
	}

	async findByPhoneNumber(phoneNumber: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { phoneNumber },
		});
	}

	async findByParentPhoneNumber(parentPhoneNumber: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			where: { parentPhoneNumber },
		});
	}
	async findByPassportNumber(passportNumber: string): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			where: { passportNumber },
		});
	}

	async findByJshshr(jshshr: string): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			where: { jshshr },
		});
	}
}
