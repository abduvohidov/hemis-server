import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class MasterLoginDto {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	@IsString()
	@Length(6, 20, { message: 'Длина вашего пароля должна быть больше 6' })
	readonly password: string;
}
