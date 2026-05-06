<script lang="ts">
  let { condition, class: className = '' }: { condition: string; class?: string } = $props();

  const type = $derived(getIconType(condition));

  function getIconType(value: string): string {
    if (value.includes('晴')) return 'sun';
    if (value.includes('雨') && value.includes('雪')) return 'sleet';
    if (value.includes('雨') || value.includes('暴雨')) return 'rain';
    if (value.includes('雪') || value.includes('暴雪')) return 'snow';
    if (value.includes('雾') || value.includes('霾') || value.includes('尘')) return 'fog';
    if (value.includes('风')) return 'wind';
    if (value.includes('阴')) return 'overcast';
    if (value.includes('云')) return 'cloudy';
    return 'cloudy';
  }
</script>

<svg class={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-label={condition} role="img">
  {#if type === 'sun'}
    <circle cx="16" cy="16" r="5.5"/>
    <path d="M16 3.5v3M16 25.5v3M3.5 16h3M25.5 16h3M7.2 7.2l2.1 2.1M22.7 22.7l2.1 2.1M24.8 7.2l-2.1 2.1M9.3 22.7l-2.1 2.1"/>
  {:else if type === 'cloudy'}
    <circle cx="11.5" cy="12" r="4.2" opacity=".55"/>
    <path d="M12 22.5h10.7a5.1 5.1 0 0 0 0-10.2 7 7 0 0 0-13.4 2.2A4.1 4.1 0 0 0 12 22.5Z"/>
  {:else if type === 'overcast'}
    <path d="M9.5 18.5h13a4.8 4.8 0 0 0 0-9.6 6.6 6.6 0 0 0-12.8 2.2 3.8 3.8 0 0 0-.2 7.4Z" opacity=".65"/>
    <path d="M8.5 24h14.8a4.2 4.2 0 0 0 0-8.4 6 6 0 0 0-11.4 1.9A3.5 3.5 0 0 0 8.5 24Z"/>
  {:else if type === 'rain' || type === 'sleet'}
    <path d="M8.5 18.8h14.2a5 5 0 0 0 0-10 6.8 6.8 0 0 0-13 2.2 4 4 0 0 0-1.2 7.8Z"/>
    <path d="M11.5 22.5l-1 3M16 22.5l-1 3M20.5 22.5l-1 3"/>
  {:else if type === 'snow'}
    <path d="M8.5 18.8h14.2a5 5 0 0 0 0-10 6.8 6.8 0 0 0-13 2.2 4 4 0 0 0-1.2 7.8Z"/>
    <path d="M11 23.5h.01M16 25h.01M21 23.5h.01"/>
  {:else if type === 'fog'}
    <path d="M7 11.5h18M5.5 16h21M7 20.5h18M9 25h14"/>
  {:else if type === 'wind'}
    <path d="M5 11h15a3 3 0 1 0-3-3M5 17h20a3 3 0 1 1-3 3M5 23h10"/>
  {/if}
</svg>
