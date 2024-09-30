import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { IStudentRepository } from './student.repository.interface';
import { Student } from '@prisma/client';
import 'reflect-metadata';
import { IStudentEntity } from '../models/student.entity.interface';

@injectable()
export class StudentRepository implements IStudentRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(student: IStudentEntity): Promise<IStudentEntity> {
		return await this.prismaService.client.student.create({
			data: {
				lastName: student.lastName,
				firstName: student.firstName,
				middleName: student.middleName,
				passportNumber: student.passportNumber,
				jshshr: student.jshshr,
				dateOfBirth: student.dateOfBirth,
				gender: student.gender,
				nationality: student.nationality,
				email: student.email,
				phoneNumber: student.phoneNumber,
				parentPhoneNumber: student.parentPhoneNumber,
				password: student.password,
			},
		});
	}

	async findById(id: number): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			where: { id },
			include: {
				addresses: true,
			},
		});
	}
	async findByEmail(email: string): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			include: {
				addresses: true,
			},
			where: { email },
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
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
		});
	}
	async findByFilters(data: Partial<Student>): Promise<Student[] | []> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: data,
		});
	}
}
