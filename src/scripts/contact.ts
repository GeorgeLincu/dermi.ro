// Contact form: submits with fetch and shows the result in place. Without JavaScript the form still
// works as a normal POST (the Worker redirects to a confirmation page).
export function initContact() {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  if (!form) return;
  const status = document.getElementById('formStatus')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const msg = form.dataset as Record<string, string>;
  (form.elements.namedItem('t') as HTMLInputElement).value = String(Date.now());

  const show = (type: 'ok' | 'error', text: string) => {
    status.className = `form__status form__status--${type}`;
    status.textContent = text;
    status.hidden = false;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.hidden = true;
    const label = button.textContent;
    button.disabled = true;
    button.textContent = msg.sending;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({ ok: false, error: 'send' }));
      if (json.ok) {
        form.reset();
        (form.elements.namedItem('t') as HTMLInputElement).value = String(Date.now());
        show('ok', msg.ok);
      } else {
        show('error', json.error === 'invalid' ? msg.invalid : json.error === 'rate' ? msg.rate : msg.error);
      }
    } catch {
      show('error', msg.error);
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
}
