import { IsNotEmpty, IsString } from 'class-validator';

export class FacultyCreateDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
