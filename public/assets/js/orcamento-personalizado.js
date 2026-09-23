'use strict';
(() => {
  const form=document.getElementById('customForm');
  const steps=[...form.querySelectorAll('.step')];
  const summary=document.getElementById('summary');
  const submitBtn=document.getElementById('submitBtn');
  const submitError=document.getElementById('submitError');
  const helpers=window.NorteForms;
  let current=1,sending=false;
  helpers.install(form);
  function values(name) {return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(el=>el.value);}
  function renderSummary() {
    const data=[['Tipo de projeto',values('tipo')],['Quantidade de páginas',values('paginas')],['Recursos desejados',values('recursos')],['Serviços adicionais',values('servicos')],['Faixa de investimento',values('investimento')],['Prazo desejado',values('prazo')]];
    summary.replaceChildren();
    for (const [term,list] of data) {
      const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
      row.className='summary-item';dt.textContent=term;dd.textContent=list.length?list.join(', '):'Nenhum selecionado';
      row.append(dt,dd);summary.append(row);
    }
  }
  function show(n,initial=false) {
    current=n;
    if(n===5)renderSummary();
    helpers.showStep(steps,n,{bar:document.getElementById('progressBar'),label:document.getElementById('progressLabel'),percent:document.getElementById('progressPercent'),total:5,initial});
  }
  function validateStep(number=current) {
    const step=steps.find(el=>Number(el.dataset.step)===number);
    const missing=[...step.querySelectorAll('[data-required-group]')].filter(group=>!group.querySelector('input:checked'));
    const error=step.querySelector('.error');
    if(missing.length) {
      if(error)error.textContent='Selecione uma opção em cada grupo para continuar.';
      if(current!==number)show(number);
      missing[0].querySelector('input').focus();return false;
    }
    if(error)error.textContent='';return true;
  }
  function next() {if(!sending && current<5 && validateStep())show(current+1);}
  form.querySelectorAll('.next').forEach(button=>button.addEventListener('click',next));
  form.querySelectorAll('.prev').forEach(button=>button.addEventListener('click',()=>{if(!sending)show(Math.max(1,current-1));}));
  form.addEventListener('change',()=>{
    const error=steps.find(el=>Number(el.dataset.step)===current)?.querySelector('.error');
    if(error)error.textContent='';if(current===5)renderSummary();
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(sending)return;
    if(current<5){next();return;}
    if(current!==5)return;
    if(!validateStep(1)||!validateStep(4))return;
    if(!helpers.validateContact(form)){submitError.textContent='Preencha corretamente todos os campos obrigatórios antes de enviar.';return;}
    submitError.textContent='';sending=true;helpers.lock(form,true);submitBtn.textContent='Enviando...';
    const fd=new FormData(form),recursos=fd.getAll('recursos').join(', ')||'Nenhum selecionado',servicos=fd.getAll('servicos').join(', ')||'Nenhum selecionado';
    const pedido={nome:fd.get('nome'),whatsapp:fd.get('whatsapp'),'email ou instagram':`${fd.get('email')} / ${fd.get('instagram')||'Instagram não informado'}`,tipo_site:fd.get('tipo'),estilo:fd.get('paginas'),orcamento:fd.get('investimento'),prazo:fd.get('prazo'),descricao:`Empresa: ${fd.get('empresa')}\nRecursos desejados: ${recursos}\nServiços adicionais: ${servicos}\nDetalhes do projeto: ${fd.get('descricao')}`};
    try {await helpers.send(pedido);form.reset();show(6);}
    catch(err){submitError.textContent=helpers.messageFor(err);}
    finally{sending=false;helpers.lock(form,false);submitBtn.textContent='Solicitar orçamento personalizado';}
  });
  show(1,true);
})();
