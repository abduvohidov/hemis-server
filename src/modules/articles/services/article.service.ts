import { Articles } from '@prisma/client';
import { TYPES } from './../../../types';
import { inject, injectable } from 'inversify';
import { IArticleRepository } from '../index';
import { IArticleService } from './article.service.interface';

@injectable()
export class ArticleService implements IArticleService {
	constructor(@inject(TYPES.ArticleRepository) private articleRepository: IArticleRepository) {}

	async prepareArticle(data: Articles): Promise<Articles | null> {
		return await this.articleRepository.create(data);
	}
	async removeArticle(id: number): Promise<Articles | null> {
		const article = await this.articleRepository.findById(id);
		if (!article) return null;
		return await this.articleRepository.delete(id);
	}
	async changeArticle(id: number, data: Partial<Articles>): Promise<Articles | null> {
		const article = await this.articleRepository.findById(id);
		if (!article) return null;
		return await this.articleRepository.update(id, data);
	}
	// gets
	async getAll(): Promise<Articles[]> {
		return await this.articleRepository.findAll();
	}
	async getById(id: number): Promise<Articles | null> {
		return await this.articleRepository.findById(id);
	}
	async getByValues(filters: Partial<Articles>): Promise<Articles[] | null> {
		if (Object.keys(filters).length === 0) {
			return null;
		}
		return await this.articleRepository.filterByValues(filters);
	}
}
