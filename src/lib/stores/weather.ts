import { writable, derived, type Readable } from 'svelte/store';
import { fetchWeatherData, fetchWeatherByLocation, fetchLocationInfo, WeatherApiError } from '$lib/api/weather';
import { requestGeolocation } from '$lib/geolocation';
import type { WeatherData } from '$lib/types/weather';
import { mockDataMap } from '$lib/mock/weather';

/** 天气数据加载状态 */
export type WeatherLoadingState = 'idle' | 'loading' | 'success' | 'error';

/** mock 场景标识 */
export type MockScenario = 'normal' | 'heavy-pollution' | 'cold' | 'rain' | 'error';

/** 数据模式：real=后端真实API, mock=模拟数据 */
export type DataMode = 'real' | 'mock';

/** 定位来源 */
export type LocationSource = 'gps' | 'ip' | null;

/** 定位模式偏好 */
type LocationMode = 'gps' | 'ip';

// ===== localStorage 工具 =====
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

/** 当前数据模式 */
export const dataMode = writable<DataMode>(loadFromStorage('weather_dataMode', 'real'));
dataMode.subscribe((v) => saveToStorage('weather_dataMode', v));

/** 当前选中的 mock 场景 */
export const mockScenario = writable<MockScenario>(loadFromStorage('weather_mockScenario', 'normal'));
mockScenario.subscribe((v) => saveToStorage('weather_mockScenario', v));

/** 定位来源 */
export const locationSource = writable<LocationSource>(null);

const locationMode = writable<LocationMode>(loadFromStorage('weather_locationMode', 'gps'));
locationMode.subscribe((v) => saveToStorage('weather_locationMode', v));

/** 自定义经纬度（mock 模式下使用，null 表示未设置） */
export const mockLat = writable<number | null>(loadFromStorage('weather_mockLat', null));
export const mockLon = writable<number | null>(loadFromStorage('weather_mockLon', null));
mockLat.subscribe((v) => saveToStorage('weather_mockLat', v));
mockLon.subscribe((v) => saveToStorage('weather_mockLon', v));

/** 天气数据 */
const dataStore = writable<WeatherData | null>(null);

/** 加载状态 */
const stateStore = writable<WeatherLoadingState>('idle');

/** 错误信息 */
const errorStore = writable<string | null>(null);
let activeRequestId = 0;
let realWeatherController: AbortController | null = null;

/**
 * 补全天气数据中缺失的城市名
 * by-location API 只返回经纬度，通过 comprehensive 接口获取 IP 定位的城市名作为兜底
 */
async function fillLocationCity(
  data: WeatherData,
  signal?: AbortSignal
): Promise<WeatherData> {
  // 如果已经有城市名就不需要补
  if (data.location.city && data.location.city !== '未知位置') return data;

  const loc = await fetchLocationInfo(signal);
  if (!loc) return data;

  const city = loc.district ? `${loc.city} ${loc.district}` : loc.city;
  return {
    ...data,
    location: { ...data.location, city }
  };
}

function beginLoad() {
  activeRequestId += 1;
  stateStore.set('loading');
  errorStore.set(null);
  return activeRequestId;
}

function isCurrentRequest(requestId: number, mode: DataMode) {
  return requestId === activeRequestId && getStoreValue(dataMode) === mode;
}

/** 加载天气数据 — 真实模式（自动尝试 GPS 定位，失败则回退 IP 定位） */
export async function loadRealWeather() {
  const requestId = beginLoad();
  realWeatherController?.abort();
  realWeatherController = new AbortController();
  const signal = realWeatherController.signal;
  const mode = getStoreValue(locationMode);

  try {
    if (mode === 'ip') {
      const data = await fetchWeatherData(signal);
      if (!isCurrentRequest(requestId, 'real')) return;

      dataStore.set(data);
      locationSource.set('ip');
      stateStore.set('success');
      return;
    }

    // 第一步：尝试浏览器 GPS 定位
    let usedGps = false;
    try {
      const pos = await requestGeolocation();
      if (!isCurrentRequest(requestId, 'real')) return;

      // GPS 定位成功，调用 by-location API
      const data = await fetchWeatherByLocation(pos.lat, pos.lon, signal);
      if (!isCurrentRequest(requestId, 'real')) return;

      // 补全城市名（by-location API 可能只返回经纬度）
      const filled = await fillLocationCity(data, signal);
      if (!isCurrentRequest(requestId, 'real')) return;

      dataStore.set(filled);
      locationSource.set('gps');
      stateStore.set('success');
      usedGps = true;
    } catch {
      // GPS 失败（权限拒绝、超时、非 HTTPS 等）— 静默回退到 IP 定位
    }

    // 第二步：GPS 失败，回退到 IP 定位
    if (!usedGps) {
      if (!isCurrentRequest(requestId, 'real')) return;

      const data = await fetchWeatherData(signal);
      if (!isCurrentRequest(requestId, 'real')) return;

      dataStore.set(data);
      locationSource.set('ip');
      stateStore.set('success');
    }
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

/** 手动使用 GPS 定位刷新天气 */
export async function refreshWithGps() {
  dataMode.set('real');
  locationMode.set('gps');
  const requestId = beginLoad();
  realWeatherController?.abort();
  realWeatherController = new AbortController();
  const signal = realWeatherController.signal;

  try {
    const pos = await requestGeolocation();
    if (!isCurrentRequest(requestId, 'real')) return;

    const data = await fetchWeatherByLocation(pos.lat, pos.lon, signal);
    if (!isCurrentRequest(requestId, 'real')) return;

    const filled = await fillLocationCity(data, signal);
    if (!isCurrentRequest(requestId, 'real')) return;

    dataStore.set(filled);
    locationSource.set('gps');
    stateStore.set('success');
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
    if (!isCurrentRequest(requestId, 'real')) return;

    // GPS 失败，回退 IP
    try {
      const data = await fetchWeatherData(signal);
      if (!isCurrentRequest(requestId, 'real')) return;
      dataStore.set(data);
      locationSource.set('ip');
      stateStore.set('success');
    } catch {
      if (!isCurrentRequest(requestId, 'real')) return;
      errorStore.set('GPS 定位失败，IP 定位也失败');
      stateStore.set('error');
    }
  } finally {
    if (requestId === activeRequestId) {
      realWeatherController = null;
    }
  }
}

/** 手动使用 IP 模糊定位刷新天气 */
export async function refreshWithIp() {
  dataMode.set('real');
  locationMode.set('ip');
  const requestId = beginLoad();
  realWeatherController?.abort();
  realWeatherController = new AbortController();
  const signal = realWeatherController.signal;

  try {
    const data = await fetchWeatherData(signal);
    if (!isCurrentRequest(requestId, 'real')) return;

    dataStore.set(data);
    locationSource.set('ip');
    stateStore.set('success');
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
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

/** 加载天气数据 — mock 模式 */
export async function loadMockWeather(scenario?: MockScenario) {
  realWeatherController?.abort();
  realWeatherController = null;

  const requestId = beginLoad();
  const activeScenario = scenario ?? getStoreValue(mockScenario);
  const lat = getStoreValue(mockLat);
  const lon = getStoreValue(mockLon);

  // 如果设置了自定义经纬度，用真实 API 获取该位置的天气
  if (lat !== null && lon !== null) {
    realWeatherController = new AbortController();
    const signal = realWeatherController.signal;

    try {
      if (!isCurrentRequest(requestId, 'mock')) return;
      const data = await fetchWeatherByLocation(lat, lon, signal);
      if (!isCurrentRequest(requestId, 'mock')) return;
      dataStore.set(data);
      locationSource.set('gps');
      stateStore.set('success');
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      if (!isCurrentRequest(requestId, 'mock')) return;
      // 自定义坐标 API 失败，回退到本地 mock 数据
    }
  }

  // 本地 mock 数据
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
  locationSource.set(null);
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
  mockLat.set(null);
  mockLon.set(null);
  dataMode.set('mock');
  void loadMockWeather(scenario);
}

/** 切换到真实模式并重新加载 */
export function switchToReal() {
  dataMode.set('real');
  void loadRealWeather();
}

/** 设置 mock 自定义经纬度并重新加载 */
export function setMockCoords(lat: number, lon: number) {
  mockLat.set(lat);
  mockLon.set(lon);
  dataMode.set('mock');
  void loadMockWeather();
}

/** 清除 mock 自定义经纬度 */
export function clearMockCoords() {
  mockLat.set(null);
  mockLon.set(null);
  void loadMockWeather();
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
