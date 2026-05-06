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
    locationSource,
    mockLat,
    mockLon,
    loadWeatherData,
    refreshWithGps,
    refreshWithIp,
    switchScenario,
    switchToReal,
    setMockCoords,
    clearMockCoords
  } from '$lib/stores/weather';
  import type { MockScenario } from '$lib/stores/weather';

  function isDarkMode(): boolean {
    const html = document.documentElement;
    const theme = html.getAttribute('data-theme');
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function updateChartTheme() {
    const dark = isDarkMode();
    Chart.defaults.color = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0, 0, 0, 0.35)';
  }

  const darkMql = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (darkMql) {
    darkMql.addEventListener('change', () => {
      const html = document.documentElement;
      if (html.getAttribute('data-theme') === 'auto') {
        updateChartTheme();
      }
    });
  }

  import Header from '$lib/components/Header.svelte';
  import HeroSection from '$lib/components/HeroSection.svelte';
  import StatsRow from '$lib/components/StatsRow.svelte';
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
    family: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    size: 11
  } as typeof Chart.defaults.font;
  if (typeof window !== 'undefined') {
    Chart.defaults.color = isDarkMode() ? 'rgba(255,255,255,0.4)' : 'rgba(0, 0, 0, 0.35)';
  }

  const scenarios: { value: MockScenario; label: string }[] = [
    { value: 'normal', label: '正常' },
    { value: 'heavy-pollution', label: '重度污染' },
    { value: 'cold', label: '严寒' },
    { value: 'rain', label: '暴雨' },
    { value: 'error', label: '错误' }
  ];

  let mockPanelOpen = $state(false);
  let inputLat = $state('');
  let inputLon = $state('');

  function toggleMockPanel() {
    mockPanelOpen = !mockPanelOpen;
  }

  function handleSetCoords() {
    const lat = parseFloat(inputLat);
    const lon = parseFloat(inputLon);
    if (isNaN(lat) || isNaN(lon)) return;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
    setMockCoords(lat, lon);
  }

  function handleClearCoords() {
    inputLat = '';
    inputLon = '';
    clearMockCoords();
  }

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
      { opacity: [0, 1], y: [12, 0] },
      { duration: 0.45, delay: motionStaggerTyped(0.04), easing: [0.25, 0.46, 0.45, 0.94] }
    ));

    controls.push(motionAnimateTyped(
      '.update-badge',
      { opacity: [1, 0.5, 1] },
      { duration: 2.5, repeat: Infinity, easing: 'ease-in-out' }
    ));

    controls.push(motionAnimateTyped(
      '.sun-node',
      { r: [8, 9.5, 8] },
      { duration: 3, repeat: Infinity, easing: 'ease-in-out' }
    ));

    const bars = document.querySelectorAll('.p-bar-fill');
    if (bars.length) {
      controls.push(motionAnimateTyped(
        bars,
        { opacity: [0, 1], x: [-8, 0] },
        { duration: 0.4, delay: motionStaggerTyped(0.05, { start: 0.2 }), easing: [0.25, 0.46, 0.45, 0.94] }
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    }
  </style>
</svelte:head>

<!-- Mock 场景切换器 (默认隐藏) -->
{#if mockPanelOpen}
  <div class="mock-panel">
    <div class="mock-panel-header">
      <span class="mock-label">Mock</span>
      <button class="mock-close" onclick={() => (mockPanelOpen = false)}>✕</button>
    </div>

    <!-- 场景选择 -->
    <div class="mock-section">
      <span class="mock-section-title">场景</span>
      <div class="mock-scenario-row">
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
      </div>
    </div>

    <!-- 自定义经纬度 -->
    <div class="mock-section">
      <span class="mock-section-title">自定义位置</span>
      <div class="mock-coord-row">
        <input
          class="mock-input"
          type="number"
          step="0.0001"
          placeholder="纬度 34.26"
          bind:value={inputLat}
        />
        <input
          class="mock-input"
          type="number"
          step="0.0001"
          placeholder="经度 108.94"
          bind:value={inputLon}
        />
      </div>
      <div class="mock-coord-actions">
        <button class="mock-btn mock-btn-primary" onclick={handleSetCoords}>应用</button>
        {#if $mockLat !== null}
          <button class="mock-btn" onclick={handleClearCoords}>清除</button>
        {/if}
      </div>
      {#if $mockLat !== null}
        <span class="mock-coord-status">已设置: {$mockLat.toFixed(4)} {$mockLon?.toFixed(4)}</span>
      {/if}
    </div>
  </div>
{/if}

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
    <Header location={data.location} locationSource={$locationSource} mockActive={$dataMode === 'mock'} onGpsLocate={() => refreshWithGps()} onIpLocate={() => refreshWithIp()} onMockToggle={toggleMockPanel} />
    <HeroSection current={data.current} forecastKeypoint={data.forecastKeypoint} />
    <StatsRow current={data.current} />
    <HumidityChart hourly={data.hourly} hourlyHumidity={data.hourlyHumidity} />
    <DailyForecast daily={data.daily} />
    <AqiSection current={data.current} pollutants={data.aqiPollutants} />
    <SunSection sun={data.sun} />
    <DetailsSection current={data.current} />
    <Footer />
  </div>
{/if}
