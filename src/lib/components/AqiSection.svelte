<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartData, type ChartOptions } from 'chart.js';
  import type { CurrentWeather, PollutantData, HourlyForecast } from '$lib/types/weather';

  let {
    current,
    pollutants,
    hourlyAqi,
    hourly
  }: {
    current: CurrentWeather;
    pollutants: PollutantData[];
    hourlyAqi: number[];
    hourly: HourlyForecast[];
  } = $props();

  let aqiChartEl: HTMLCanvasElement;
  let aqiChart: Chart<'line', number[], string> | null = null;

  const monoFont = { family: "'Space Mono', monospace", size: 10 };
  const gridColor = 'rgba(0,0,0,0.06)';
  const tooltipBg = '#0a0a0a';

  function aqiGaugeStroke(val: number, maxVal: number = 300, r: number = 52, cx: number = 60, cy: number = 60): string {
    const pct = Math.min(val / maxVal, 1);
    const angle = Math.PI * 0.75 + pct * Math.PI * 1.5;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const startX = cx + r * Math.cos(Math.PI * 0.75);
    const startY = cy + r * Math.sin(Math.PI * 0.75);
    const largeArc = pct > 0.5 ? 1 : 0;
    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`;
  }

  function getChartData(ctx: CanvasRenderingContext2D): ChartData<'line', number[], string> {
    const aqiGrad = ctx.createLinearGradient(0, 0, 0, 200);
    aqiGrad.addColorStop(0, 'rgba(230,160,23,0.2)');
    aqiGrad.addColorStop(1, 'rgba(230,160,23,0)');

    return {
      labels: hourly.map((h) => h.time),
      datasets: [{
        label: 'AQI',
        data: hourlyAqi,
        borderColor: '#e6a017',
        backgroundColor: aqiGrad,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#e6a017',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }]
    };
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleFont: monoFont,
        bodyFont: monoFont,
        padding: 10,
        cornerRadius: 0,
        displayColors: false,
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y ?? 0;
            let level = '优';
            if (v > 200) level = '重度污染';
            else if (v > 150) level = '中度污染';
            else if (v > 100) level = '轻度污染';
            else if (v > 50) level = '良';
            return `AQI ${v} (${level})`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 9 } } },
      y: {
        grid: { color: gridColor },
        ticks: { font: { size: 9 } },
        suggestedMin: 0,
        suggestedMax: 150
      }
    }
  };

  onMount(() => {
    const ctx = aqiChartEl.getContext('2d')!;
    aqiChart = new Chart(ctx, {
      type: 'line',
      data: getChartData(ctx),
      options: chartOptions
    });

    return () => {
      aqiChart?.destroy();
      aqiChart = null;
    };
  });

  $effect(() => {
    if (!aqiChart) return;
    const ctx = aqiChartEl.getContext('2d');
    if (!ctx) return;
    aqiChart.data = getChartData(ctx);
    aqiChart.update();
  });
</script>

<section class="aqi-hero-section">
  <div class="section-header">
    <h2 class="section-title">空气质量</h2>
    <div class="section-tags"><span>污染物</span><span>健康</span><span>指数</span></div>
  </div>
  <div class="aqi-hero-grid">
    <!-- AQI 仪表盘 -->
    <div class="aqi-gauge-card">
      <svg viewBox="0 0 120 120" class="gauge-svg">
        <path d={aqiGaugeStroke(300, 300, 52, 60, 60)} fill="none" stroke="#e8e8e3" stroke-width="10" stroke-linecap="round"/>
        <path d={aqiGaugeStroke(50, 300, 52, 60, 60)} fill="none" stroke="#27ae60" stroke-width="10" stroke-linecap="round"/>
        <path d="M {60 + 52*Math.cos(Math.PI*0.75 + 50/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 50/300*Math.PI*1.5)} A 52 52 0 0 1 {60 + 52*Math.cos(Math.PI*0.75 + 100/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 100/300*Math.PI*1.5)}" fill="none" stroke="#f1c40f" stroke-width="10" stroke-linecap="round"/>
        <path d="M {60 + 52*Math.cos(Math.PI*0.75 + 100/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 100/300*Math.PI*1.5)} A 52 52 0 0 1 {60 + 52*Math.cos(Math.PI*0.75 + 150/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 150/300*Math.PI*1.5)}" fill="none" stroke="#e67e22" stroke-width="10" stroke-linecap="round"/>
        <path d="M {60 + 52*Math.cos(Math.PI*0.75 + 150/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 150/300*Math.PI*1.5)} A 52 52 0 0 1 {60 + 52*Math.cos(Math.PI*0.75 + 200/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 200/300*Math.PI*1.5)}" fill="none" stroke="#e74c3c" stroke-width="10" stroke-linecap="round"/>
        <path d="M {60 + 52*Math.cos(Math.PI*0.75 + 200/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 200/300*Math.PI*1.5)} A 52 52 0 0 1 {60 + 52*Math.cos(Math.PI*0.75 + 300/300*Math.PI*1.5)} {60 + 52*Math.sin(Math.PI*0.75 + 300/300*Math.PI*1.5)}" fill="none" stroke="#8e44ad" stroke-width="10" stroke-linecap="round"/>
        <path d={aqiGaugeStroke(current.aqi, 300, 52, 60, 60)} fill="none" stroke="#0a0a0a" stroke-width="10" stroke-linecap="round"/>
        <text x="60" y="56" text-anchor="middle" class="gauge-val" style="fill:#0a0a0a">{current.aqi}</text>
        <text x="60" y="74" text-anchor="middle" class="gauge-lbl">{current.aqiLevel}</text>
      </svg>
      <div class="gauge-footer">
        <span class="gauge-scale">0 · 50 · 100 · 150 · 200 · 300+</span>
      </div>
    </div>

    <!-- 污染物详情 -->
    <div class="pollutant-card">
      <div class="pollutant-header">
        <span class="pollutant-title">污染物分布</span>
        <span class="pollutant-sub">实时浓度</span>
      </div>
      <div class="pollutant-list">
        {#each pollutants as p}
          <div class="pollutant-row">
            <span class="p-name">{p.name}</span>
            <div class="p-bar-track">
              <div class="p-bar-fill" style="width:{Math.min(p.value/p.max*100,100)}%"></div>
            </div>
            <span class="p-val">{typeof p.value === 'number' && p.value < 2 ? p.value.toFixed(1) : p.value}<small>{p.unit}</small></span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- AQI 24小时趋势 -->
  <div class="aqi-trend-wrap">
    <div class="section-header" style="margin-top:24px">
      <h3 class="section-title" style="font-size:24px">AQI 趋势</h3>
      <div class="section-tags"><span>24小时</span></div>
    </div>
    <div class="chart-container">
      <canvas bind:this={aqiChartEl}></canvas>
    </div>
  </div>
</section>
