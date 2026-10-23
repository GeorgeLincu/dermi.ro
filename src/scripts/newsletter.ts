// Newsletter forms: submit with fetch and show the result in place. Without JavaScript they still work
// as a normal POST (the Worker redirects to /newsletter/verifica/).
export function initNewsletter() {
  document.querySelectorAll<HTMLFormElement>('form.js-newsletter').forEach(form => {
    const status = form.querySelector<HTMLElement>('.form__status')!;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const msg = form.dataset as Record<string, string>;
    const stamp = () => { (form.elements.namedItem('t') as HTMLInputElement).value = String(Date.now()); };
    stamp();

    const show = (type: 'ok' | 'error', text: string) => {
      status.className = `form__status form__status--${type}`;
      status.textContent = text;
      status.hidden = false;
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = form.elements.namedItem('email') as HTMLInputElement;
      const consent = form.elements.namedItem('consent') as HTMLInputElement;
      if (!email.checkValidity()) { show('error', msg.invalid); email.focus(); return; }
      if (!consent.checked) { show('error', msg.consent); consent.focus(); return; }
      status.hidden = true;
      const label = button.textContent;
      button.disabled = true;
      button.textContent = msg.sending;
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const json = await res.json().catch(() => ({ ok: false, error: 'send' }));
        if (json.ok) { form.reset(); stamp(); show('ok', msg.ok); }
        else show('error', json.error === 'invalid' ? msg.invalid : json.error === 'consent' ? msg.consent : json.error === 'rate' ? msg.rate : msg.error);
      } catch {
        show('error', msg.error);
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
}
