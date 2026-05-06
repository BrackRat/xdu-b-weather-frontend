import { expect, test } from '@playwright/test';

test('has expected h1', async ({ page }) => {
	await page.goto('/demo/playwright');
	await expect(page.locator('h1')).toBeVisible();
});

test('renders the weather dashboard from the backend response', async ({ page }) => {
	await page.route('**/weather/comprehensive', async (route) => {
		await route.fulfill({
			contentType: 'application/json',
			body: JSON.stringify({
				ip: '127.0.0.1',
				location: {
					city: '西安',
					district: '雁塔区',
					latitude: '34.222',
					longitude: '108.948',
					address: '陕西省西安市雁塔区'
				},
				realtime_weather: {
					temperature: 23,
					humidity: 0.58,
					weather_condition: 'LIGHT_HAZE',
					wind_direction: 45,
					wind_speed: 3.5,
					pressure: 101300,
					visibility: 16,
					cloud_rate: 0.4,
					apparent_temperature: 21,
					precipitation: {
						local: { status: 'ok', datasource: 'mock', intensity: 0 },
						nearest: { status: 'ok', distance: 0, intensity: 0 }
					}
				},
				air_quality: {
					aqi: { chn: 82, usa: 76 },
					pm25: 34,
					pm10: 58,
					o3: 68,
					so2: 8,
					no2: 32,
					co: 0.6,
					description: { chn: '良', usa: 'Moderate' }
				},
				life_index: {
					ultraviolet: { index: 5, desc: '中等' },
					comfort: { index: 0, desc: '舒适' }
				},
				hourly_forecast: {
					temperature: Array.from({ length: 24 }, (_, i) => ({
						datetime: `2026-04-07T${String(i).padStart(2, '0')}:00:00+08:00`,
						value: 12 + i / 2
					})),
					precipitation: Array.from({ length: 24 }, (_, i) => ({
						datetime: `2026-04-07T${String(i).padStart(2, '0')}:00:00+08:00`,
						value: 0,
						probability: 0
					})),
					humidity: Array.from({ length: 24 }, (_, i) => ({
						datetime: `2026-04-07T${String(i).padStart(2, '0')}:00:00+08:00`,
						value: 0.4 + i * 0.01
					})),
					visibility: Array.from({ length: 24 }, (_, i) => ({
						datetime: `2026-04-07T${String(i).padStart(2, '0')}:00:00+08:00`,
						value: 16
					})),
					wind_speed: Array.from({ length: 24 }, (_, i) => ({
						datetime: `2026-04-07T${String(i).padStart(2, '0')}:00:00+08:00`,
						value: 3.5
					})),
					sky_condition: Array.from({ length: 24 }, (_, i) => ({
						datetime: `2026-04-07T${String(i).padStart(2, '0')}:00:00+08:00`,
						value: 'LIGHT_HAZE'
					})),
					cloud_rate: Array.from({ length: 24 }, (_, i) => ({
						datetime: `2026-04-07T${String(i).padStart(2, '0')}:00:00+08:00`,
						value: 0.4
					}))
				},
				daily_forecast: {
					life_index: {
						ultraviolet: [],
						carWashing: [],
						dressing: [],
						comfort: [],
						coldRisk: []
					}
				},
				forecast_keypoint: '小雨，今天傍晚18点钟后雨停，转阴',
				record_id: 1
			})
		});
	});

	await page.goto('/');
	await expect(page.getByText('西安 雁塔区')).toBeVisible();
	await expect(page.locator('.condition-main').getByText('轻度雾霾')).toBeVisible();
	await expect(page.getByText('小雨，今天傍晚18点钟后雨停，转阴')).toBeVisible();
	await expect(page.getByText('空气质量')).toBeVisible();
	await expect(page.getByRole('button', { name: '重试' })).toHaveCount(0);
});

test('renders selected local mock scenario without calling live weather', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('weather_dataMode', JSON.stringify('mock'));
		localStorage.setItem('weather_mockScenario', JSON.stringify('heavy-pollution'));
		localStorage.setItem('weather_mockLat', JSON.stringify(null));
		localStorage.setItem('weather_mockLon', JSON.stringify(null));
	});

	await page.goto('/');

	await expect(page.getByText('西安 高新区')).toBeVisible();
	await expect(page.locator('.gauge-val').getByText('286')).toBeVisible();
	await expect(page.locator('.section-subtitle').getByText('重度污染')).toBeVisible();
	await expect(page.getByText('静稳高湿，污染物扩散条件差，夜间至明早仍维持重污染。')).toBeVisible();
});
