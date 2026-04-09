<script lang="ts">
  import type { CurrentWeather } from '$lib/types/weather';

  let { current }: { current: CurrentWeather } = $props();
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">其他</h2>
    <span class="section-subtitle">指标</span>
  </div>
  <div class="details-grid">
    <div class="detail-card">
      <span class="detail-label">气压</span>
      <span class="detail-value">{current.pressure}</span>
      <span class="detail-sub">hPa · 稳定</span>
    </div>
    <div class="detail-card">
      <span class="detail-label">露点</span>
      <span class="detail-value">{current.dewPoint}°</span>
      <span class="detail-sub">舒适</span>
    </div>
  </div>
</section>
