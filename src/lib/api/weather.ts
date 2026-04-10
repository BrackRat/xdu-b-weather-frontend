import { PUBLIC_WEATHER_API_BASE_URL } from '$env/static/public';
import type { WeatherData, BackendWeatherResponse } from '$lib/types/weather';
import { mapBackendToWeatherData } from '$lib/types/weather';

const BACKEND_BASE = PUBLIC_WEATHER_API_BASE_URL.replace(/\/$/, '');

/**
 * 通过经纬度获取天气数据（优先使用精确定位）
 */
export async function fetchWeatherByLocation(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherData> {
  if (!BACKEND_BASE) {
    throw new WeatherApiError('缺少 PUBLIC_WEATHER_API_BASE_URL 配置', 500);
  }

  const url = `${BACKEND_BASE}/weather/by-location?latitude=${lat}&longitude=${lon}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    throw new WeatherApiError(`请求失败: ${response.status} ${response.statusText}`, response.status);
  }

  const raw: BackendWeatherResponse = await response.json();
  return mapBackendToWeatherData(raw);
}

/**
 * 通过 IP 定位获取天气数据（回退方案）
 */
export async function fetchWeatherData(signal?: AbortSignal): Promise<WeatherData> {
  if (!BACKEND_BASE) {
    throw new WeatherApiError('缺少 PUBLIC_WEATHER_API_BASE_URL 配置', 500);
  }

  const url = `${BACKEND_BASE}/weather/comprehensive`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    throw new WeatherApiError(`请求失败: ${response.status} ${response.statusText}`, response.status);
  }

  const raw: BackendWeatherResponse = await response.json();
  return mapBackendToWeatherData(raw);
}

/**
 * 获取 IP 定位的位置信息（仅用于补全城市名，不获取天气）
 */
export async function fetchLocationInfo(signal?: AbortSignal): Promise<{ city: string; district: string } | null> {
  if (!BACKEND_BASE) return null;

  try {
    const url = `${BACKEND_BASE}/weather/comprehensive`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal
    });
    if (!response.ok) return null;

    const raw = await response.json();
    const loc = raw.location;
    if (!loc?.city) return null;
    return { city: loc.city, district: loc.district ?? '' };
  } catch {
    return null;
  }
}

/** 天气 API 错误类 */
export class WeatherApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'WeatherApiError';
    this.statusCode = statusCode;
  }
}
