import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddressCreateDto {
	@IsNotEmpty()
	@IsString()
	readonly country: string;

	@IsNotEmpty()
	@IsString()
	readonly region: string;

	@IsNotEmpty()
	@IsString()
	readonly address: string;

	@IsNotEmpty()
	@IsNumber()
	readonly masterId: number;
}
