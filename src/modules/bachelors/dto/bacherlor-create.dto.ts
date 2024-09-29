import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class BachelorCreateDto {
	@IsNotEmpty()
	@IsString()
	readonly previousUniversity: string;

	@IsNotEmpty()
	@IsString()
	readonly graduationYear: string;

	@IsNotEmpty()
	@IsString()
	readonly diplomaNumber: string;

	@IsNotEmpty()
	@IsString()
	readonly previousSpecialization: string;

	@IsNotEmpty()
	@IsArray()
	@IsNumber()
	readonly educationIds: number[];
}
