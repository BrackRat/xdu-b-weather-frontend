<div class="skeleton">
  <!-- Header: left=date, right=location -->
  <div class="sk-header">
    <div class="sk-header-left">
      <div class="sk-block sk-date-num"></div>
      <div class="sk-block sk-date-label"></div>
    </div>
    <div class="sk-header-right">
      <div class="sk-block sk-city"></div>
      <div class="sk-block sk-coords"></div>
      <div class="sk-block sk-mode-tag"></div>
    </div>
  </div>

  <!-- Hero: left=temp, right=icon -->
  <div class="sk-hero">
    <div class="sk-hero-left">
      <div class="sk-block sk-hero-temp"></div>
      <div class="sk-block sk-hero-feels"></div>
      <div class="sk-block sk-hero-condition"></div>
      <div class="sk-block sk-hero-range"></div>
    </div>
    <div class="sk-block sk-hero-icon"></div>
  </div>

  <!-- Stats: 2x2 grid -->
  <div class="sk-stats">
    {#each { length: 4 } as _}
      <div class="sk-stat-card">
        <div class="sk-block sk-stat-label"></div>
        <div class="sk-block sk-stat-val"></div>
        <div class="sk-block sk-stat-unit"></div>
      </div>
    {/each}
  </div>

  <!-- Pressure: full-width card -->
  <div class="sk-card sk-pressure">
    <div class="sk-block sk-pressure-label"></div>
    <div class="sk-block sk-pressure-val"></div>
    <div class="sk-block sk-pressure-unit"></div>
  </div>

  <!-- Hourly chart -->
  <div class="sk-card sk-chart">
    <div class="sk-block sk-chart-area"></div>
  </div>

  <!-- Daily Forecast: 3 days -->
  <div class="sk-card sk-daily">
    {#each { length: 3 } as _}
      <div class="sk-daily-row">
        <div class="sk-block sk-daily-day"></div>
        <div class="sk-block sk-daily-icon"></div>
        <div class="sk-block sk-daily-bar"></div>
        <div class="sk-block sk-daily-temp"></div>
      </div>
    {/each}
  </div>

  <!-- AQI -->
  <div class="sk-card sk-aqi">
    <div class="sk-aqi-top">
      <div class="sk-block sk-aqi-gauge"></div>
      <div class="sk-aqi-score">
        <div class="sk-block sk-aqi-num"></div>
        <div class="sk-block sk-aqi-level"></div>
      </div>
    </div>
    <div class="sk-aqi-grid">
      {#each { length: 6 } as _}
        <div class="sk-aqi-item">
          <div class="sk-block sk-aqi-name"></div>
          <div class="sk-block sk-aqi-pval"></div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Sun -->
  <div class="sk-card sk-sun">
    <div class="sk-sun-header">
      <div class="sk-block sk-sun-title"></div>
      <div class="sk-block sk-sun-duration"></div>
    </div>
    <div class="sk-block sk-sun-arc"></div>
    <div class="sk-sun-times">
      <div class="sk-block sk-sun-time"></div>
      <div class="sk-block sk-sun-time"></div>
    </div>
  </div>

  <!-- Details: 2-column grid -->
  <div class="sk-details">
    <div class="sk-block sk-section-title"></div>
    <div class="sk-detail-grid">
      {#each { length: 2 } as _}
        <div class="sk-detail-card">
          <div class="sk-block sk-detail-label"></div>
          <div class="sk-block sk-detail-val"></div>
          <div class="sk-block sk-detail-sub"></div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Footer -->
  <div class="sk-footer">
    <div class="sk-block sk-footer-badge"></div>
    <div class="sk-block sk-footer-text"></div>
  </div>
</div>

<style>
  .skeleton {
    max-width: 480px;
    margin: 0 auto;
    padding: 24px 20px 64px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .sk-block {
    background: var(--skeleton-base);
    border-radius: 6px;
    position: relative;
    overflow: hidden;
  }

  .sk-block::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--skeleton-shine) 50%,
      transparent 100%
    );
    animation: sk-shimmer 1.5s ease-in-out infinite;
  }

  @keyframes sk-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* Header */
  .sk-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .sk-header-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sk-header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }
  .sk-date-num { width: 44px; height: 40px; border-radius: 4px; }
  .sk-date-label { width: 80px; height: 12px; }
  .sk-city { width: 56px; height: 16px; }
  .sk-coords { width: 130px; height: 10px; }
  .sk-mode-tag { width: 76px; height: 20px; border-radius: 999px; }

  /* Hero */
  .sk-hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 0;
  }
  .sk-hero-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .sk-hero-temp { width: 100px; height: 72px; border-radius: 8px; }
  .sk-hero-feels { width: 90px; height: 12px; }
  .sk-hero-condition { width: 40px; height: 18px; }
  .sk-hero-range { width: 80px; height: 12px; }
  .sk-hero-icon { width: 88px; height: 88px; border-radius: 50%; }

  /* Stats: 2x2 grid like the real layout */
  .sk-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .sk-stat-card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: var(--shadow-card);
  }
  .sk-stat-label { width: 32px; height: 12px; }
  .sk-stat-val { width: 56px; height: 28px; }
  .sk-stat-unit { width: 48px; height: 10px; }

  /* Card base */
  .sk-card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 20px;
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Pressure: full-width card */
  .sk-pressure {
    align-items: center;
    gap: 4px;
    padding: 24px 20px;
  }
  .sk-pressure-label { width: 32px; height: 12px; }
  .sk-pressure-val { width: 80px; height: 44px; border-radius: 8px; }
  .sk-pressure-unit { width: 56px; height: 12px; }

  /* Chart */
  .sk-chart-area { width: 100%; height: 180px; }

  /* Daily */
  .sk-daily-row {
    display: grid;
    grid-template-columns: 36px 24px 1fr 72px;
    gap: 10px;
    align-items: center;
  }
  .sk-daily-row + .sk-daily-row {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--skeleton-base);
  }
  .sk-daily-day { width: 36px; height: 14px; }
  .sk-daily-icon { width: 24px; height: 24px; border-radius: 6px; }
  .sk-daily-bar { width: 100%; height: 6px; border-radius: 3px; }
  .sk-daily-temp { width: 72px; height: 14px; }

  /* AQI */
  .sk-aqi-top {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .sk-aqi-gauge { width: 100px; height: 100px; border-radius: 50%; flex-shrink: 0; }
  .sk-aqi-score {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sk-aqi-num { width: 48px; height: 36px; }
  .sk-aqi-level { width: 32px; height: 16px; }
  .sk-aqi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .sk-aqi-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .sk-aqi-name { width: 40px; height: 12px; }
  .sk-aqi-pval { width: 32px; height: 14px; }

  /* Sun */
  .sk-sun-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sk-sun-title { width: 72px; height: 20px; }
  .sk-sun-duration { width: 64px; height: 12px; }
  .sk-sun-arc { width: 100%; height: 120px; border-radius: 12px; }
  .sk-sun-times { display: flex; justify-content: space-between; }
  .sk-sun-time { width: 56px; height: 12px; }

  /* Details */
  .sk-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .sk-section-title { width: 48px; height: 20px; }
  .sk-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .sk-detail-card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 16px;
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .sk-detail-label { width: 32px; height: 12px; }
  .sk-detail-val { width: 56px; height: 32px; }
  .sk-detail-sub { width: 64px; height: 10px; }

  /* Footer */
  .sk-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding-top: 8px;
  }
  .sk-footer-badge { width: 32px; height: 18px; border-radius: 999px; }
  .sk-footer-text { width: 96px; height: 10px; }
</style>
