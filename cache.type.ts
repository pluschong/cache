import { SafeAny } from '@pluschong/safe-type';

export interface ICache {
	v: SafeAny;
	/** 过期时间，`0` 表示不过期 */
	e: number;
}

export interface ICacheStore {
	get(key: string): ICache | null;
	set(key: string, value: ICache): boolean;
	remove(key: string): void;
	clear(): void;
}

export interface CacheConfig {
	/**
	 * Set the default storage type
	 * - `m` Storage via memory
	 * - `s` Storage via `localStorage`
	 */
	type?: 'm' | 's';
	/**
	 * Set the default expire time (Unit: second)
	 */
	expire?: number;
	/**
	 * Key name of persistent data modal dialog storage, default: `__c_m`
	 */
	remember_key?: string;
}
