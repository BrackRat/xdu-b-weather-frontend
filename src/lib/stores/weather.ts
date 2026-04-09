import { writable, derived, type Readable } from 'svelte/store';
import { fetchWeatherData, WeatherApiError } from '$lib/api/weather';
import type { WeatherData } from '$lib/types/weather';
import { mockDataMap } from '$lib/mock/weather';

/** 天气数据加载状态 */
export type WeatherLoadingState = 'idle' | 'loading' | 'success' | 'error';

/** mock 场景标识 */
export type MockScenario = 'normal' | 'heavy-pollution' | 'cold' | 'rain' | 'error';

/** 数据模式：real=后端真实API, mock=模拟数据 */
export type DataMode = 'real' | 'mock';

/** 当前数据模式 */
export const dataMode = writable<DataMode>('real');

/** 当前选中的 mock 场景 */
export const mockScenario = writable<MockScenario>('normal');

/** 天气数据 */
const dataStore = writable<WeatherData | null>(null);

/** 加载状态 */
const stateStore = writable<WeatherLoadingState>('idle');

/** 错误信息 */
const errorStore = writable<string | null>(null);
let activeRequestId = 0;
let realWeatherController: AbortController | null = null;

function beginLoad() {
	activeRequestId += 1;
	stateStore.set('loading');
	errorStore.set(null);
	return activeRequestId;
}

function isCurrentRequest(requestId: number, mode: DataMode) {
	return requestId === activeRequestId && getStoreValue(dataMode) === mode;
}

/** 加载天气数据 — 真实模式（前端直连后端，保留客户端 IP） */
export async function loadRealWeather() {
	const requestId = beginLoad();
	realWeatherController?.abort();
	realWeatherController = new AbortController();

	try {
		const data = await fetchWeatherData(realWeatherController.signal);
		if (!isCurrentRequest(requestId, 'real')) return;
		dataStore.set(data);
		stateStore.set('success');
	} catch (e) {
		if (e instanceof DOMException && e.name === 'AbortError') {
			return;
		}

		if (!isCurrentRequest(requestId, 'real')) return;

		let msg: string;
		if (e instanceof WeatherApiError) {
			msg = `API 错误 (${e.statusCode}): ${e.message}`;
		} else if (e instanceof Error) {
			msg = e.message;
		} else {
			msg = '未知错误';
		}
		errorStore.set(msg);
		stateStore.set('error');
	} finally {
		if (requestId === activeRequestId) {
			realWeatherController = null;
		}
	}
}

/** 加载天气数据 — mock 模式（本地数据，不走网络） */
export async function loadMockWeather(scenario?: MockScenario) {
	realWeatherController?.abort();
	realWeatherController = null;

	const requestId = beginLoad();
	const activeScenario = scenario ?? getStoreValue(mockScenario);

	if (activeScenario === 'error') {
		if (!isCurrentRequest(requestId, 'mock')) return;
		errorStore.set('模拟服务端错误: 外部天气 API 超时');
		stateStore.set('error');
		return;
	}

	const data = mockDataMap[activeScenario];
	if (!data) {
		if (!isCurrentRequest(requestId, 'mock')) return;
		errorStore.set(`未知 mock 场景: ${activeScenario}`);
		stateStore.set('error');
		return;
	}

	if (!isCurrentRequest(requestId, 'mock')) return;
	dataStore.set(data);
	stateStore.set('success');
}

/** 加载天气数据（根据当前模式自动选择） */
export async function loadWeatherData() {
	const mode = getStoreValue(dataMode);
	if (mode === 'real') {
		return loadRealWeather();
	} else {
		return loadMockWeather();
	}
}

/** 切换 mock 场景并重新加载 */
export function switchScenario(scenario: MockScenario) {
	mockScenario.set(scenario);
	dataMode.set('mock');
	void loadMockWeather(scenario);
}

/** 切换到真实模式并重新加载 */
export function switchToReal() {
	dataMode.set('real');
	void loadRealWeather();
}

/** 便捷读取 store 值 */
function getStoreValue<T>(store: Readable<T>): T {
	let val!: T;
	store.subscribe((v) => (val = v))();
	return val;
}

/** 派生状态 */
export const weatherData = derived(dataStore, ($data) => $data);
export const weatherState = derived(stateStore, ($state) => $state);
export const weatherError = derived(errorStore, ($error) => $error);
export const isLoading = derived(stateStore, ($state) => $state === 'loading');
export const isLoaded = derived(stateStore, ($state) => $state === 'success');
