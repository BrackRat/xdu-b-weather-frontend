<script lang="ts">
  import type { DailyForecast } from '$lib/types/weather';

  let { daily }: { daily: DailyForecast[] } = $props();

  const safeDaily = $derived(daily.length > 0 ? daily : []);
  const minTemp = $derived(safeDaily.length > 0 ? Math.min(...safeDaily.map(d => d.low)) : 0);
  const maxTemp = $derived(safeDaily.length > 0 ? Math.max(...safeDaily.map(d => d.high)) : 30);
  const range = $derived(maxTemp - minTemp || 1);

  function barStyle(low: number, high: number): string {
    const left = `${((low - minTemp) / range) * 100}%`;
    const width = `${Math.max(((high - minTemp) / range) * 100 - ((low - minTemp) / range) * 100, 5)}%`;
    return `left:${left};width:${width}`;
  }

  function tempColor(temp: number): string {
    if (temp <= 0) return '#5ac8fa';
    if (temp <= 10) return '#64d2ff';
    if (temp <= 20) return '#34c759';
    if (temp <= 30) return '#ff9f0a';
    return '#ff3b30';
  }

  function aqiColor(aqi: number): string {
    if (aqi > 100) return '#ff3b30';
    if (aqi > 50) return '#ff9f0a';
    return '#34c759';
  }
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">一周预报</h2>
    <span class="section-subtitle">7天</span>
  </div>
  <div class="daily-list">
    {#each safeDaily as d}
      <div class="day-row" class:highlight={d.highlight}>
        <div class="day-left">
          <span class="day-name">{d.day}</span>
          <span class="day-date">{d.date}</span>
        </div>
        <span class="day-icon">{d.icon}</span>
        <div class="day-range">
          <span class="day-low">{d.low}°</span>
          <span class="day-bar"><span class="day-bar-fill" style="{barStyle(d.low, d.high)};background:linear-gradient(90deg, {tempColor(d.low)}, {tempColor(d.high)})"></span></span>
          <span class="day-high">{d.high}°</span>
        </div>
        <span class="day-aqi" style="color:{aqiColor(d.aqi)}">{d.aqi}</span>
      </div>
    {/each}
  </div>
</section>
