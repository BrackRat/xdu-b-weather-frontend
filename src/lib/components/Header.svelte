<script lang="ts">
  import type { Location } from '$lib/types/weather';

  let { location }: { location: Location } = $props();

  const now = new Date();
  const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const dateNum = $derived(String(now.getDate()).padStart(2, '0'));
  const dateLabel = $derived(`${months[now.getMonth()]} ${now.getFullYear()}`);
</script>

<header class="header">
  <div class="date-block">
    <span class="date-num">{dateNum}</span>
    <span class="date-label">{dateLabel}</span>
  </div>
  <div class="location-tag">
    <span class="location-city">{location.city}</span>
    <span class="location-coords">{location.lat} {location.lon}</span>
  </div>
</header>
