<script lang="ts">
  import type { Location } from '$lib/types/weather';

  let {
    location,
    locationSource,
    mockActive,
    onGpsLocate,
    onIpLocate,
    onMockToggle
  }: {
    location?: Location;
    locationSource: 'gps' | 'ip' | null;
    mockActive?: boolean;
    onGpsLocate?: () => void;
    onIpLocate?: () => void;
    onMockToggle?: () => void;
  } = $props();

  const now = new Date();
  const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const dateNum = $derived(String(now.getDate()).padStart(2, '0'));
  const dateLabel = $derived(`${months[now.getMonth()]} ${now.getFullYear()}`);

  let modeMenuOpen = $state(false);

  const locationModeLabel = $derived(
    locationSource === 'gps' ? 'GPS 精确定位' : locationSource === 'ip' ? 'IP 模糊定位' : '定位模式'
  );

  function handleModeSelect(mode: 'gps' | 'ip') {
    modeMenuOpen = false;
    if (mode === locationSource) return;

    if (mode === 'gps') {
      onGpsLocate?.();
    } else {
      onIpLocate?.();
    }
  }
</script>

<header class="header">
  <div
    class="date-block"
    class:mock-active={mockActive}
    role="button"
    tabindex="0"
    ondblclick={onMockToggle}
    onkeydown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onMockToggle?.();
      }
    }}
    aria-label="双击打开 Mock 工具"
  >
    {#if mockActive}
      <span class="mock-pin" aria-hidden="true">Mock</span>
    {/if}
    <span class="date-num">{dateNum}</span>
    <span class="date-label">{dateLabel}</span>
  </div>
  <div class="location-tag">
    <span class="location-city">{location?.city ?? '定位中...'}</span>
    {#if location}
      <span class="location-coords">{location.lat} {location.lon}</span>
    {/if}
    <div class="location-mode">
      <button
        class="source-tag"
        class:gps={locationSource === 'gps'}
        class:open={modeMenuOpen}
        onclick={() => (modeMenuOpen = !modeMenuOpen)}
        aria-haspopup="menu"
        aria-expanded={modeMenuOpen}
        title="切换定位模式"
      >
        <span>{locationModeLabel}</span>
        <svg class="mode-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {#if modeMenuOpen}
        <div class="mode-menu" role="menu">
          <button class:active={locationSource === 'gps'} role="menuitem" onclick={() => handleModeSelect('gps')}>
            <span class="mode-title">GPS 精确定位</span>
            <span class="mode-desc">使用浏览器定位</span>
          </button>
          <button class:active={locationSource === 'ip'} role="menuitem" onclick={() => handleModeSelect('ip')}>
            <span class="mode-title">IP 模糊定位</span>
            <span class="mode-desc">按网络位置估算</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .mock-pin {
    position: absolute;
    left: 0;
    top: -18px;
    padding: 2px 6px;
    border-radius: 999px;
    background: #ff9f0a;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 12px rgba(255, 159, 10, 0.25);
    opacity: 0;
    transform: translateY(3px);
    transition: opacity 0.15s var(--ease-out), transform 0.15s var(--ease-out);
    pointer-events: none;
  }

  :global(.date-block.mock-active:hover) .mock-pin,
  :global(.date-block.mock-active:focus-visible) .mock-pin {
    opacity: 1;
    transform: translateY(0);
  }

  :global(.date-block.mock-active:hover)::after,
  :global(.date-block.mock-active:focus-visible)::after {
    content: "双击打开 Mock 工具";
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 6px;
    white-space: nowrap;
    padding: 5px 8px;
    border-radius: 6px;
    background: var(--bg-dark);
    color: var(--text-on-dark);
    font-size: 11px;
    font-weight: 600;
    box-shadow: var(--shadow-md);
    z-index: 30;
  }

  .location-mode {
    position: relative;
    margin-top: 6px;
  }

  .source-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 7px;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    color: var(--text-secondary);
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid transparent;
    border-radius: 6px;
    letter-spacing: 0.02em;
    cursor: pointer;
    line-height: 1;
    transition: background 0.15s var(--ease-out), border-color 0.15s var(--ease-out), color 0.15s var(--ease-out);
  }

  .source-tag:hover,
  .source-tag.open {
    color: var(--accent);
    background: var(--accent-light);
    border-color: rgba(0, 113, 227, 0.15);
  }

  .source-tag.gps {
    color: #248a3d;
    background: rgba(52, 199, 89, 0.1);
  }

  .source-tag.gps:hover,
  .source-tag.gps.open {
    color: #34c759;
    border-color: rgba(52, 199, 89, 0.2);
  }

  .mode-chevron {
    transition: transform 0.15s var(--ease-out);
  }

  .source-tag.open .mode-chevron {
    transform: rotate(180deg);
  }

  .mode-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 20;
    width: 152px;
    padding: 4px;
    background: var(--bg-card);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    box-shadow: var(--shadow-md);
  }

  .mode-menu button {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 8px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-secondary);
    font-family: var(--font-body);
    cursor: pointer;
    text-align: left;
    transition: background 0.15s var(--ease-out), color 0.15s var(--ease-out);
  }

  .mode-menu button:hover,
  .mode-menu button.active {
    background: var(--bg-card-hover);
    color: var(--text-primary);
  }

  .mode-title {
    font-size: 12px;
    font-weight: 600;
  }

  .mode-desc {
    font-size: 10px;
    color: var(--text-tertiary);
  }
</style>
