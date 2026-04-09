// ============================================================
// Weather API 类型定义
// ============================================================

/** 天气状况 */
export type WeatherCondition =
  | '晴'
  | '多云'
  | '阴'
  | '轻度雾霾'
  | '中度雾霾'
  | '重度雾霾'
  | '小雨'
  | '中雨'
  | '大雨'
  | '暴雨'
  | '雾'
  | '小雪'
  | '中雪'
  | '大雪'
  | '暴雪'
  | '浮尘'
  | '沙尘'
  | '大风'
  | '冰雹'
  | '雨夹雪'
  | '雨'
  | '雪'
  | '未知';

/** 风向 */
export type WindDirection = '东' | '南' | '西' | '北' | '东北' | '西北' | '东南' | '西南';

/** AQI 等级 */
export type AqiLevel = '优' | '良' | '轻度污染' | '中度污染' | '重度污染' | '严重污染';

// ============================================================
// 位置信息
// ============================================================
export interface Location {
  city: string;
  lat: string;
  lon: string;
}

// ============================================================
// 当前天气
// ============================================================
export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: string[];
  wind: number;
  windDir: WindDirection;
  humidity: number;
  uv: number;
  visibility: number;
  pressure: number;
  dewPoint: number;
  aqi: number;
  aqiLevel: AqiLevel;
  aqiColor: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

// ============================================================
// 日出日落
// ============================================================
export interface SunData {
  sunrise: string;
  sunset: string;
  duration: string;
  progress: number;
}

// ============================================================
// 逐时预报
// ============================================================
export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  isNow?: boolean;
}

// ============================================================
// 每日预报
// ============================================================
export interface DailyForecast {
  day: string;
  date: string;
  condition: string;
  icon: string;
  high: number;
  low: number;
  aqi: number;
  highlight?: boolean;
}

// ============================================================
// 污染物数据
// ============================================================
export interface PollutantData {
  name: string;
  value: number;
  max: number;
  unit: string;
}

// ============================================================
// 完整天气数据响应
// ============================================================
export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  sun: SunData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  aqiPollutants: PollutantData[];
  hourlyAqi: number[];
  hourlyHumidity: number[];
}

// ============================================================
// API 响应包装
// ============================================================
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// ============================================================
// AQI 等级判定工具函数
// ============================================================
export function getAqiLevel(aqi: number): AqiLevel {
  if (aqi <= 50) return '优';
  if (aqi <= 100) return '良';
  if (aqi <= 150) return '轻度污染';
  if (aqi <= 200) return '中度污染';
  if (aqi <= 300) return '重度污染';
  return '严重污染';
}

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#27ae60';
  if (aqi <= 100) return '#e6a017';
  if (aqi <= 150) return '#e67e22';
  if (aqi <= 200) return '#e74c3c';
  if (aqi <= 300) return '#8e44ad';
  return '#7f1d1d';
}

// ============================================================
// 彩云天气 API 原始响应类型
// ============================================================

export type CaiyunSkycon =
  | 'CLEAR_DAY' | 'CLEAR_NIGHT'
  | 'PARTLY_CLOUDY_DAY' | 'PARTLY_CLOUDY_NIGHT'
  | 'CLOUDY'
  | 'LIGHT_HAZE' | 'MODERATE_HAZE' | 'HEAVY_HAZE'
  | 'LIGHT_RAIN' | 'MODERATE_RAIN' | 'HEAVY_RAIN' | 'STORM_RAIN'
  | 'LIGHT_SNOW' | 'MODERATE_SNOW' | 'HEAVY_SNOW' | 'STORM_SNOW'
  | 'FOG' | 'HAIL' | 'SLEET'
  | 'WIND' | 'DUST' | 'SAND' | 'HAZE'
  | 'RAIN' | 'SNOW';

export interface CaiyunRealtime {
  temperature: number;
  humidity: number;
  wind: { speed: number; direction: number };
  pressure: number;
  visibility: number;
  apparent_temperature: number;
  skycon: CaiyunSkycon;
  air_quality: {
    aqi: { chn: number; usa: number };
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
    description: { chn: string; usa: string };
  };
  life_index: {
    ultraviolet: { index: number; desc: string };
    comfort: { index: number; desc: string };
  };
}

export interface CaiyunHourlyItem {
  datetime: string;
  value: number;
}

export interface CaiyunHourlySkyconItem {
  datetime: string;
  value: CaiyunSkycon;
}

export interface CaiyunHourlyAqiItem {
  datetime: string;
  value: { chn: number; usa: number };
}

export interface CaiyunHourly {
  temperature: CaiyunHourlyItem[];
  humidity: CaiyunHourlyItem[];
  wind: { speed: CaiyunHourlyItem[]; direction: CaiyunHourlyItem[] };
  skycon: CaiyunHourlySkyconItem[];
  air_quality: {
    aqi: CaiyunHourlyAqiItem[];
  };
  pressure: CaiyunHourlyItem[];
  visibility: CaiyunHourlyItem[];
}

export interface CaiyunDailyAstro {
  date: string;
  sunrise: { time: string };
  sunset: { time: string };
}

export interface CaiyunDailyTemperature {
  date: string;
  max: number;
  min: number;
}

export interface CaiyunDailySkycon {
  date: string;
  value: CaiyunSkycon;
}

export interface CaiyunDailyAqi {
  date: string;
  max: { aqi: number; pm25: number };
  avg: { aqi: number; pm25: number };
  min: { aqi: number; pm25: number };
}

export interface CaiyunDaily {
  astro: CaiyunDailyAstro[];
  temperature: CaiyunDailyTemperature[];
  skycon: CaiyunDailySkycon[];
  air_quality: {
    aqi: CaiyunDailyAqi[];
  };
}

export interface CaiyunWeatherResponse {
  status: string;
  result: {
    realtime: CaiyunRealtime;
    hourly: CaiyunHourly;
    daily: CaiyunDaily;
    primary: number;
  };
}

// ============================================================
// 彩云 skycon → 中文条件 + emoji 图标 映射
// ============================================================

const skyconMap: Record<CaiyunSkycon, { condition: WeatherCondition; icon: string }> = {
  CLEAR_DAY: { condition: '晴', icon: '☀️' },
  CLEAR_NIGHT: { condition: '晴', icon: '🌙' },
  PARTLY_CLOUDY_DAY: { condition: '多云', icon: '⛅' },
  PARTLY_CLOUDY_NIGHT: { condition: '多云', icon: '☁️' },
  CLOUDY: { condition: '阴', icon: '☁️' },
  LIGHT_HAZE: { condition: '轻度雾霾', icon: '🌫️' },
  MODERATE_HAZE: { condition: '中度雾霾', icon: '🌫️' },
  HEAVY_HAZE: { condition: '重度雾霾', icon: '🌫️' },
  LIGHT_RAIN: { condition: '小雨', icon: '🌧️' },
  MODERATE_RAIN: { condition: '中雨', icon: '🌧️' },
  HEAVY_RAIN: { condition: '大雨', icon: '🌧️' },
  STORM_RAIN: { condition: '暴雨', icon: '⛈️' },
  LIGHT_SNOW: { condition: '小雪', icon: '🌨️' },
  MODERATE_SNOW: { condition: '中雪', icon: '🌨️' },
  HEAVY_SNOW: { condition: '大雪', icon: '🌨️' },
  STORM_SNOW: { condition: '暴雪', icon: '🌨️' },
  FOG: { condition: '雾', icon: '🌫️' },
  HAIL: { condition: '冰雹', icon: '🌨️' },
  SLEET: { condition: '雨夹雪', icon: '🌨️' },
  WIND: { condition: '大风', icon: '💨' },
  DUST: { condition: '浮尘', icon: '🌫️' },
  SAND: { condition: '沙尘', icon: '🌫️' },
  HAZE: { condition: '轻度雾霾', icon: '🌫️' },
  RAIN: { condition: '雨', icon: '🌧️' },
  SNOW: { condition: '雪', icon: '🌨️' },
};

export function skyconToCondition(skycon: string): { condition: WeatherCondition; icon: string } {
  return skyconMap[skycon as CaiyunSkycon] ?? { condition: '未知', icon: '❓' };
}

// ============================================================
// 风向角度 → 中文风向
// ============================================================

export function windDegToDirection(deg: number): WindDirection {
  const dirs: WindDirection[] = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return dirs[idx];
}

// ============================================================
// 彩云 API 响应 → 应用 WeatherData 映射
// ============================================================

export function mapCaiyunToWeatherData(
  raw: CaiyunWeatherResponse,
  city: string,
  lat: number,
  lon: number
): WeatherData {
  const rt = raw.result.realtime;
  const hourly = raw.result.hourly;
  const daily = raw.result.daily;

  // 当前天气
  const { condition, icon } = skyconToCondition(rt.skycon);
  const aqiVal = rt.air_quality.aqi.chn;
  const aqiLevel = getAqiLevel(aqiVal);
  const aqiColor = getAqiColor(aqiVal);

  const current: CurrentWeather = {
    temp: Math.round(rt.temperature),
    feelsLike: Math.round(rt.apparent_temperature),
    condition: [condition],
    wind: Math.round(rt.wind.speed * 3.6), // m/s → km/h
    windDir: windDegToDirection(rt.wind.direction),
    humidity: Math.round(rt.humidity * 100),
    uv: rt.life_index.ultraviolet.index,
    visibility: Math.round(rt.visibility),
    pressure: Math.round(rt.pressure / 100), // Pa → hPa
    dewPoint: Math.round(rt.temperature - (100 - rt.humidity * 100) / 5),
    aqi: aqiVal,
    aqiLevel,
    aqiColor,
    pm25: rt.air_quality.pm25,
    pm10: rt.air_quality.pm10,
    o3: rt.air_quality.o3,
    no2: rt.air_quality.no2,
    so2: rt.air_quality.so2,
    co: rt.air_quality.co,
  };

  // 日出日落
  const todayAstro = daily.astro[0];
  const sunrise = todayAstro.sunrise.time;
  const sunset = todayAstro.sunset.time;
  const [sh, sm] = sunrise.split(':').map(Number);
  const [eh, em] = sunset.split(':').map(Number);
  const sunriseMin = sh * 60 + sm;
  const sunsetMin = eh * 60 + em;
  const dayLen = sunsetMin - sunriseMin;
  const hours = Math.floor(dayLen / 60);
  const mins = dayLen % 60;
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const progress = Math.max(0, Math.min(100, ((nowMin - sunriseMin) / dayLen) * 100));

  const sun: SunData = {
    sunrise,
    sunset,
    duration: `${hours}小时${mins}分`,
    progress: Math.round(progress),
  };

  // 逐时预报
  const now = new Date();
  const hourlyForecast: HourlyForecast[] = hourly.temperature.slice(0, 24).map((item, i) => {
    const d = new Date(item.datetime);
    const h = d.getHours();
    const isNow = i === 0;
    const skyconItem = hourly.skycon[i];
    const sc = skyconToCondition(skyconItem?.value ?? 'CLEAR_DAY');
    return {
      time: isNow ? '现在' : `${String(h).padStart(2, '0')}:00`,
      temp: Math.round(item.value),
      icon: sc.icon,
      isNow,
    };
  });

  // 每日预报
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dailyForecast: DailyForecast[] = daily.temperature.slice(0, 7).map((tempItem, i) => {
    const d = new Date(tempItem.date);
    const skyconItem = daily.skycon[i];
    const sc = skyconToCondition(skyconItem?.value ?? 'CLEAR_DAY');
    const aqiItem = daily.air_quality.aqi[i];
    return {
      day: i === 0 ? '今天' : weekdays[d.getDay()],
      date: `${weekdays[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}`,
      condition: sc.condition,
      icon: sc.icon,
      high: Math.round(tempItem.max),
      low: Math.round(tempItem.min),
      aqi: aqiItem?.max.aqi ?? 0,
      highlight: i === 0,
    };
  });

  // 污染物
  const aqiPollutants: PollutantData[] = [
    { name: 'PM2.5', value: rt.air_quality.pm25, max: 150, unit: 'µg/m³' },
    { name: 'PM10', value: rt.air_quality.pm10, max: 250, unit: 'µg/m³' },
    { name: 'O₃', value: rt.air_quality.o3, max: 180, unit: 'µg/m³' },
    { name: 'NO₂', value: rt.air_quality.no2, max: 100, unit: 'ppb' },
    { name: 'SO₂', value: rt.air_quality.so2, max: 80, unit: 'ppb' },
    { name: 'CO', value: rt.air_quality.co, max: 5, unit: 'mg/m³' },
  ];

  // 逐时 AQI
  const hourlyAqi: number[] = hourly.air_quality.aqi.slice(0, 24).map(item => item.value.chn);

  // 逐时湿度 (0-1 → %)
  const hourlyHumidity: number[] = hourly.humidity.slice(0, 24).map(item => Math.round(item.value * 100));

  return {
    location: {
      city,
      lat: formatCoord(lat, 'N', 'S'),
      lon: formatCoord(lon, 'E', 'W'),
    },
    current,
    sun,
    hourly: hourlyForecast,
    daily: dailyForecast,
    aqiPollutants,
    hourlyAqi,
    hourlyHumidity,
  };
}

function formatCoord(val: number, pos: string, neg: string): string {
  const abs = Math.abs(val);
  const deg = Math.floor(abs);
  const min = Math.floor((abs - deg) * 60);
  const dir = val >= 0 ? pos : neg;
  return `${deg}°${min}′${dir}`;
}

// ============================================================
// 自定义后端 API 响应类型 (http://192.168.5.2:8002/weather/comprehensive)
// ============================================================

export interface BackendWeatherResponse {
  ip: string;
  location: {
    city: string;
    district: string;
    latitude: string;
    longitude: string;
    address: string;
  };
  realtime_weather: {
    temperature: number;
    humidity: number;
    weather_condition: CaiyunSkycon;
    wind_direction: number;
    wind_speed: number;
    pressure: number;
    visibility: number;
    cloud_rate: number;
    apparent_temperature: number;
    precipitation: {
      local: { status: string; datasource: string; intensity: number };
      nearest: { status: string; distance: number; intensity: number };
    };
  };
  air_quality: {
    aqi: { chn: number; usa: number };
    pm25: number;
    pm10: number;
    o3: number;
    so2: number;
    no2: number;
    co: number;
    description: { chn: string; usa: string };
  };
  life_index: {
    ultraviolet: { index: number; desc: string };
    comfort: { index: number; desc: string };
  };
  hourly_forecast: {
    temperature: { datetime: string; value: number }[];
    precipitation: { datetime: string; value: number; probability: number }[];
    humidity: { datetime: string; value: number }[];
    visibility: { datetime: string; value: number }[];
    wind_speed: { datetime: string; value: number }[];
    sky_condition: { datetime: string; value: CaiyunSkycon }[];
    cloud_rate: { datetime: string; value: number }[];
  };
  daily_forecast: {
    life_index: {
      ultraviolet: { date: string; index: string; desc: string }[];
      carWashing: { date: string; index: string; desc: string }[];
      dressing: { date: string; index: string; desc: string }[];
      comfort: { date: string; index: string; desc: string }[];
      coldRisk: { date: string; index: string; desc: string }[];
    };
  };
  record_id: number;
}

/** 将自定义后端响应映射为应用 WeatherData */
export function mapBackendToWeatherData(raw: BackendWeatherResponse): WeatherData {
  const rt = raw.realtime_weather;
  const aq = raw.air_quality;
  const hourly = raw.hourly_forecast;

  // 当前天气
  const { condition, icon } = skyconToCondition(rt.weather_condition);
  const aqiVal = aq.aqi.chn;
  const aqiLevel = getAqiLevel(aqiVal);
  const aqiColor = getAqiColor(aqiVal);

  const current: CurrentWeather = {
    temp: Math.round(rt.temperature),
    feelsLike: Math.round(rt.apparent_temperature),
    condition: [condition],
    wind: Math.round(rt.wind_speed * 3.6),
    windDir: windDegToDirection(rt.wind_direction),
    humidity: Math.round(rt.humidity * 100),
    uv: raw.life_index.ultraviolet.index,
    visibility: Math.round(rt.visibility),
    pressure: Math.round(rt.pressure / 100),
    dewPoint: Math.round(rt.temperature - (100 - rt.humidity * 100) / 5),
    aqi: aqiVal,
    aqiLevel,
    aqiColor,
    pm25: aq.pm25,
    pm10: aq.pm10,
    o3: aq.o3,
    no2: aq.no2,
    so2: aq.so2,
    co: aq.co,
  };

  // 日出日落 — 后端未提供，用默认值
  const sun: SunData = {
    sunrise: '06:00',
    sunset: '18:30',
    duration: '12小时30分',
    progress: 50,
  };

  // 逐时预报
  const hourlyForecast: HourlyForecast[] = hourly.temperature.slice(0, 24).map((item, i) => {
    const d = new Date(item.datetime);
    const h = d.getHours();
    const isNow = i === 0;
    const skyconItem = hourly.sky_condition?.[i];
    const sc = skyconToCondition(skyconItem?.value ?? rt.weather_condition);
    return {
      time: isNow ? '现在' : `${String(h).padStart(2, '0')}:00`,
      temp: Math.round(item.value),
      icon: sc.icon,
      isNow,
    };
  });

  // 每日预报 — 后端未提供每日温度/天气，基于逐时数据生成
  const dailyForecast = generateDailyFromHourly(hourly, rt.weather_condition);

  // 污染物
  const aqiPollutants: PollutantData[] = [
    { name: 'PM2.5', value: aq.pm25, max: 150, unit: 'µg/m³' },
    { name: 'PM10', value: aq.pm10, max: 250, unit: 'µg/m³' },
    { name: 'O₃', value: aq.o3, max: 180, unit: 'µg/m³' },
    { name: 'NO₂', value: aq.no2, max: 100, unit: 'ppb' },
    { name: 'SO₂', value: aq.so2, max: 80, unit: 'ppb' },
    { name: 'CO', value: aq.co, max: 5, unit: 'mg/m³' },
  ];

  // 逐时 AQI — 后端未提供，用当前 AQI 近似
  const hourlyAqi: number[] = Array.from({ length: 24 }, () => aqiVal);

  // 逐时湿度
  const hourlyHumidity: number[] = hourly.humidity.slice(0, 24).map(item =>
    Math.round(item.value * 100)
  );

  const lat = parseFloat(raw.location.latitude);
  const lon = parseFloat(raw.location.longitude);

  return {
    location: {
      city: raw.location.city + (raw.location.district ? ` ${raw.location.district}` : ''),
      lat: formatCoord(lat, 'N', 'S'),
      lon: formatCoord(lon, 'E', 'W'),
    },
    current,
    sun,
    hourly: hourlyForecast,
    daily: dailyForecast,
    aqiPollutants,
    hourlyAqi,
    hourlyHumidity,
  };
}

/** 从逐时数据生成每日预报 */
function generateDailyFromHourly(
  hourly: BackendWeatherResponse['hourly_forecast'],
  defaultCondition: CaiyunSkycon
): DailyForecast[] {
  const temps = hourly.temperature;
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dailyMap = new Map<string, { temps: number[]; skycon: CaiyunSkycon }>();

  for (const item of temps) {
    const dateKey = item.datetime.slice(0, 10);
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { temps: [], skycon: defaultCondition });
    }
    dailyMap.get(dateKey)!.temps.push(item.value);
    const scItem = hourly.sky_condition?.find((s) => s.datetime.startsWith(dateKey));
    if (scItem) {
      dailyMap.get(dateKey)!.skycon = scItem.value;
    }
  }

  const result: DailyForecast[] = [];
  let idx = 0;
  for (const [dateStr, data] of dailyMap) {
    if (result.length >= 7) break;
    const d = new Date(dateStr);
    const { condition, icon } = skyconToCondition(data.skycon);
    result.push({
      day: idx === 0 ? '今天' : weekdays[d.getDay()],
      date: `${weekdays[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}`,
      condition,
      icon,
      high: Math.round(Math.max(...data.temps)),
      low: Math.round(Math.min(...data.temps)),
      aqi: 0,
      highlight: idx === 0,
    });
    idx++;
  }

  return result;
}
