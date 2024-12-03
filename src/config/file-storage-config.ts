import { injectable } from 'inversify';

export interface FileStorageConfig {
	getLocalStoragePath(): string;
}

@injectable()
export class FileStorageConfigImpl implements FileStorageConfig {
	private readonly localStoragePath: string;

	constructor() {
		this.localStoragePath = process.env.FILE_STORAGE_PATH || '';

		this.validateEnvs();
	}

	public getLocalStoragePath(): string {
		return this.localStoragePath;
	}

	private validateEnvs(): void {
		if (!this.localStoragePath) {
			new Error('Not found env: FILE_STORAGE_PATH');
		}
	}
}
