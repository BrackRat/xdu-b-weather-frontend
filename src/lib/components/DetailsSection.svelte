<script lang="ts">
  import type { CurrentWeather } from '$lib/types/weather';

  let { current }: { current: CurrentWeather } = $props();
</script>

<section class="details-section">
  <div class="section-header">
    <h2 class="section-title">详细数据</h2>
    <div class="section-tags"><span>指标</span></div>
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
    <div class="detail-card wide">
      <span class="detail-label">首要污染物</span>
      <span class="detail-value">PM10 <span class="detail-aqi-unit">主导</span></span>
      <span class="detail-sub">可吸入颗粒物 ≤10µm — 高峰时段减少户外活动。敏感人群应限制长时间户外运动。</span>
      <span class="detail-accent" aria-hidden="true">!</span>
    </div>
  </div>
</section>
