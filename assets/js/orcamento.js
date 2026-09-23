'use strict';
(() => {
  const form = document.getElementById('budgetForm');
  const steps = [...form.querySelectorAll('.step')];
  const submitBtn = document.getElementById('submitBtn');
  const error = document.getElementById('submitError');
  const helpers = window.NorteForms;
  const plans = Object.freeze({
    essencial: 'Plano Essencial — R$ 490',
    completo: 'Plano Completo — R$ 990'
  });
  let current = 1, sending = false;
  helpers.install(form);
  const selectedPlan = plans[new URLSearchParams(window.location.search).get('plano')];
  if (selectedPlan) {
    const budget = form.elements.namedItem('orcamento');
    budget.add(new Option(selectedPlan, selectedPlan, true, true));
    document.getElementById('investmentField').hidden = true;
    document.getElementById('chosenPlanName').textContent = selectedPlan;
    document.getElementById('chosenPlan').hidden = false;
  }
  function show(n, initial=false) {
    current=n;
    helpers.showStep(steps,n,{bar:document.getElementById('bar'),label:document.getElementById('progressLabel'),percent:document.getElementById('progressPercent'),total:4,initial});
  }
  function validateChoice(stepNumber, name, message) {
    const step = form.querySelector(`[data-step="${stepNumber}"]`);
    const selected = form.elements.namedItem(name).value;
    const valid = [...step.querySelectorAll('.option')].some(button => button.dataset.value === selected);
    step.querySelector('.error').textContent=valid?'':message;
    if (!valid) {show(stepNumber);step.querySelector('.option').focus({preventScroll:true});}
    return valid;
  }
  function next() {
    if (sending) return;
    if (current===1 && !validateChoice(1,'tipo','Escolha o tipo de projeto.')) return;
    if (current===2 && !validateChoice(2,'estilo','Escolha uma direção para o projeto.')) return;
    if (current<4) show(current+1);
  }
  form.querySelectorAll('.options').forEach(group => {
    group.querySelectorAll('.option').forEach(button => button.addEventListener('click',() => {
      group.querySelectorAll('.option').forEach(option => {
        const selected=option===button;
        option.classList.toggle('active',selected);option.setAttribute('aria-pressed',String(selected));
      });
      group.parentElement.querySelector('input[type=hidden]').value=button.dataset.value;
      group.closest('.step').querySelector('.error').textContent='';
    }));
  });
  form.querySelectorAll('.next').forEach(button => button.addEventListener('click',next));
  form.querySelectorAll('.prev').forEach(button => button.addEventListener('click',() => {if(!sending)show(Math.max(1,current-1));}));
  form.addEventListener('submit',async event => {
    event.preventDefault();
    if (sending) return;
    if (current<4) {next();return;}
    if (current!==4) return;
    if (!validateChoice(1,'tipo','Escolha o tipo de projeto.') || !validateChoice(2,'estilo','Escolha uma direção para o projeto.')) return;
    if (!helpers.validateContact(form)) {error.textContent='Confira os campos de contato antes de enviar.';return;}
    error.textContent='';sending=true;helpers.lock(form,true);submitBtn.textContent='Enviando...';
    const fd=new FormData(form);
    const pedido={nome:fd.get('nome'),whatsapp:fd.get('whatsapp'),'email ou instagram':fd.get('contato'),tipo_site:fd.get('tipo'),estilo:fd.get('estilo'),orcamento:fd.get('orcamento'),prazo:fd.get('prazo'),descricao:fd.get('descricao')};
    try {
      await helpers.send(pedido);
      form.reset();
      form.querySelectorAll('.option').forEach(option=>{option.classList.remove('active');option.setAttribute('aria-pressed','false');});
      show(5);
    } catch(err) {error.textContent=helpers.messageFor(err);}
    finally {sending=false;helpers.lock(form,false);submitBtn.textContent='Enviar orçamento →';}
  });
  show(1,true);
})();
