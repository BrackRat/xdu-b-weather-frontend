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

  const monoFont = { family: "'Space Mono', monospace", size: 10 };
  const gridColor = 'rgba(0,0,0,0.06)';
  const tooltipBg = '#0a0a0a';

  function getChartData(ctx: CanvasRenderingContext2D): ChartData<'line', number[], string> {
    const humiGrad = ctx.createLinearGradient(0, 0, 0, 200);
    humiGrad.addColorStop(0, 'rgba(52,152,219,0.15)');
    humiGrad.addColorStop(1, 'rgba(52,152,219,0)');

    return {
      labels: hourly.map((h) => h.time),
      datasets: [
        {
          label: '温度 (°C)',
          data: hourly.map((h) => h.temp),
          borderColor: '#e6a017',
          backgroundColor: 'transparent',
          yAxisID: 'y',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#e6a017'
        },
        {
          label: '湿度 (%)',
          data: hourlyHumidity,
          borderColor: '#3498db',
          backgroundColor: humiGrad,
          fill: true,
          yAxisID: 'y1',
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#3498db',
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
        labels: { boxWidth: 12, boxHeight: 2, font: { size: 9 }, padding: 8, usePointStyle: false }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleFont: monoFont,
        bodyFont: monoFont,
        padding: 10,
        cornerRadius: 0
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 9 } } },
      y: {
        type: 'linear',
        position: 'left',
        grid: { color: gridColor },
        ticks: { font: { size: 9 }, callback: (v) => `${v}°` },
        title: { display: true, text: '温度', font: { size: 9 }, color: '#e6a017' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 9 }, callback: (v) => `${v}%` },
        title: { display: true, text: '湿度', font: { size: 9 }, color: '#3498db' },
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

<section class="humi-section">
  <div class="section-header">
    <h2 class="section-title">温湿度</h2>
    <div class="section-tags"><span>24小时</span><span>对比</span></div>
  </div>
  <div class="chart-container chart-container-tall">
    <canvas bind:this={humiChartEl}></canvas>
  </div>
</section>
