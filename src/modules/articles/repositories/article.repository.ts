import { Articles } from '@prisma/client';
import { TYPES } from './../../../types';
import { inject, injectable } from 'inversify';
import { PrismaService } from './../../../database/prisma.service';
import { IArticleRepository } from './article.repository.interface';

@injectable()
export class ArticleRepository implements IArticleRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(data: Articles): Promise<Articles | null> {
		return await this.prismaService.client.articles.create({
			data: {
				firstArticle: data.firstArticle,
				firstArticleDate: data.firstArticleDate,
				firstArticleJournal: data.firstArticleJournal,
				secondArticle: data.secondArticle,
				secondArticleDate: data.secondArticleDate,
				secondArticleJournal: data.secondArticleJournal,
			},
		});
	}

	async delete(id: number): Promise<Articles | null> {
		return await this.prismaService.client.articles.delete({ where: { id } });
	}

	async update(id: number, data: Partial<Articles>): Promise<Articles | null> {
		return await this.prismaService.client.articles.update({
			where: { id },
			data: {
				...(data.firstArticle && { firstArticle: data.firstArticle }),
				...(data.firstArticleDate && { firstArticleDate: data.firstArticleDate }),
				...(data.firstArticleJournal && { firstArticleJournal: data.firstArticleJournal }),
				...(data.secondArticle && { secondArticle: data.secondArticle }),
				...(data.secondArticleDate && { secondArticleDate: data.secondArticleDate }),
				...(data.secondArticleJournal && { secondArticleJournal: data.secondArticleJournal }),
			},
		});
	}

	async findAll(): Promise<Articles[]> {
		return await this.prismaService.client.articles.findMany();
	}
	async findById(id: number): Promise<Articles | null> {
		return await this.prismaService.client.articles.findUnique({ where: { id } });
	}

	async filterByValues(filters: Partial<Articles>): Promise<Articles[] | null> {
		return await this.prismaService.client.articles.findMany({
			where: {
				...(filters.firstArticle && { firstArticle: filters.firstArticle }),
				...(filters.firstArticleDate && { firstArticleDate: filters.firstArticleDate }),
				...(filters.firstArticleJournal && { firstArticleJournal: filters.firstArticleJournal }),
				...(filters.secondArticle && { secondArticle: filters.secondArticle }),
				...(filters.secondArticleDate && { secondArticleDate: filters.secondArticleDate }),
				...(filters.secondArticleJournal && { secondArticleJournal: filters.secondArticleJournal }),
			},
		});
	}
}
