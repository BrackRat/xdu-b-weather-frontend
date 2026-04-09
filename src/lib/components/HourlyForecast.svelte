<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js';
  import type { HourlyForecast } from '$lib/types/weather';

  let { hourly }: { hourly: HourlyForecast[] } = $props();

  let tempChartEl: HTMLCanvasElement;

  onMount(() => {
    const monoFont = { family: "'Space Mono', monospace", size: 10 };
    const gridColor = 'rgba(0,0,0,0.06)';
    const tooltipBg = '#0a0a0a';

    const ctx = tempChartEl.getContext('2d')!;
    const tempGrad = ctx.createLinearGradient(0, 0, 0, 200);
    tempGrad.addColorStop(0, 'rgba(255,255,0,0.25)');
    tempGrad.addColorStop(1, 'rgba(255,255,0,0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: hourly.map(h => h.time),
        datasets: [{
          label: '温度 (°C)',
          data: hourly.map(h => h.temp),
          borderColor: '#0a0a0a',
          backgroundColor: tempGrad,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#FFFF00',
          pointHoverBorderColor: '#0a0a0a',
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
            cornerRadius: 0,
            displayColors: false,
            callbacks: { label: (ctx) => `${ctx.parsed.y}°C` }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 9 } } },
          y: { grid: { color: gridColor }, ticks: { font: { size: 9 } } }
        }
      }
    });
  });
</script>

<section class="hourly-section">
  <div class="section-header">
    <h2 class="section-title">天气预报</h2>
    <div class="section-tags"><span>24小时</span><span>逐时</span></div>
  </div>
  <div class="chart-container">
    <canvas bind:this={tempChartEl}></canvas>
  </div>
  <div class="hourly-scroll">
    {#each hourly as h}
      <div class="hour-card" class:now={h.isNow}>
        <span class="hour-time">{h.time}</span>
        <span class="hour-icon">{h.icon}</span>
        <span class="hour-temp">{h.temp}°</span>
      </div>
    {/each}
  </div>
</section>
