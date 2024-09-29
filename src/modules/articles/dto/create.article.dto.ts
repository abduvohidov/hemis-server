import { Type } from 'class-transformer';
import { IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
	@IsString()
	@IsNotEmpty()
	firstArticle: string;

	@IsDate()
	@Type(() => Date)
	firstArticleDate: Date;

	@IsString()
	@IsNotEmpty()
	firstArticleJournal: string;

	@IsString()
	@IsNotEmpty()
	secondArticle: string;

	@IsDate()
	@Type(() => Date)
	secondArticleDate: Date;

	@IsString()
	@IsNotEmpty()
	secondArticleJournal: string;
}
