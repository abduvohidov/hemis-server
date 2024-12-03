import { Articles } from '@prisma/client';
import { TYPES } from './../../../types';
import { inject, injectable } from 'inversify';
import { PrismaService } from './../../../database/prisma.service';
import { IArticleRepository } from './article.repository.interface';

@injectable()
export class ArticleRepository implements IArticleRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(data: Omit<Articles, 'id'>): Promise<Articles | null> {
		return this.prismaService.client.articles.create({
			data: {
				firstArticle: data.firstArticle,
				firstArticleDate: new Date(data?.secondArticleDate),
				firstArticleJournal: data.firstArticleJournal,
				firstArticleFilename: '',
				secondArticle: data.secondArticle,
				secondArticleDate: new Date(data?.secondArticleDate),
				secondArticleJournal: data.secondArticleJournal,
				secondArticleFilename: '',
			},
		});
	}

	async delete(id: number): Promise<Articles | null> {
		return this.prismaService.client.articles.delete({ where: { id } });
	}

	async update(id: number, data: Partial<Articles>): Promise<Articles | null> {
		return this.prismaService.client.articles.update({
			where: { id },
			data: {
				...(data.firstArticle && { firstArticle: data.firstArticle }),
				...(data.firstArticleDate && { firstArticleDate: data.firstArticleDate }),
				...(data.firstArticleJournal && { firstArticleJournal: data.firstArticleJournal }),
				...(data.firstArticleFilename && { firstArticleFilename: data.firstArticleFilename }),
				...(data.secondArticle && { secondArticle: data.secondArticle }),
				...(data.secondArticleDate && { secondArticleDate: data.secondArticleDate }),
				...(data.secondArticleJournal && { secondArticleJournal: data.secondArticleJournal }),
				...(data.secondArticleFilename && { secondArticleFilename: data.secondArticleFilename }),
			},
		});
	}

	async findAll(): Promise<Articles[]> {
		return this.prismaService.client.articles.findMany();
	}
	async findById(id: number): Promise<Articles | null> {
		return this.prismaService.client.articles.findUnique({ where: { id } });
	}

	async filterByValues(filters: Partial<Articles>): Promise<Articles[] | []> {
		return this.prismaService.client.articles.findMany({
			where: filters,
		});
	}
}
