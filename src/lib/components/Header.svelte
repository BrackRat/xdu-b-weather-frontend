<script lang="ts">
  import type { Location } from '$lib/types/weather';
  import { requestGeolocation, formatGcjCoord, type GcjPosition } from '$lib/geolocation';

  let {
    location,
    locationSource,
    onGpsLocate,
    onDateTripleClick
  }: {
    location?: Location;
    locationSource: 'gps' | 'ip' | null;
    onGpsLocate?: (lat: number, lon: number) => void;
    onDateTripleClick?: () => void;
  } = $props();

  const now = new Date();
  const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const dateNum = $derived(String(now.getDate()).padStart(2, '0'));
  const dateLabel = $derived(`${months[now.getMonth()]} ${now.getFullYear()}`);

  let gpsPos = $state<GcjPosition | null>(null);
  let gpsError = $state<string | null>(null);
  let gpsLoading = $state(false);

  async function handleLocate() {
    if (gpsLoading) return;
    gpsLoading = true;
    gpsError = null;
    try {
      gpsPos = await requestGeolocation();
      // 通知父组件用 GPS 坐标重新获取天气
      onGpsLocate?.(gpsPos.lat, gpsPos.lon);
    } catch (e) {
      let msg = '定位失败';
      if (e instanceof Error) {
        msg = e.message;
      } else if (typeof e === 'object' && e !== null && 'code' in e) {
        const code = (e as { code: number }).code;
        if (code === 1) msg = '定位权限被拒绝';
        else if (code === 2) msg = '无法获取位置';
        else if (code === 3) msg = '定位超时';
      }
      if (window.isSecureContext === false) {
        msg = '需要 HTTPS 连接';
      }
      gpsError = msg;
      gpsPos = null;
    } finally {
      gpsLoading = false;
    }
  }
</script>

<header class="header">
  <div class="date-block" role="button" tabindex="0" ondblclick={onDateTripleClick}>
    <span class="date-num">{dateNum}</span>
    <span class="date-label">{dateLabel}</span>
  </div>
  <div class="location-tag">
    <span class="location-city">{location?.city ?? '定位中...'}</span>
    {#if gpsPos}
      <span class="location-coords">
        {formatGcjCoord(gpsPos.lat)} {formatGcjCoord(gpsPos.lon)}
        <span class="gps-badge">GCJ-02</span>
      </span>
    {:else if location}
      <span class="location-coords">{location.lat} {location.lon}</span>
    {/if}
    <div class="locate-row">
      <button
        class="locate-btn"
        onclick={handleLocate}
        disabled={gpsLoading}
        title="获取精确定位 (GCJ-02)"
      >
        {#if gpsLoading}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        {:else}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          </svg>
        {/if}
        {gpsLoading ? '定位中' : gpsPos ? '已定位' : '精确定位'}
      </button>
      {#if locationSource}
        <span class="source-tag" class:gps={locationSource === 'gps'}>
          {locationSource === 'gps' ? 'GPS' : 'IP'}
        </span>
      {/if}
    </div>
    {#if gpsError}
      <span class="gps-error">{gpsError}</span>
    {/if}
  </div>
</header>

<style>
  .locate-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
  }

  .locate-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-light);
    border: 1px solid rgba(0, 113, 227, 0.15);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s var(--ease-out);
    line-height: 1;
  }

  .locate-btn:hover:not(:disabled) {
    background: rgba(0, 113, 227, 0.12);
    border-color: rgba(0, 113, 227, 0.3);
  }

  .locate-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .source-tag {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    color: var(--text-tertiary);
    background: rgba(0, 0, 0, 0.04);
    padding: 2px 5px;
    border-radius: 4px;
    letter-spacing: 0.04em;
  }

  .source-tag.gps {
    color: #34c759;
    background: rgba(52, 199, 89, 0.08);
  }

  .gps-badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-light);
    padding: 1px 4px;
    border-radius: 3px;
    letter-spacing: 0.04em;
    margin-left: 4px;
    vertical-align: middle;
  }

  .gps-error {
    font-size: 10px;
    color: #ff3b30;
    margin-top: 2px;
    display: block;
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
