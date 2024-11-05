import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

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

	@IsNumber()
	@IsOptional()
	readonly masterId: number;
}
