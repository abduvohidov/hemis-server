import { TYPES } from './../../../types';
import { inject, injectable } from 'inversify';
import { Articles, Master } from '@prisma/client';
import { IEducation } from '../../education/types';
import { IEducationRepository } from '../../education';
import { IArticleService } from './article.service.interface';
import { CreateArticleDto, IArticleRepository } from '../index';

@injectable()
export class ArticleService implements IArticleService {
	constructor(
		@inject(TYPES.ArticleRepository) private articleRepository: IArticleRepository,
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
	) {}

	async prepareArticle(data: CreateArticleDto): Promise<Articles | string | null> {
		const education = await this.educationRepository.findByMasterId(data.masterId);
		if (!education) return 'Magistrant topilmadi';
		const finalData = {
			firstArticle: data.firstArticle,
			firstArticleDate: data.firstArticleDate,
			firstArticleJournal: data.firstArticleJournal,
			secondArticle: data.secondArticle,
			secondArticleDate: data.secondArticleDate,
			secondArticleJournal: data.secondArticleJournal,
		};
		const article = await this.articleRepository.create(finalData);
		await this.educationRepository.update(education?.id, { articlesId: article?.id });
		return article;
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
	async getByValues(filters: Partial<Articles>): Promise<Master[] | []> {
		const articleFilters = {
			...(filters.firstArticle && { firstArticle: filters.firstArticle }),
			...(filters.firstArticleDate && { firstArticleDate: filters.firstArticleDate }),
			...(filters.firstArticleJournal && { firstArticleJournal: filters.firstArticleJournal }),
			...(filters.secondArticle && { secondArticle: filters.secondArticle }),
			...(filters.secondArticleDate && { secondArticleDate: filters.secondArticleDate }),
			...(filters.secondArticleJournal && { secondArticleJournal: filters.secondArticleJournal }),
		};

		const hasArticleFilters = Object.keys(articleFilters).length > 0;
		if (!hasArticleFilters) return [];

		const articles = await this.articleRepository.filterByValues(filters);
		const articlesId = articles?.map((article: Articles) => article.id);
		const education = await this.educationRepository.findByArticlesId(articlesId);
		const masters = education.flatMap((education: IEducation) => education.master);

		if (masters.length > 0) {
			return masters as Master[];
		}
		return [];
	}
}
