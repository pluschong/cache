import { ICache } from '../cache.type';

class SessionStorageCacheService {
	static instance: SessionStorageCacheService;
	static getInstance() {
		if (!this.instance) {
			this.instance = new SessionStorageCacheService();
		}
		return this.instance;
	}

	constructor() {}

	get(key: string): ICache | null {
		return JSON.parse(sessionStorage.getItem(key) || 'null') || null;
	}

	set(key: string, value: ICache): boolean {
		sessionStorage.setItem(key, JSON.stringify(value));
		return true;
	}

	remove(key: string): void {
		sessionStorage.removeItem(key);
	}

	clear() {
		sessionStorage.clear();
	}
}

export default SessionStorageCacheService.getInstance();
