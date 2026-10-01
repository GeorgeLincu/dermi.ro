// "Copy link" button on articles — uses the Clipboard API, no third-party code
export function initShare() {
  document.querySelectorAll<HTMLButtonElement>('.share__copy').forEach(btn => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? location.href);
        btn.textContent = btn.dataset.done ?? '✓';
        setTimeout(() => { btn.textContent = label; }, 2000);
      } catch { /* clipboard blocked — the other share links still work */ }
    });
  });
}
