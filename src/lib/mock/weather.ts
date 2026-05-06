import type { AqiLevel, CurrentWeather, DailyForecast, HourlyForecast, PollutantData, WeatherData } from '$lib/types/weather';
import { getAqiColor, getAqiLevel } from '$lib/types/weather';

type ScenarioConfig = {
	location: WeatherData['location'];
	current: Omit<CurrentWeather, 'aqiLevel' | 'aqiColor'>;
	forecastKeypoint: string;
	sun: WeatherData['sun'];
	hourlyTemps: number[];
	hourlyHumidity: number[];
	hourlyIcons: string[];
	daily: DailyForecast[];
	hourlyAqi: number[];
};

const hours = [
	'现在', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
	'22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
	'06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'
];

function makeHourly(temps: number[], icons: string[]): HourlyForecast[] {
	return hours.map((time, i) => ({
		time,
		temp: temps[i] ?? temps[temps.length - 1],
		icon: icons[i] ?? icons[icons.length - 1],
		isNow: i === 0
	}));
}

function pollutants(current: ScenarioConfig['current']): PollutantData[] {
	return [
		{ name: 'PM2.5', value: current.pm25, max: 500, unit: 'µg/m³' },
		{ name: 'PM10', value: current.pm10, max: 600, unit: 'µg/m³' },
		{ name: 'O₃', value: current.o3, max: 1200, unit: 'µg/m³' },
		{ name: 'NO₂', value: current.no2, max: 3840, unit: 'µg/m³' },
		{ name: 'SO₂', value: current.so2, max: 800, unit: 'µg/m³' },
		{ name: 'CO', value: current.co, max: 150, unit: 'mg/m³' }
	];
}

function withAqiMeta(current: ScenarioConfig['current']): CurrentWeather {
	return {
		...current,
		aqiLevel: getAqiLevel(current.aqi) as AqiLevel,
		aqiColor: getAqiColor(current.aqi)
	};
}

function makeWeatherData(config: ScenarioConfig): WeatherData {
	return {
		location: config.location,
		current: withAqiMeta(config.current),
		forecastKeypoint: config.forecastKeypoint,
		sun: config.sun,
		hourly: makeHourly(config.hourlyTemps, config.hourlyIcons),
		daily: config.daily,
		aqiPollutants: pollutants(config.current),
		hourlyAqi: config.hourlyAqi,
		hourlyHumidity: config.hourlyHumidity
	};
}

const normalData = makeWeatherData({
	location: { city: '西安 雁塔区', lat: '34°13′N', lon: '108°56′E' },
	current: {
		temp: 24,
		feelsLike: 23,
		condition: ['多云'],
		icon: '⛅',
		wind: 10,
		windDir: '东北',
		humidity: 54,
		uv: 5,
		visibility: 18,
		pressure: 1012,
		dewPoint: 14,
		aqi: 62,
		pm25: 28,
		pm10: 55,
		o3: 92,
		no2: 34,
		so2: 7,
		co: 0.6
	},
	forecastKeypoint: '云量午后增多，体感舒适，空气质量整体可接受。',
	sun: { sunrise: '06:12', sunset: '19:45', duration: '13小时33分', progress: 68 },
	hourlyTemps: [24, 25, 26, 26, 25, 23, 21, 20, 19, 18, 17, 17, 16, 16, 15, 15, 16, 18, 20, 22, 24, 26, 27, 27],
	hourlyHumidity: [54, 52, 50, 49, 51, 55, 58, 61, 64, 66, 68, 70, 71, 72, 72, 70, 68, 64, 60, 56, 52, 48, 46, 45],
	hourlyIcons: ['⛅', '⛅', '☀️', '☀️', '⛅', '⛅', '☁️', '☁️', '☁️', '🌙', '🌙', '🌙', '🌙', '🌙', '☁️', '☁️', '🌅', '⛅', '⛅', '☀️', '☀️', '☀️', '⛅', '⛅'],
	daily: [
		{ day: '今天', date: '周三 06', condition: '多云', icon: '⛅', high: 27, low: 16, aqi: 62, highlight: true },
		{ day: '周四', date: '周四 07', condition: '晴', icon: '☀️', high: 29, low: 17, aqi: 58 },
		{ day: '周五', date: '周五 08', condition: '阴', icon: '☁️', high: 24, low: 15, aqi: 76 }
	],
	hourlyAqi: [58, 60, 62, 65, 68, 70, 72, 70, 68, 64, 60, 58, 55, 52, 50, 48, 50, 54, 58, 62, 66, 68, 65, 62]
});

const heavyPollutionData = makeWeatherData({
	location: { city: '西安 高新区', lat: '34°12′N', lon: '108°53′E' },
	current: {
		temp: 29,
		feelsLike: 34,
		condition: ['重度雾霾'],
		icon: '🌫️',
		wind: 2,
		windDir: '南',
		humidity: 78,
		uv: 1,
		visibility: 1,
		pressure: 1006,
		dewPoint: 24,
		aqi: 286,
		pm25: 236,
		pm10: 520,
		o3: 260,
		no2: 840,
		so2: 320,
		co: 3.4
	},
	forecastKeypoint: '静稳高湿，污染物扩散条件差，夜间至明早仍维持重污染。',
	sun: { sunrise: '06:16', sunset: '19:39', duration: '13小时23分', progress: 42 },
	hourlyTemps: [29, 30, 31, 30, 29, 28, 27, 27, 26, 26, 25, 25, 24, 24, 24, 23, 24, 25, 27, 29, 31, 32, 32, 31],
	hourlyHumidity: [78, 80, 82, 84, 86, 88, 90, 91, 92, 92, 91, 90, 89, 88, 87, 86, 84, 82, 80, 78, 76, 74, 72, 70],
	hourlyIcons: Array.from({ length: 24 }, () => '🌫️'),
	daily: [
		{ day: '今天', date: '周三 06', condition: '重度雾霾', icon: '🌫️', high: 32, low: 24, aqi: 286, highlight: true },
		{ day: '周四', date: '周四 07', condition: '霾', icon: '🌫️', high: 31, low: 23, aqi: 238 },
		{ day: '周五', date: '周五 08', condition: '小雨', icon: '🌧️', high: 26, low: 20, aqi: 118 }
	],
	hourlyAqi: [248, 258, 272, 286, 298, 310, 322, 330, 325, 316, 306, 296, 284, 270, 258, 248, 238, 230, 224, 220, 228, 240, 254, 268]
});

const coldData = makeWeatherData({
	location: { city: '哈尔滨 道里区', lat: '45°45′N', lon: '126°37′E' },
	current: {
		temp: -16,
		feelsLike: -27,
		condition: ['大雪'],
		icon: '🌨️',
		wind: 34,
		windDir: '北',
		humidity: 69,
		uv: 1,
		visibility: 2,
		pressure: 1034,
		dewPoint: -20,
		aqi: 38,
		pm25: 14,
		pm10: 26,
		o3: 40,
		no2: 22,
		so2: 6,
		co: 0.4
	},
	forecastKeypoint: '强冷空气影响，阵雪伴随大风，户外体感显著低于气温。',
	sun: { sunrise: '07:04', sunset: '16:12', duration: '9小时08分', progress: 35 },
	hourlyTemps: [-16, -17, -18, -19, -20, -21, -22, -23, -23, -24, -24, -25, -25, -26, -26, -25, -24, -22, -20, -18, -16, -15, -15, -16],
	hourlyHumidity: [69, 70, 71, 72, 73, 74, 75, 76, 76, 75, 74, 73, 72, 71, 70, 69, 68, 66, 64, 62, 60, 59, 60, 62],
	hourlyIcons: ['🌨️', '🌨️', '🌨️', '🌨️', '🌨️', '☁️', '☁️', '☁️', '🌙', '🌙', '🌙', '🌙', '🌙', '☁️', '☁️', '☁️', '🌅', '🌨️', '🌨️', '☁️', '☁️', '☁️', '🌨️', '🌨️'],
	daily: [
		{ day: '今天', date: '周三 06', condition: '大雪', icon: '🌨️', high: -15, low: -26, aqi: 38, highlight: true },
		{ day: '周四', date: '周四 07', condition: '阴', icon: '☁️', high: -12, low: -24, aqi: 42 },
		{ day: '周五', date: '周五 08', condition: '晴', icon: '☀️', high: -8, low: -21, aqi: 35 }
	],
	hourlyAqi: [38, 40, 42, 44, 45, 43, 40, 38, 36, 35, 34, 33, 32, 31, 30, 31, 32, 34, 36, 38, 40, 42, 41, 39]
});

const rainData = makeWeatherData({
	location: { city: '广州 天河区', lat: '23°07′N', lon: '113°21′E' },
	current: {
		temp: 22,
		feelsLike: 25,
		condition: ['暴雨'],
		icon: '⛈️',
		wind: 42,
		windDir: '东南',
		humidity: 96,
		uv: 0,
		visibility: 3,
		pressure: 996,
		dewPoint: 21,
		aqi: 28,
		pm25: 8,
		pm10: 16,
		o3: 30,
		no2: 18,
		so2: 4,
		co: 0.3
	},
	forecastKeypoint: '强降雨持续，傍晚后雨势减弱，短时阵风和低能见度仍需注意。',
	sun: { sunrise: '05:48', sunset: '19:02', duration: '13小时14分', progress: 50 },
	hourlyTemps: [22, 22, 21, 21, 21, 20, 20, 20, 20, 20, 19, 19, 19, 19, 20, 20, 21, 22, 23, 24, 25, 25, 24, 23],
	hourlyHumidity: [96, 97, 98, 98, 99, 99, 98, 98, 97, 96, 95, 94, 94, 93, 92, 91, 90, 88, 86, 84, 82, 80, 82, 86],
	hourlyIcons: ['⛈️', '⛈️', '⛈️', '🌧️', '🌧️', '🌧️', '🌧️', '🌧️', '🌧️', '🌧️', '☁️', '☁️', '☁️', '🌙', '☁️', '☁️', '🌧️', '🌧️', '⛅', '⛅', '⛅', '☀️', '⛅', '☁️'],
	daily: [
		{ day: '今天', date: '周三 06', condition: '暴雨', icon: '⛈️', high: 25, low: 19, aqi: 28, highlight: true },
		{ day: '周四', date: '周四 07', condition: '中雨', icon: '🌧️', high: 27, low: 21, aqi: 35 },
		{ day: '周五', date: '周五 08', condition: '多云', icon: '⛅', high: 31, low: 23, aqi: 52 }
	],
	hourlyAqi: [28, 26, 24, 22, 20, 19, 18, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 42, 38, 34]
});

export const mockDataMap: Record<string, WeatherData> = {
	normal: normalData,
	'heavy-pollution': heavyPollutionData,
	cold: coldData,
	rain: rainData
};
