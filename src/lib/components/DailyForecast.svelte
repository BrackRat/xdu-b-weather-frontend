<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js';
  import type { DailyForecast } from '$lib/types/weather';

  let { daily }: { daily: DailyForecast[] } = $props();

  let dailyChartEl: HTMLCanvasElement;

  const minTemp = $derived(Math.min(...daily.map(d => d.low)));
  const maxTemp = $derived(Math.max(...daily.map(d => d.high)));
  const range = $derived(maxTemp - minTemp || 1);

  function barStyle(low: number, high: number): string {
    const left = `${((low - minTemp) / range) * 100}%`;
    const width = `${Math.max(((high - minTemp) / range) * 100 - ((low - minTemp) / range) * 100, 5)}%`;
    return `left:${left};width:${width}`;
  }

  function aqiColor(aqi: number): string {
    if (aqi > 100) return '#c0392b';
    if (aqi > 50) return '#e6a017';
    return '#27ae60';
  }

  onMount(() => {
    const monoFont = { family: "'Space Mono', monospace", size: 10 };
    const gridColor = 'rgba(0,0,0,0.06)';
    const tooltipBg = '#0a0a0a';

    const ctx = dailyChartEl.getContext('2d')!;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: daily.map(d => d.day),
        datasets: [
          {
            label: '最低温',
            data: daily.map(d => d.low),
            backgroundColor: 'rgba(52,152,219,0.6)',
            borderRadius: 2,
            barPercentage: 0.5,
            categoryPercentage: 0.7
          },
          {
            label: '最高温',
            data: daily.map(d => d.high),
            backgroundColor: 'rgba(230,160,23,0.7)',
            borderRadius: 2,
            barPercentage: 0.5,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: { boxWidth: 10, boxHeight: 10, font: { size: 9 }, padding: 8 }
          },
          tooltip: {
            backgroundColor: tooltipBg,
            titleFont: monoFont,
            bodyFont: monoFont,
            padding: 10,
            cornerRadius: 0,
            callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}°C` }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: {
            grid: { color: gridColor },
            ticks: { font: { size: 9 }, callback: (v) => `${v}°` },
            suggestedMin: 5, suggestedMax: 30
          }
        }
      }
    });
  });
</script>

<section class="daily-section">
  <div class="section-header">
    <h2 class="section-title">一周预报</h2>
    <div class="section-tags"><span>7天</span><span>趋势</span></div>
  </div>
  <div class="daily-list">
    {#each daily as d}
      <div class="day-row" class:highlight={d.highlight}>
        <div>
          <span class="day-name">{d.day}</span>
          <span class="day-date">{d.date}</span>
        </div>
        <span class="day-condition">{d.condition}</span>
        <span class="day-icon">{d.icon}</span>
        <div class="day-range">
          <span class="day-low">{d.low}°</span>
          <span class="day-bar"><span class="day-bar-fill" style={barStyle(d.low, d.high)}></span></span>
          <span class="day-high">{d.high}°</span>
        </div>
        <span class="day-aqi" style="color:{aqiColor(d.aqi)}">{d.aqi}</span>
      </div>
    {/each}
  </div>
  <div class="chart-container chart-container-tall">
    <canvas bind:this={dailyChartEl}></canvas>
  </div>
</section>
