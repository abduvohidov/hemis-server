import { IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateEducationDto {
	@IsInt()
	@IsOptional()
	studentId?: number;

	@IsInt()
	@IsOptional()
	bachelorId?: number;

	@IsInt()
	@IsOptional()
	facultyId?: number;

	@IsInt()
	@IsOptional()
	articlesId?: number;

	@IsString()
	@IsOptional()
	currentSpecialization?: string;

	@IsString()
	@IsOptional()
	course?: string;

	@IsString()
	@IsOptional()
	paymentType?: string;

	@IsString()
	@IsOptional()
	entryYear?: string;

	@IsString()
	@IsOptional()
	educationForm?: string;

	@IsString()
	@IsOptional()
	languageCertificate?: string;

	@IsString()
	@IsOptional()
	semester?: string;

	@IsString()
	@IsOptional()
	scientificSupervisor?: string;

	@IsString()
	@IsOptional()
	scientificAdvisor?: string;

	@IsString()
	@IsOptional()
	internshipSupervisor?: string;

	@IsString()
	@IsOptional()
	internalReviewer?: string;

	@IsString()
	@IsOptional()
	externamReviewer?: string;

	@IsString()
	@IsOptional()
	thesisTopic?: string;

	@IsString()
	@IsOptional()
	academicLeave?: string;
}
