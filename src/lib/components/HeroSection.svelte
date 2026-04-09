<script lang="ts">
  import type { CurrentWeather } from '$lib/types/weather';

  let { current }: { current: CurrentWeather } = $props();
</script>

<section class="hero-section">
  <div class="bg-dates" aria-hidden="true">
    {#each ['01','02','03','04','05','06'] as d}<span>{d}</span>{/each}
  </div>
  <div class="temp-hero">
    <div>
      <span class="temp-value">{current.temp}<sup>°</sup></span>
      <span class="feels-like">体感温度 <b>{current.feelsLike}°</b></span>
    </div>
    <div class="temp-meta">
      <span class="condition-main">{#each current.condition as line}{line}<br/>{/each}</span>
    </div>
  </div>
  <svg class="weather-icon-large" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <circle cx="50" cy="50" r="22"/>
    <line x1="50" y1="12" x2="50" y2="22"/><line x1="50" y1="78" x2="50" y2="88"/>
    <line x1="12" y1="50" x2="22" y2="50"/><line x1="78" y1="50" x2="88" y2="50"/>
    <line x1="23" y1="23" x2="30" y2="30"/><line x1="70" y1="70" x2="77" y2="77"/>
    <line x1="77" y1="23" x2="70" y2="30"/><line x1="30" y1="70" x2="23" y2="77"/>
    <path d="M62 58 Q75 58 75 68 Q75 78 62 78 L38 78 Q25 78 25 68 Q25 58 38 58 Z" fill="currentColor" opacity=".4"/>
  </svg>
</section>
