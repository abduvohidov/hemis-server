import { TYPES } from './../../../types';
import { IArticleRepository } from '../index';
import { inject, injectable } from 'inversify';
import { Articles, Student } from '@prisma/client';
import { IEducation } from '../../education/types';
import { IEducationRepository } from '../../education';
import { IArticleService } from './article.service.interface';

@injectable()
export class ArticleService implements IArticleService {
	constructor(
		@inject(TYPES.ArticleRepository) private articleRepository: IArticleRepository,
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
	) {}

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
	async getByValues(filters: Partial<Articles>): Promise<Student[] | []> {
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
		const students = education.flatMap((education: IEducation) => education.student);
		if (students.length > 0) return students as Student[];
		return [];
	}
}
