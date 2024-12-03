export interface FileStorage {
	saveFile(filename: string, content: Buffer): Promise<string>;
	deleteFile(filename: string): Promise<void>;
	getFilePath(filename: string): Promise<string>;
}
