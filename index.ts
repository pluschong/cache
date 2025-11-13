import { SafeAny } from '@pluschong/safe-type';
import { add, diff } from '@pluschong/utils';
import { CacheConfig, ICache } from './cache.type';
import store from './storage/local-storage-cache.service';

class CacheService {
	static instance: CacheService;
	static getInstance() {
		if (!this.instance) {
			this.instance = new CacheService();
		}
		return this.instance;
	}

	private readonly memory: Map<string, ICache> = new Map<string, ICache>();
	private cog: CacheConfig;

	constructor() {
		this.cog = {
			type: 's',
			remember_key: '__c_r'
		};
	}

	// #region remember

	private getRemember() {
		return store.get(this.cog.remember_key!);
	}

	clearRemember(): void {
		store.remove(this.cog.remember_key!);
	}

	setRemember(key: string, second: number): void {
		const currCacheValue = this.getRemember();
		const cache = { [key]: { v: new Date().getTime(), e: second } };
		store.set(this.cog.remember_key!, {
			v: currCacheValue ? { ...currCacheValue.v, ...cache } : cache,
			e: 0
		});
	}

	/**
	 * 获取时限是否到期 `true`过期
	 * @param key - 本地存储key
	 */
	isExpireRemember(key: string): boolean {
		const currCacheValue = this.getRemember();
		const cache: ICache | null = currCacheValue ? currCacheValue.v[key] : null;
		return cache
			? cache.e === 0
				? false
				: diff(new Date().getTime(), cache.v, 'second') > cache.e
			: true;
	}

	// #endregion

	// #region set

	/**
	 * 缓存对象
	 */
	set(
		key: string,
		data: SafeAny,
		options: {
			/** 存储类型，'m' 表示内存，'s' 表示持久 */
			type?: 'm' | 's';
			/**
			 * 过期时间，单位 `秒`
			 */
			expire?: number;
		} = {}
	): SafeAny {
		let e = 0;
		const { type, expire } = this.cog;
		options = {
			type,
			expire,
			...options
		};
		if (options.expire) {
			e = add(new Date(), options.expire, 'second');
		}

		this.save(options.type!, key, { v: data, e });
	}

	private save(type: 'm' | 's', key: string, value: ICache): void {
		if (type === 'm') {
			this.memory.set(key, value);
		} else {
			store.set(key, value);
		}
	}

	// #endregion

	// #region get

	/** 获取缓存数据，若 `key` 不存在或已过期则返回 null */
	get<T>(key: string): T;
	/** 获取缓存数据，若 `key` 不存在或已过期则返回 null */
	get(key: string): SafeAny {
		const value = this.memory.has(key) ? (this.memory.get(key) as ICache) : store.get(key);
		if (!value || (value.e && value.e > 0 && value.e < new Date().valueOf())) {
			return null;
		}

		return value.v;
	}

	// #endregion

	// #region has

	// #region remove

	private _remove(key: string): void {
		if (this.memory.has(key)) {
			this.memory.delete(key);
			return;
		}
		store.remove(key);
	}

	/** 移除缓存 */
	remove(key: string): void {
		this._remove(key);
	}

	/** 清空所有缓存 */
	clear(): void {
		this.memory.clear();
		store.clear();
	}

	// #endregion
}

export const cacheSrv = CacheService.getInstance();
