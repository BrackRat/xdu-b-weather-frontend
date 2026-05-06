<script lang="ts">
  import type { CurrentWeather } from '$lib/types/weather';

  let { current, forecastKeypoint }: { current: CurrentWeather; forecastKeypoint?: string } = $props();

  const weatherIcons: Record<string, string> = {
    '晴': 'sun',
    '多云': 'cloudy',
    '阴': 'overcast',
    '小雨': 'rain',
    '中雨': 'rain',
    '大雨': 'rain',
    '暴雨': 'storm',
    '小雪': 'snow',
    '中雪': 'snow',
    '大雪': 'snow',
    '暴雪': 'storm',
    '雾': 'fog',
    '轻度雾霾': 'fog',
    '中度雾霾': 'fog',
    '重度雾霾': 'fog',
    '浮尘': 'fog',
    '沙尘': 'fog',
    '大风': 'wind',
    '冰雹': 'storm',
    '雨夹雪': 'rain',
    '雨': 'rain',
    '雪': 'snow'
  };

  const iconType = $derived(weatherIcons[current.condition[0]] ?? 'sun');
</script>

<section class="hero-section">
  <div class="temp-hero">
    <div class="temp-display">
      <span class="temp-value">{current.temp}<sup>°</sup></span>
      <span class="feels-like">体感温度 <b>{current.feelsLike}°</b></span>
    </div>
    <div class="temp-meta">
      <span class="condition-main">{#each current.condition as line}{line}<br/>{/each}</span>
    </div>
  </div>
  {#if forecastKeypoint}
    <p class="forecast-keypoint" aria-label="天气提示">{forecastKeypoint}</p>
  {/if}
  {#if iconType === 'sun'}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <circle cx="50" cy="50" r="22"/>
      <line x1="50" y1="12" x2="50" y2="22"/><line x1="50" y1="78" x2="50" y2="88"/>
      <line x1="12" y1="50" x2="22" y2="50"/><line x1="78" y1="50" x2="88" y2="50"/>
      <line x1="23" y1="23" x2="30" y2="30"/><line x1="70" y1="70" x2="77" y2="77"/>
      <line x1="77" y1="23" x2="70" y2="30"/><line x1="30" y1="70" x2="23" y2="77"/>
    </svg>
  {:else if iconType === 'cloudy'}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <circle cx="40" cy="38" r="16"/>
      <line x1="40" y1="14" x2="40" y2="20"/><line x1="40" y1="56" x2="40" y2="62"/>
      <line x1="16" y1="38" x2="22" y2="38"/><line x1="58" y1="38" x2="64" y2="38"/>
      <path d="M70 62 Q88 62 88 74 Q88 86 70 86 L32 86 Q14 86 14 74 Q14 62 32 62 Q34 48 50 48 Q62 48 70 62 Z" fill="currentColor" opacity=".1"/>
    </svg>
  {:else if iconType === 'overcast'}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M70 44 Q88 44 88 56 Q88 68 70 68 L32 68 Q14 68 14 56 Q14 44 32 44 Q34 30 50 30 Q62 30 70 44 Z" fill="currentColor" opacity=".08"/>
      <path d="M65 62 Q80 62 80 72 Q80 82 65 82 L35 82 Q20 82 20 72 Q20 62 35 62 Q37 50 50 50 Q60 50 65 62 Z" fill="currentColor" opacity=".12"/>
    </svg>
  {:else if iconType === 'rain' || iconType === 'storm'}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M68 40 Q84 40 84 52 Q84 64 68 64 L34 64 Q18 64 18 52 Q18 40 34 40 Q36 28 50 28 Q60 28 68 40 Z" fill="currentColor" opacity=".1"/>
      <line x1="32" y1="72" x2="28" y2="84"/><line x1="44" y1="72" x2="40" y2="88"/>
      <line x1="56" y1="72" x2="52" y2="84"/><line x1="68" y1="72" x2="64" y2="88"/>
    </svg>
  {:else if iconType === 'snow'}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M68 36 Q84 36 84 48 Q84 60 68 60 L34 60 Q18 60 18 48 Q18 36 34 36 Q36 24 50 24 Q60 24 68 36 Z" fill="currentColor" opacity=".1"/>
      <circle cx="32" cy="74" r="2.5" fill="currentColor" opacity=".2"/>
      <circle cx="48" cy="80" r="2.5" fill="currentColor" opacity=".2"/>
      <circle cx="64" cy="74" r="2.5" fill="currentColor" opacity=".2"/>
      <circle cx="40" cy="88" r="2.5" fill="currentColor" opacity=".2"/>
      <circle cx="56" cy="88" r="2.5" fill="currentColor" opacity=".2"/>
    </svg>
  {:else if iconType === 'fog'}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <line x1="20" y1="36" x2="80" y2="36" opacity=".15"/>
      <line x1="24" y1="48" x2="76" y2="48" opacity=".2"/>
      <line x1="20" y1="60" x2="80" y2="60" opacity=".15"/>
      <line x1="28" y1="72" x2="72" y2="72" opacity=".2"/>
      <line x1="24" y1="84" x2="76" y2="84" opacity=".15"/>
    </svg>
  {:else if iconType === 'wind'}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path d="M16 40 H60 Q72 40 72 30 Q72 20 60 20" opacity=".2"/>
      <path d="M16 56 H68 Q80 56 80 46 Q80 36 68 36" opacity=".25"/>
      <path d="M16 72 H52 Q62 72 62 62 Q62 52 52 52" opacity=".2"/>
    </svg>
  {:else}
    <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <circle cx="50" cy="50" r="22"/>
      <line x1="50" y1="12" x2="50" y2="22"/><line x1="50" y1="78" x2="50" y2="88"/>
      <line x1="12" y1="50" x2="22" y2="50"/><line x1="78" y1="50" x2="88" y2="50"/>
    </svg>
  {/if}
</section>
