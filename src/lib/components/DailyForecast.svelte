<script lang="ts">
  import type { DailyForecast } from '$lib/types/weather';
  import WeatherIcon from './WeatherIcon.svelte';

  let { daily }: { daily: DailyForecast[] } = $props();

  const safeDaily = $derived(daily.length > 0 ? daily.slice(0, 3) : []);
  const minTemp = $derived(safeDaily.length > 0 ? Math.min(...safeDaily.map(d => d.low)) : 0);
  const maxTemp = $derived(safeDaily.length > 0 ? Math.max(...safeDaily.map(d => d.high)) : 30);
  const range = $derived(maxTemp - minTemp || 1);
  const tempThresholds = [-10, 0, 10, 20, 26, 32, 38];

  function barStyle(low: number, high: number): string {
    const left = `${((low - minTemp) / range) * 100}%`;
    const width = `${Math.max(((high - minTemp) / range) * 100 - ((low - minTemp) / range) * 100, 5)}%`;
    return `left:${left};width:${width};background:${tempBandBackground(low, high)}`;
  }

  function tempColor(temp: number): string {
    if (temp < -10) return '#5e5ce6';
    if (temp < 0) return '#32ade6';
    if (temp < 10) return '#64d2ff';
    if (temp < 20) return '#34c759';
    if (temp < 26) return '#ffd60a';
    if (temp < 32) return '#ff9f0a';
    return '#ff453a';
  }

  function tempBandBackground(low: number, high: number): string {
    if (high <= low) return tempColor(high);

    const cuts = [low, ...tempThresholds.filter((t) => t > low && t < high), high];
    const stops: string[] = [];

    for (let i = 0; i < cuts.length - 1; i += 1) {
      const start = cuts[i];
      const end = cuts[i + 1];
      const color = tempColor((start + end) / 2);
      const startPct = ((start - low) / (high - low)) * 100;
      const endPct = ((end - low) / (high - low)) * 100;
      stops.push(`${color} ${startPct.toFixed(2)}%`, `${color} ${endPct.toFixed(2)}%`);
    }

    return `linear-gradient(90deg, ${stops.join(', ')})`;
  }

  function aqiColor(aqi: number): string {
    if (aqi > 100) return '#ff3b30';
    if (aqi > 50) return '#ff9f0a';
    return '#34c759';
  }
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">3 天预报</h2>
    <span class="section-subtitle">未来3天</span>
  </div>
  <div class="daily-list">
    {#each safeDaily as d}
      <div class="day-row" class:highlight={d.highlight}>
        <div class="day-left">
          <span class="day-name">{d.day}</span>
          <span class="day-date">{d.date}</span>
        </div>
        <span class="day-icon"><WeatherIcon condition={d.condition} class="forecast-icon" /></span>
        <div class="day-range">
          <span class="day-low">{d.low}°</span>
          <span class="day-bar"><span class="day-bar-fill" style={barStyle(d.low, d.high)}></span></span>
          <span class="day-high">{d.high}°</span>
        </div>
        <span class="day-aqi" style="color:{aqiColor(d.aqi)}">{d.aqi}</span>
      </div>
    {/each}
  </div>
</section>
