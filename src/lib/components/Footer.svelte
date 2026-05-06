<script lang="ts">
  import { env } from '$env/dynamic/public';

  const beianEnabled = env.PUBLIC_BEIAN_ENABLED === 'true';
  const beianText = env.PUBLIC_BEIAN_TEXT?.trim();

  const now = new Date();
  const lastUpdate = $derived(
    `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} CST`
  );
</script>

<footer class="footer">
  <div class="footer-top">
    <div class="footer-left">
      <span class="update-badge">实时</span>
      <span class="footer-info">更新于 {lastUpdate}</span>
    </div>
    <div class="footer-right">
      <span class="page-num">06</span>
      <span>weather.sys/v2.4</span>
    </div>
  </div>
  {#if beianEnabled && beianText}
    <div class="footer-bottom">
      <a href="https://beian.miit.gov.cn/#/" target="_blank" rel="noopener noreferrer">{beianText}</a>
    </div>
  {/if}
</footer>
