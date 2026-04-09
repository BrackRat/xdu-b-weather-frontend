<script lang="ts">
  import type { CurrentWeather } from '$lib/types/weather';

  let { current }: { current: CurrentWeather } = $props();
</script>

<div class="stats-grid">
  <div class="stat-card">
    <span class="stat-label">风速</span>
    <span class="stat-value">{current.wind}</span>
    <span class="stat-unit">km/h {current.windDir}</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">湿度</span>
    <span class="stat-value">{current.humidity}<span style="font-size:16px;font-weight:400;color:var(--text-secondary)">%</span></span>
    <span class="stat-unit">平均</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">紫外线</span>
    <span class="stat-value">{current.uv}</span>
    <span class="stat-unit">中等</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">AQI</span>
    <span class="stat-value" style="color:{current.aqiColor}">{current.aqi}</span>
    <span class="stat-unit">{current.aqiLevel}</span>
  </div>
</div>
