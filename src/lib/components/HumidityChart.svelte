<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartData, type ChartOptions } from 'chart.js';
  import type { HourlyForecast } from '$lib/types/weather';

  let {
    hourly,
    hourlyHumidity
  }: {
    hourly: HourlyForecast[];
    hourlyHumidity: number[];
  } = $props();

  let humiChartEl: HTMLCanvasElement;
  let humiChart: Chart<'line', number[], string> | null = null;

  const safeHourly = $derived(hourly.length > 0 ? hourly : []);
  const safeHumidity = $derived(hourlyHumidity.length > 0 ? hourlyHumidity : []);

  const monoFont = { family: "'SF Mono', 'Space Mono', ui-monospace, monospace", size: 11 };
  const gridColor = 'rgba(0, 0, 0, 0.04)';
  const tooltipBg = '#1d1d1f';

  function getChartData(ctx: CanvasRenderingContext2D): ChartData<'line', number[], string> {
    const humiGrad = ctx.createLinearGradient(0, 0, 0, 200);
    humiGrad.addColorStop(0, 'rgba(0, 113, 227, 0.08)');
    humiGrad.addColorStop(1, 'rgba(0, 113, 227, 0)');

    return {
      labels: safeHourly.map((h) => h.time),
      datasets: [
        {
          label: '温度 (°C)',
          data: safeHourly.map((h) => h.temp),
          borderColor: '#ff9f0a',
          backgroundColor: 'transparent',
          yAxisID: 'y',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#ff9f0a'
        },
        {
          label: '湿度 (%)',
          data: safeHumidity,
          borderColor: 'rgba(0, 113, 227, 0.35)',
          backgroundColor: humiGrad,
          fill: true,
          yAxisID: 'y1',
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: 'rgba(0, 113, 227, 0.5)',
          borderDash: [4, 3]
        }
      ]
    };
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: { boxWidth: 12, boxHeight: 2, font: { size: 10 }, padding: 12, usePointStyle: false, color: 'rgba(0,0,0,0.45)' }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleFont: monoFont,
        bodyFont: monoFont,
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 10 }, color: 'rgba(0,0,0,0.35)' } },
      y: {
        type: 'linear',
        position: 'left',
        grid: { color: gridColor },
        ticks: { font: { size: 10 }, color: 'rgba(0,0,0,0.35)', callback: (v) => `${v}°` },
        title: { display: true, text: '温度', font: { size: 10 }, color: '#ff9f0a' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 10 }, color: 'rgba(0,0,0,0.35)', callback: (v) => `${v}%` },
        title: { display: true, text: '湿度', font: { size: 10 }, color: 'rgba(0,113,227,0.5)' },
        suggestedMin: 30,
        suggestedMax: 80
      }
    }
  };

  onMount(() => {
    const ctx = humiChartEl.getContext('2d')!;
    humiChart = new Chart(ctx, {
      type: 'line',
      data: getChartData(ctx),
      options: chartOptions
    });

    return () => {
      humiChart?.destroy();
      humiChart = null;
    };
  });

  $effect(() => {
    if (!humiChart) return;
    const ctx = humiChartEl.getContext('2d');
    if (!ctx) return;
    humiChart.data = getChartData(ctx);
    humiChart.update();
  });
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">天气</h2>
    <span class="section-subtitle">未来24小时</span>
  </div>
  <div class="chart-container chart-container-tall">
    <canvas bind:this={humiChartEl}></canvas>
  </div>
</section>
