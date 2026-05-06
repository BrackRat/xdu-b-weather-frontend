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

  const aqiLevels = [
    { label: '优', color: '#34c759' },
    { label: '良', color: '#ffcc00' },
    { label: '轻度', color: '#ff9500' },
    { label: '中度', color: '#ff3b30' },
    { label: '重度', color: '#af52de' },
    { label: '严重', color: '#7f1d1d' }
  ];

  const pollutantBreakpoints: Record<string, number[]> = {
    'PM2.5': [0, 35, 60, 115, 150, 250, 350, 500],
    PM10: [0, 50, 120, 250, 350, 420, 500, 600],
    'O₃': [0, 160, 200, 300, 400, 800, 1000, 1200],
    'NO₂': [0, 100, 200, 700, 1200, 2340, 3090, 3840],
    'SO₂': [0, 150, 500, 650, 800],
    CO: [0, 5, 10, 35, 60, 90, 120, 150]
  };

  const gauge = {
    cx: 60,
    cy: 60,
    r: 42,
    start: 135,
    span: 270,
    gap: 4
  };

  function polarPoint(angleDeg: number) {
    const angle = (angleDeg * Math.PI) / 180;
    return {
      x: gauge.cx + gauge.r * Math.cos(angle),
      y: gauge.cy + gauge.r * Math.sin(angle)
    };
  }

  function gaugeArc(startDeg: number, endDeg: number): string {
    const start = polarPoint(startDeg);
    const end = polarPoint(endDeg);
    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${gauge.r} ${gauge.r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  function aqiGaugeStroke(val: number): string {
    const pct = Math.max(0, Math.min(val / 500, 1));
    return gaugeArc(gauge.start, gauge.start + pct * gauge.span);
  }

  function getAqiGaugeColor(aqi: number): string {
    if (aqi <= 50) return '#34c759';
    if (aqi <= 100) return '#ffcc00';
    if (aqi <= 150) return '#ff9500';
    if (aqi <= 200) return '#ff3b30';
    if (aqi <= 300) return '#af52de';
    return '#7f1d1d';
  }

  function getPollutantLevel(name: string, value: number) {
    const points = pollutantBreakpoints[name] ?? [0, 50, 100, 150, 200, 300, 500];
    const max = points[points.length - 1];
    const bounded = Math.max(0, Math.min(value, max));
    let index = points.length - 2;

    for (let i = 0; i < points.length - 1; i += 1) {
      if (bounded <= points[i + 1]) {
        index = i;
        break;
      }
    }

    return {
      index,
      label: aqiLevels[Math.min(index, aqiLevels.length - 1)].label,
      color: aqiLevels[Math.min(index, aqiLevels.length - 1)].color,
      progress: (bounded - points[index]) / (points[index + 1] - points[index])
    };
  }

  function markerStyle(index: number, progress: number, color: string) {
    const segmentCount = aqiLevels.length;
    const boundedIndex = Math.min(index, segmentCount - 1);
    const boundedProgress = Math.max(0, Math.min(progress, 1));
    const position = ((boundedIndex + boundedProgress) / segmentCount) * 100;
    return `left:${position}%;background:${color}`;
  }

  function formatValue(value: number): string {
    return value < 2 ? value.toFixed(1) : String(Math.round(value));
  }
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">空气质量</h2>
    <span class="section-subtitle">{current.aqiLevel}</span>
  </div>
  <div class="aqi-card">
    <div class="aqi-gauge-row">
      <div class="gauge-wrap">
        <svg viewBox="0 0 120 120" class="gauge-svg">
          <path d={aqiGaugeStroke(500)} fill="none" stroke="var(--aqi-muted-track)" stroke-width="8" stroke-linecap="round"/>
          <path d={aqiGaugeStroke(current.aqi)} fill="none" stroke={getAqiGaugeColor(current.aqi)} stroke-width="8" stroke-linecap="round"/>
          <text x="60" y="65" text-anchor="middle" class="gauge-val">{current.aqi}</text>
        </svg>
        <span class="gauge-lbl">{current.aqiLevel}</span>
      </div>
      <div class="aqi-pollutant-list">
        {#each pollutants as p}
          {@const level = getPollutantLevel(p.name, p.value)}
          <div class="aqi-p-item">
            <span class="aqi-p-label">{pollutantLabels[p.name] ?? p.name}</span>
            <div class="aqi-p-bar-track" aria-label={`${p.name} ${level.label}`}>
              {#each aqiLevels as segment, i}
                <span class="aqi-p-segment" style="background:{i <= level.index ? segment.color : 'var(--aqi-muted-track)'}"></span>
              {/each}
              <span class="aqi-p-marker" style={markerStyle(level.index, level.progress, level.color)}></span>
            </div>
            <span class="aqi-p-status" style="color:{level.color}">{level.label}</span>
            <span class="aqi-p-val">{formatValue(p.value)}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
