<script lang="ts">
  import type { SunData } from '$lib/types/weather';

  let { sun }: { sun: SunData } = $props();

  const progress = $derived(Math.max(0, Math.min(sun.progress, 100)));
  const isDaytime = $derived(progress > 0 && progress < 100);
  const sunPoint = $derived(getArcPoint(progress));
  const arcLength = 251.33;

  function getArcPoint(value: number) {
    const pct = Math.max(0, Math.min(value, 100)) / 100;
    const angle = Math.PI - pct * Math.PI;
    const cx = 150;
    const cy = 124;
    const r = 80;
    return {
      x: cx + r * Math.cos(angle),
      y: cy - r * Math.sin(angle)
    };
  }
</script>

<section>
  <div class="section-header">
    <h2 class="section-title">日出日落</h2>
    <span class="section-subtitle">日照 {sun.duration}</span>
  </div>
  <div class="sun-card-light" class:night={!isDaytime}>
    <div class="sun-card-head">
      <div>
        <span class="sun-phase">{isDaytime ? 'Day' : 'Night'}</span>
        <span class="sun-phase-sub">{isDaytime ? 'Sun path' : 'Below horizon'}</span>
      </div>
      <span class="sun-progress-label">{isDaytime ? '白昼' : '夜间'}</span>
    </div>

    <div class="sun-arc-wrap">
      <svg class="sun-arc" viewBox="0 0 300 140" aria-hidden="true">
        <path class="sun-arc-glow" d="M70 124 A80 80 0 0 1 230 124" />
        <path class="sun-arc-track" d="M70 124 A80 80 0 0 1 230 124" />
        <path
          class="sun-arc-progress"
          d="M70 124 A80 80 0 0 1 230 124"
          style="stroke-dasharray:{arcLength};stroke-dashoffset:{arcLength * (1 - progress / 100)}"
        />
        <circle class="sun-node-halo" cx={sunPoint.x} cy={sunPoint.y} r="16" />
        <circle class="sun-node" cx={sunPoint.x} cy={sunPoint.y} r="9" />
      </svg>
    </div>

    <div class="sun-times">
      <div class="sun-time-block">
        <span class="sun-time-label">日出</span>
        <span class="sun-time-val">{sun.sunrise}</span>
      </div>
      <div class="sun-duration">
        <span>日照</span>
        <b>{sun.duration}</b>
      </div>
      <div class="sun-time-block align-right">
        <span class="sun-time-label">日落</span>
        <span class="sun-time-val">{sun.sunset}</span>
      </div>
    </div>
  </div>
</section>
