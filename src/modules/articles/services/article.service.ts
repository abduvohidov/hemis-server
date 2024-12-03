import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { Articles, Master } from '@prisma/client';
import { IEducationRepository } from '../../education';
import { ArticleUploadParams, IArticleService } from './article.service.interface';
import { CreateArticleDto, IArticleRepository } from '../index';
import { IMasterRepository } from '../../masters';
import { FileStorage } from '../../../common/fileStorage';

@injectable()
export class ArticleService implements IArticleService {
	constructor(
		@inject(TYPES.ArticleRepository) private articleRepository: IArticleRepository,
		@inject(TYPES.MasterRepository) private masterRepository: IMasterRepository,
		@inject(TYPES.FileStorage) private fileStorage: FileStorage,
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
	) {}

	async fileUpload(id: number, data: ArticleUploadParams): Promise<Articles | string | null> {
		const article = await this.articleRepository.findById(id);

		if (!article) return null;

		if (data.first) {
			article.firstArticleFilename = await this.fileStorage.saveFile(
				data.first.filename,
				data.first.content,
			);
		}
		if (data.second) {
			article.secondArticleFilename = await this.fileStorage.saveFile(
				data.second.filename,
				data.second.content,
			);
		}

		return await this.articleRepository.update(id, article);
	}

	async prepareArticle(data: CreateArticleDto): Promise<Articles | string | null> {
		const education = await this.educationRepository.findByMasterId(data.masterId);
		if (!education) return 'Magistrant topilmadi';
		const finalData = {
			firstArticle: data.firstArticle,
			firstArticleDate: data.firstArticleDate,
			firstArticleJournal: data.firstArticleJournal,
			firstArticleFilename: data.firstArticleFilename,
			secondArticle: data.secondArticle,
			secondArticleDate: data.secondArticleDate,
			secondArticleJournal: data.secondArticleJournal,
			secondArticleFilename: data.secondArticleFilename,
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
			...(filters.firstArticleFilename && { firstArticleFilename: filters.firstArticleFilename }),
			...(filters.secondArticle && { secondArticle: filters.secondArticle }),
			...(filters.secondArticleDate && { secondArticleDate: filters.secondArticleDate }),
			...(filters.secondArticleJournal && { secondArticleJournal: filters.secondArticleJournal }),
			...(filters.secondArticleFilename && { secondArticleFilename: filters.secondArticleFilename }),
		};

		const hasArticleFilters = Object.keys(articleFilters).length > 0;
		if (!hasArticleFilters) return [];

		const articles = await this.articleRepository.filterByValues(filters);
		const articleIds = articles.map((article) => article.id);
		const education = await this.educationRepository.findByArticlesId(articleIds);
		const educationMasterIds = education?.map((edu) => edu.masterId);
		return await this.masterRepository.findByIds(educationMasterIds);
	}
}
