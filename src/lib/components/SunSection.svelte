<script lang="ts">
  import type { SunData } from '$lib/types/weather';

  let { sun }: { sun: SunData } = $props();
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">日出日落</h2>
    <span class="section-subtitle">日照 {sun.duration}</span>
  </div>
  <div class="sun-card-light">
    <div class="sun-times">
      <div class="sun-time-block">
        <span class="sun-time-label">日出</span>
        <span class="sun-time-val">{sun.sunrise}</span>
      </div>
      <div class="sun-track">
        <span class="sun-track-progress" style="width:{sun.progress}%"></span>
        <span class="sun-dot" style="left:{sun.progress}%"></span>
      </div>
      <div class="sun-time-block" style="text-align:right">
        <span class="sun-time-label">日落</span>
        <span class="sun-time-val">{sun.sunset}</span>
      </div>
    </div>
  </div>
</section>
