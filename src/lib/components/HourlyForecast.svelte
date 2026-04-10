<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js';
  import type { HourlyForecast } from '$lib/types/weather';

  let { hourly }: { hourly: HourlyForecast[] } = $props();

  let tempChartEl: HTMLCanvasElement;

  const safeHourly = $derived(hourly.length > 0 ? hourly : []);

  onMount(() => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const monoFont = { family: "'SF Mono', 'Space Mono', ui-monospace, monospace", size: 11 };
    const gridColor = dark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
    const tooltipBg = dark ? '#f5f5f7' : '#1d1d1f';
    const tickColor = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';

    const ctx = tempChartEl.getContext('2d')!;
    const tempGrad = ctx.createLinearGradient(0, 0, 0, 200);
    tempGrad.addColorStop(0, 'rgba(0, 113, 227, 0.12)');
    tempGrad.addColorStop(1, 'rgba(0, 113, 227, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: safeHourly.map(h => h.time),
        datasets: [{
          label: '温度 (°C)',
          data: safeHourly.map(h => h.temp),
          borderColor: '#0071e3',
          backgroundColor: tempGrad,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#0071e3',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
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
            cornerRadius: 8,
            displayColors: false,
            callbacks: { label: (ctx) => `${ctx.parsed.y}°C` }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 10 }, color: tickColor } },
          y: { grid: { color: gridColor }, ticks: { font: { size: 10 }, color: tickColor } }
        }
      }
    });
  });
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">天气预报</h2>
    <span class="section-subtitle">24小时</span>
  </div>
  <div class="chart-container">
    <canvas bind:this={tempChartEl}></canvas>
  </div>
  <div class="hourly-scroll">
    {#each safeHourly as h}
      <div class="hour-card" class:now={h.isNow}>
        <span class="hour-time">{h.time}</span>
        <span class="hour-icon">{h.icon}</span>
        <span class="hour-temp">{h.temp}°</span>
      </div>
    {/each}
  </div>
</section>
