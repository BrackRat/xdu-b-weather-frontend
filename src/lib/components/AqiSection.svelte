<script lang="ts">
  import type { CurrentWeather, PollutantData } from '$lib/types/weather';

  let {
    current,
    pollutants
  }: {
    current: CurrentWeather;
    pollutants: PollutantData[];
  } = $props();

  const pollutantLabels: Record<string, string> = {
    'PM2.5': 'PM2.5',
    'PM10': 'PM10',
    'O₃': 'O₃',
    'NO₂': 'NO₂',
    'SO₂': 'SO₂',
    'CO': 'CO'
  };

  function aqiGaugeStroke(val: number, maxVal: number = 300, r: number = 42, cx: number = 60, cy: number = 60): string {
    const pct = Math.min(val / maxVal, 1);
    const angle = Math.PI * 0.75 + pct * Math.PI * 1.5;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const startX = cx + r * Math.cos(Math.PI * 0.75);
    const startY = cy + r * Math.sin(Math.PI * 0.75);
    const largeArc = pct > 0.5 ? 1 : 0;
    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`;
  }

  function getAqiGaugeColor(aqi: number): string {
    if (aqi <= 50) return '#34c759';
    if (aqi <= 100) return '#ff9f0a';
    if (aqi <= 150) return '#ff9500';
    if (aqi <= 200) return '#ff3b30';
    if (aqi <= 300) return '#af52de';
    return '#8944ab';
  }
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">空气质量</h2>
    <span class="section-subtitle">{current.aqiLevel}</span>
  </div>
  <div class="aqi-card">
    <div class="aqi-gauge-row">
      <svg viewBox="0 0 120 120" class="gauge-svg">
        <path d={aqiGaugeStroke(300)} fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="8" stroke-linecap="round"/>
        <path d={aqiGaugeStroke(50)} fill="none" stroke="#34c759" stroke-width="8" stroke-linecap="round"/>
        <path d="M {60 + 42*Math.cos(Math.PI*0.75 + 50/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 50/300*Math.PI*1.5)} A 42 42 0 0 1 {60 + 42*Math.cos(Math.PI*0.75 + 100/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 100/300*Math.PI*1.5)}" fill="none" stroke="#ff9f0a" stroke-width="8" stroke-linecap="round"/>
        <path d="M {60 + 42*Math.cos(Math.PI*0.75 + 100/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 100/300*Math.PI*1.5)} A 42 42 0 0 1 {60 + 42*Math.cos(Math.PI*0.75 + 150/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 150/300*Math.PI*1.5)}" fill="none" stroke="#ff9500" stroke-width="8" stroke-linecap="round"/>
        <path d="M {60 + 42*Math.cos(Math.PI*0.75 + 150/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 150/300*Math.PI*1.5)} A 42 42 0 0 1 {60 + 42*Math.cos(Math.PI*0.75 + 200/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 200/300*Math.PI*1.5)}" fill="none" stroke="#ff3b30" stroke-width="8" stroke-linecap="round"/>
        <path d="M {60 + 42*Math.cos(Math.PI*0.75 + 200/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 200/300*Math.PI*1.5)} A 42 42 0 0 1 {60 + 42*Math.cos(Math.PI*0.75 + 300/300*Math.PI*1.5)} {60 + 42*Math.sin(Math.PI*0.75 + 300/300*Math.PI*1.5)}" fill="none" stroke="#af52de" stroke-width="8" stroke-linecap="round"/>
        <path d={aqiGaugeStroke(current.aqi)} fill="none" stroke={getAqiGaugeColor(current.aqi)} stroke-width="8" stroke-linecap="round"/>
        <text x="60" y="56" text-anchor="middle" class="gauge-val">{current.aqi}</text>
        <text x="60" y="72" text-anchor="middle" class="gauge-lbl">{current.aqiLevel}</text>
      </svg>
      <div class="aqi-pollutant-list">
        {#each pollutants as p}
          <div class="aqi-p-item">
            <span class="aqi-p-label">{pollutantLabels[p.name] ?? p.name}</span>
            <div class="aqi-p-bar-track">
              <div class="aqi-p-bar-fill" style="width:{Math.min(p.value/p.max*100,100)}%;background:{getAqiGaugeColor(current.aqi)}"></div>
            </div>
            <span class="aqi-p-val">{typeof p.value === 'number' && p.value < 2 ? p.value.toFixed(1) : p.value}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
