<script lang="ts">
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
  <div class="footer-bottom">
    <a href="https://beian.miit.gov.cn/#/" target="_blank" rel="noopener noreferrer">陕ICP备2024027651号-2</a>
  </div>
</footer>
