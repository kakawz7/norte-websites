'use strict';
(() => {
  // This is the existing browser-safe publishable key, never a private key.
  const SUPABASE_URL = 'https://asmfzjvdtzwdshtqwqpm.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_yMeZWVlo54JNvou0fVIRiQ_H_fjjDz6';
  const fields = ['nome','whatsapp','email ou instagram','tipo_site','estilo','orcamento','prazo','descricao'];
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function install(form) {
    form.addEventListener('input', event => {
      if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    });
  }
  function validateContact(form) {
    form.querySelectorAll('input:not([type=radio]):not([type=checkbox]):not([type=hidden]),textarea').forEach(input => {
      input.value = input.value.trim();
      input.setCustomValidity('');
    });
    const phone = form.elements.namedItem('whatsapp');
    const digits = phone.value.replace(/\D/g,'');
    if (!/^[+()\d\s.\-]+$/.test(phone.value) || digits.length < 10 || digits.length > 15) {
      phone.setCustomValidity('Informe um WhatsApp válido com DDD.');
    }
    if (!form.checkValidity()) {form.reportValidity();return false;}
    return true;
  }
  function showStep(steps, n, {bar,label,percent,total,initial=false}) {
    steps.forEach(step => {
      const active = Number(step.dataset.step) === n;
      step.classList.toggle('active',active);
      step.hidden = !active;
    });
    const progress = Math.round(Math.min(n,total)/total*100);
    bar.style.width = progress+'%';
    if (label) label.textContent = n > total ? 'Concluído' : `Etapa ${n} de ${total}`;
    if (percent) percent.textContent = progress+'%';
    if (!initial) {
      const active = steps.find(step => Number(step.dataset.step) === n);
      const heading = active.querySelector('h2');
      heading?.focus({preventScroll:true});
      active.scrollIntoView({behavior:prefersReduced()?'auto':'smooth',block:'start'});
    }
  }
  function lock(form, busy) {
    form.setAttribute('aria-busy',String(busy));
    form.querySelectorAll('button').forEach(button => {button.disabled=busy;});
  }
  async function send(pedido) {
    // Keep precisely the eight columns already consumed by the live project.
    if (Object.keys(pedido).length !== fields.length || fields.some(key => typeof pedido[key] !== 'string')) {
      throw new Error('INVALID_PAYLOAD');
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),25000);
    try {
      const response = await fetch(SUPABASE_URL+'/rest/v1/orcamentos',{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Prefer':'return=minimal'},
        body:JSON.stringify(pedido),credentials:'omit',cache:'no-store',signal:controller.signal
      });
      if (!response.ok) {
        const error = new Error('SUBMISSION_FAILED');
        error.status = response.status;
        throw error;
      }
    } finally {clearTimeout(timeout);}
  }
  function messageFor(error) {
    if (error.name === 'AbortError') return 'Não foi possível confirmar o envio a tempo. Fale com a Norte antes de reenviar, para evitar pedidos duplicados.';
    if (error.status === 429) return 'Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.';
    return 'Não foi possível enviar o orçamento. Confira sua conexão e tente novamente. Seus dados continuam preenchidos.';
  }
  window.NorteForms = Object.freeze({install,validateContact,showStep,lock,send,messageFor});
})();
