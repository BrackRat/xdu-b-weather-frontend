<script lang="ts">
  import './weather.css';
  import { onMount, tick } from 'svelte';
  import { animate as motionAnimate, stagger as motionStagger } from 'motion';
  import { Chart, registerables } from 'chart.js';
  import {
    weatherData,
    weatherError,
    isLoading,
    dataMode,
    mockScenario,
    loadWeatherData,
    switchScenario,
    switchToReal
  } from '$lib/stores/weather';
  import type { MockScenario } from '$lib/stores/weather';

  import Header from '$lib/components/Header.svelte';
  import HeroSection from '$lib/components/HeroSection.svelte';
  import StatsRow from '$lib/components/StatsRow.svelte';
  import HourlyForecast from '$lib/components/HourlyForecast.svelte';
  import DailyForecast from '$lib/components/DailyForecast.svelte';
  import AqiSection from '$lib/components/AqiSection.svelte';
  import HumidityChart from '$lib/components/HumidityChart.svelte';
  import SunSection from '$lib/components/SunSection.svelte';
  import DetailsSection from '$lib/components/DetailsSection.svelte';
  import Footer from '$lib/components/Footer.svelte';

  const motionAnimateTyped = motionAnimate as unknown as (
    target: string | Element | NodeListOf<Element>,
    keyframes: Record<string, unknown>,
    options?: Record<string, unknown>
  ) => unknown;
  const motionStaggerTyped = motionStagger as unknown as (n: number, opts?: Record<string, unknown>) => number;

  Chart.register(...registerables);
  Chart.defaults.font = {
    ...Chart.defaults.font,
    family: "'Space Mono', monospace",
    size: 10
  } as typeof Chart.defaults.font;
  Chart.defaults.color = '#88887a';

  const scenarios: { value: MockScenario; label: string }[] = [
    { value: 'normal', label: '正常' },
    { value: 'heavy-pollution', label: '重度污染' },
    { value: 'cold', label: '严寒' },
    { value: 'rain', label: '暴雨' },
    { value: 'error', label: '错误' }
  ];

  let mockPanelOpen = $state(false);

  onMount(() => {
    void loadWeatherData();
  });

  function stopAnimation(control: unknown) {
    if (Array.isArray(control)) {
      control.forEach(stopAnimation);
      return;
    }

    if (control && typeof control === 'object') {
      const typedControl = control as { cancel?: () => void; stop?: () => void };
      typedControl.cancel?.();
      typedControl.stop?.();
    }
  }

  function runAnimations() {
    const controls: unknown[] = [];
    const sections = document.querySelectorAll('.w-container > *');
    controls.push(motionAnimateTyped(
      sections,
      { opacity: [0, 1], y: [16, 0] },
      { duration: 0.5, delay: motionStaggerTyped(0.05), easing: 'ease-out' }
    ));

    controls.push(motionAnimateTyped(
      '.update-badge',
      { opacity: [1, 0.4, 1] },
      { duration: 2.5, repeat: Infinity, easing: 'ease-in-out' }
    ));

    controls.push(motionAnimateTyped(
      '.sun-dot',
      { y: [-2, 2, -2] },
      { duration: 3, repeat: Infinity, easing: 'ease-in-out' }
    ));

    const bars = document.querySelectorAll('.p-bar-fill');
    if (bars.length) {
      controls.push(motionAnimateTyped(
        bars,
        { opacity: [0, 1], x: [-10, 0] },
        { duration: 0.5, delay: motionStaggerTyped(0.06, { start: 0.3 }), easing: 'ease-out' }
      ));
    }

    return () => {
      controls.forEach(stopAnimation);
    };
  }

  $effect(() => {
    if ($isLoading || $weatherError || !$weatherData) return;

    let cancelled = false;
    let cleanup = () => {};

    void tick().then(() => {
      if (cancelled) return;
      cleanup = runAnimations();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  });
</script>

<svelte:head>
  <title>天气 — {$weatherData?.location.city ?? '加载中'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Mock 场景切换器 (默认隐藏) -->
{#if mockPanelOpen}
  <div class="mock-switcher">
    <span class="mock-label">Mock</span>
    {#each scenarios as s}
      <button
        class="mock-btn"
        class:active={$dataMode === 'mock' && $mockScenario === s.value}
        onclick={() => switchScenario(s.value)}
      >{s.label}</button>
    {/each}
    <button
      class="mock-btn"
      class:active={$dataMode === 'real'}
      onclick={() => switchToReal()}
    >实时</button>
    <button class="mock-btn" onclick={() => (mockPanelOpen = false)}>✕</button>
  </div>
{/if}
<button class="mock-trigger" onclick={() => (mockPanelOpen = !mockPanelOpen)} title="Mock 数据切换">⚙</button>

{#if $isLoading}
  <div class="w-container">
    <div class="loading-state">加载中...</div>
  </div>
{:else if $weatherError}
  <div class="w-container">
    <div class="error-state">
      <p>数据加载失败</p>
      <p class="error-detail">{$weatherError}</p>
      <button class="retry-btn" onclick={() => loadWeatherData()}>重试</button>
    </div>
  </div>
{:else if $weatherData}
  {@const data = $weatherData}
  <div class="w-container">
    <Header location={data.location} />
    <HeroSection current={data.current} />
    <StatsRow current={data.current} />
    <HourlyForecast hourly={data.hourly} />
    <DailyForecast daily={data.daily} />
    <AqiSection current={data.current} pollutants={data.aqiPollutants} hourlyAqi={data.hourlyAqi} hourly={data.hourly} />
    <HumidityChart hourly={data.hourly} hourlyHumidity={data.hourlyHumidity} />
    <SunSection sun={data.sun} />
    <DetailsSection current={data.current} />
    <Footer />
  </div>
{/if}
