import { ICache } from '../cache.type';

class LocalStorageCacheService {
	static instance: LocalStorageCacheService;
	static getInstance() {
		if (!this.instance) {
			this.instance = new LocalStorageCacheService();
		}
		return this.instance;
	}

	constructor() {}

	get(key: string): ICache | null {
		return JSON.parse(localStorage.getItem(key) || 'null') || null;
	}

	set(key: string, value: ICache): boolean {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	}

	remove(key: string): void {
		localStorage.removeItem(key);
	}

	clear() {
		localStorage.clear();
	}
}

export default LocalStorageCacheService.getInstance();
