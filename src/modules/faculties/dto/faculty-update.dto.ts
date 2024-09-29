import { IsNotEmpty, IsString } from 'class-validator';

export class FacultyUpdateDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
