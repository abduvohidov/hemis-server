import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate } from 'class-validator';

export class UpdateArticleDto {
	@IsString()
	@IsOptional()
	firstArticle?: string;

	@IsDate()
	@Type(() => Date)
	firstArticleDate?: Date;

	@IsString()
	@IsOptional()
	firstArticleJournal?: string;

	@IsString()
	@IsOptional()
	secondArticle?: string;

	@IsDate()
	@Type(() => Date)
	secondArticleDate?: Date;

	@IsString()
	@IsOptional()
	secondArticleJournal?: string;
}
