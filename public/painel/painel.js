'use strict';
(() => {
  const BASE = 'https://asmfzjvdtzwdshtqwqpm.supabase.co';
  const KEY = 'sb_publishable_yMeZWVlo54JNvou0fVIRiQ_H_fjjDz6';
  const $ = id => document.getElementById(id);
  const fields = [['nome','Nome'],['whatsapp','WhatsApp'],['email ou instagram','E-mail / Instagram'],['tipo_site','Tipo de site'],['estilo','Estilo / páginas'],['orcamento','Investimento'],['prazo','Prazo'],['descricao','Descrição']];
  let token = null, expiry = null, generation = 0, page = 0, query = '', rows = [], total = 0;
  const text = value => value == null || value === '' ? 'Não informado' : String(value);
  function message(id, value, error = false) { $(id).textContent = value; $(id).classList.toggle('error', error); }
  function clearSession(note = '') {
    generation++; clearTimeout(expiry); token = null; rows = []; total = 0; page = 0; query = '';
    $('results').replaceChildren(); $('detail-fields').replaceChildren(); $('detail-name').textContent = '';
    $('detail').close(); $('dashboard').hidden = true; $('login').hidden = false; $('logout').hidden = true;
    $('password').value = ''; $('search').value = ''; $('total').textContent = '—';
    message('login-message', note); $('email').focus();
  }
  async function request(path, body, accessToken = null) {
    const headers = {'Content-Type':'application/json', apikey:KEY};
    if (accessToken) headers.Authorization = 'Bearer ' + accessToken;
    const response = await fetch(BASE + path, {method:'POST',headers,body:JSON.stringify(body),cache:'no-store'});
    const data = await response.json().catch(() => null);
    if (!response.ok) { const error = new Error('Request failed'); error.status = response.status; throw error; }
    return data;
  }
  function showDetail(row) {
    $('detail-name').textContent = text(row.nome); $('detail-fields').replaceChildren();
    for (const [key,label] of fields) {
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = text(row[key]); $('detail-fields').append(dt,dd);
    }
    $('detail').showModal();
  }
  function render() {
    $('results').replaceChildren(); $('total').textContent = total.toLocaleString('pt-BR');
    for (const row of rows) {
      const card = document.createElement('article'); card.className = 'card';
      const type = document.createElement('span'); type.className = 'type'; type.textContent = text(row.tipo_site);
      const name = document.createElement('h2'); name.textContent = text(row.nome);
      const contact = document.createElement('p'); contact.textContent = text(row.whatsapp);
      const budget = document.createElement('p'); budget.textContent = text(row.orcamento);
      const button = document.createElement('button'); button.textContent = 'Ver pedido →'; button.addEventListener('click', () => showDetail(row));
      card.append(type,name,contact,budget,button); $('results').append(card);
    }
    $('previous').disabled = page === 0; $('next').disabled = (page + 1) * 30 >= total;
    $('page-label').textContent = total ? `Página ${page + 1} de ${Math.ceil(total / 30)}` : 'Nenhum pedido';
  }
  async function load() {
    if (!token) return;
    const current = ++generation;
    $('results').replaceChildren(); rows = []; $('results').setAttribute('aria-busy','true');
    ['previous','next','refresh'].forEach(id => $(id).disabled = true);
    message('status','Carregando pedidos…');
    try {
      const data = await request('/rest/v1/rpc/norte_painel_orcamentos', {busca:query,pagina:page},token);
      if (current !== generation) return;
      if (!data || !Array.isArray(data.pedidos) || !Number.isSafeInteger(data.total) || data.total < 0) throw new Error('Invalid response');
      rows = data.pedidos; total = data.total;
      if (page > 0 && page * 30 >= total) { page = Math.max(0,Math.ceil(total / 30)-1); return load(); }
      render(); message('status', total ? 'Pedidos atualizados.' : query ? 'Nenhum pedido corresponde à busca.' : 'Você ainda não recebeu pedidos.');
    } catch (error) {
      if (current !== generation) return;
      if (error.status === 401) { clearSession('Sua sessão expirou. Entre novamente.'); return; }
      if (error.status === 403) { clearSession('Este usuário não tem acesso ao painel.'); return; }
      $('total').textContent = '—'; $('page-label').textContent = '';
      message('status', error.status === 404 ? 'O painel ainda precisa ser configurado no Supabase.' : 'Não foi possível carregar os pedidos. Verifique sua conexão e tente atualizar.',true);
    } finally {
      if (current === generation) { $('results').setAttribute('aria-busy','false'); $('refresh').disabled = false; }
    }
  }
  $('login-form').addEventListener('submit', async event => {
    event.preventDefault(); $('enter').disabled = true; message('login-message','Entrando…');
    try {
      const data = await request('/auth/v1/token?grant_type=password',{email:$('email').value.trim(),password:$('password').value});
      if (!data?.access_token || !Number.isFinite(data.expires_in)) throw new Error('Invalid session');
      token = data.access_token; $('password').value = '';
      expiry = setTimeout(() => clearSession('Sua sessão expirou. Entre novamente.'), Math.max(0,data.expires_in * 1000 - 10000));
      $('login').hidden = true; $('dashboard').hidden = false; $('logout').hidden = false; $('search').focus();
      await load();
    } catch (error) { message('login-message',error.status === 400 || error.status === 401 ? 'E-mail ou senha incorretos, ou acesso ainda não ativado.' : 'Não foi possível entrar. Verifique sua conexão e tente novamente.',true); }
    finally { $('enter').disabled = false; }
  });
  $('logout').addEventListener('click', async () => {
    const previousToken = token; clearSession('Você saiu do painel.');
    if (previousToken) { try { await request('/auth/v1/logout?scope=local',{},previousToken); } catch { message('login-message','Sessão removida desta página. Não foi possível confirmar a saída no servidor.'); } }
  });
  $('search-form').addEventListener('submit', event => { event.preventDefault(); query = $('search').value.trim(); page = 0; load(); });
  $('refresh').addEventListener('click',load);
  $('previous').addEventListener('click',() => { page--; load(); });
  $('next').addEventListener('click',() => { page++; load(); });
  $('close-detail').addEventListener('click',() => $('detail').close());
  window.addEventListener('pagehide',() => clearSession());
})();
