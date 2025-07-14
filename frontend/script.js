let dados = {
  pessoas: [],
  tarefasFeitas: [],
  locais: []
};

let tipoUsuario = null;
let pessoaAtiva = null;

const BASE_URL = 'https://zempofy-backend.onrender.com';


async function entrarComo(tipo) {
  await carregarDados();
  tipoUsuario = tipo;
  pessoaAtiva = tipo === 'funcionario' ? 0 : null;
  document.getElementById('tela-login').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  carregarMenu();
  carregarDashboard();
}


function carregarMenu() {
  const menu = document.getElementById('menu');
  menu.innerHTML = '';

  const icones = {
    dashboard: `<svg xmlns="http://www.w3.org/2000/svg" class="icone-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>`,
    pessoas: `<svg xmlns="http://www.w3.org/2000/svg" class="icone-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>`,
    agenda: `<svg xmlns="http://www.w3.org/2000/svg" class="icone-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>`,
    tarefa: `<svg xmlns="http://www.w3.org/2000/svg" class="icone-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>`,
    concluidas: `<svg xmlns="http://www.w3.org/2000/svg" class="icone-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 6L9 17l-5-5" />
    </svg>`,
    anotacoes: `<svg xmlns="http://www.w3.org/2000/svg" class="icone-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13" />
      <path d="M16 3l4 4" />
      <path d="M8 10h8" />
      <path d="M8 14h6" />
    </svg>`
  };

  if (tipoUsuario === 'admin') {
    menu.innerHTML += `<button onclick="carregarDashboard()"><span class="icone-wrapper">${icones.dashboard}</span><span class="texto-menu">Dashboard</span></button>`;
    menu.innerHTML += `<button onclick="gerenciarPessoas()"><span class="icone-wrapper">${icones.pessoas}</span><span class="texto-menu">Pessoas</span></button>`;
    menu.innerHTML += `<button onclick="carregarAgenda()"><span class="icone-wrapper">${icones.agenda}</span><span class="texto-menu">Agenda</span></button>`;
    menu.innerHTML += `<button onclick="abrirCriadorTarefa()"><span class="icone-wrapper">${icones.tarefa}</span><span class="texto-menu">Criar Tarefa</span></button>`;
    menu.innerHTML += `<button onclick="verConcluidas()"><span class="icone-wrapper">${icones.concluidas}</span><span class="texto-menu">Concluídas</span></button>`;
    menu.innerHTML += `<button onclick="carregarBlocoAnotacoes()"><span class="icone-wrapper">${icones.anotacoes}</span><span class="texto-menu">Anotações</span></button>`;
  } else {
    menu.innerHTML += `<div>👤 ${dados.pessoas[pessoaAtiva].nome}</div>`;
    menu.innerHTML += `<button onclick="carregarAgenda()"><span class="icone-wrapper">${icones.agenda}</span><span class="texto-menu">Agenda</span></button>`;
    menu.innerHTML += `<button onclick="verMinhasTarefas()"><span class="icone-wrapper">${icones.tarefa}</span><span class="texto-menu">Minhas Tarefas</span></button>`;
    menu.innerHTML += `<button onclick="abrirCriadorTarefa(true)"><span class="icone-wrapper">${icones.tarefa}</span><span class="texto-menu">Nova Tarefa</span></button>`;
    menu.innerHTML += `<button onclick="verConcluidas()"><span class="icone-wrapper">${icones.concluidas}</span><span class="texto-menu">Concluídas</span></button>`;
    menu.innerHTML += `<button onclick="carregarBlocoAnotacoes()"><span class="icone-wrapper">${icones.anotacoes}</span><span class="texto-menu">Anotações</span></button>`;
  }

  menu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      menu.querySelectorAll('button').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
    });
  });
}


function carregarDashboard() {
  const c = document.getElementById('conteudo');
  c.innerHTML = `
    <h2>Dashboard</h2>
    <p>Total de pessoas: ${dados.pessoas.length}</p>
    <p>Total de tarefas: ${dados.pessoas.reduce((acc, p) => acc + p.tarefas.length, 0)}</p>
    <p>Concluídas: ${dados.tarefasFeitas.length}</p>
  `;
}

function gerenciarPessoas() {
  const c = document.getElementById('conteudo');
  c.innerHTML = '<h2>Pessoas</h2>';
  dados.pessoas.forEach((p, i) => {
    c.innerHTML += `
      <div class="tarefa-card">
        <span>${p.nome}</span>
        <button onclick="editarPessoa(${i})">Editar</button>
        <button onclick="confirmarExcluirPessoa(${i})">Excluir</button>
        <button onclick="verTarefasPessoa(${i})">Ver Tarefas</button>
      </div>
    `;
  });
  c.innerHTML += '<button onclick="adicionarPessoa()">+ Adicionar Pessoa</button>';
}

function adicionarPessoa() {
  abrirModalComInput('Adicionar Pessoa', 'Digite o nome da nova pessoa:', '', (nome) => {
    if (!nome.trim()) return;
    dados.pessoas.push({ nome, tarefas: [] });
    gerenciarPessoas();
  });
}

function editarPessoa(i) {
  abrirModalComInput('Editar Pessoa', 'Digite o novo nome:', dados.pessoas[i].nome, (novoNome) => {
    if (!novoNome.trim()) return;
    dados.pessoas[i].nome = novoNome;
    gerenciarPessoas();
  });
}

function confirmarExcluirPessoa(i) {
  abrirModal('Excluir Pessoa', `Deseja excluir ${dados.pessoas[i].nome}?`, () => {
    dados.pessoas.splice(i, 1);
    gerenciarPessoas();
    fecharModal();
  }, true);
}

function abrirCriadorTarefa(func = false) {
  const c = document.getElementById('conteudo');
  c.innerHTML = `
    <h2>Criar Tarefa</h2>
    <div class="form-tarefa-horizontal">
      ${tipoUsuario === 'admin' ? `
        <select id="responsavel">
          ${dados.pessoas.map((p, i) => `<option value="${i}">${p.nome}</option>`).join('')}
        </select>
      ` : ''}
      <select id="local" onchange="verificarAdicionarLocal(this)">
        ${dados.locais.map(loc => `<option>${loc}</option>`).join('')}
        <option value="__novo__">+ Adicionar novo local</option>
      </select>
      <input id="data" type="date" placeholder="Data">
      <input id="hora" type="time" placeholder="Hora">
      <input id="desc" type="text" placeholder="Descrição">
      <button onclick="salvarTarefa(${func})">Adicionar</button>
    </div>
  `;
}

function salvarTarefa(func = false) {
  const desc = document.getElementById('desc').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const local = document.getElementById('local').value;
  const index = func ? pessoaAtiva : parseInt(document.getElementById('responsavel').value);
  if (!desc || !data) return alert('Preencha tudo.');
  dados.pessoas[index].tarefas.push({ descricao: desc, data, hora, local });
  salvarDados();
  verTarefasPessoa(index);
}

function verTarefasPessoa(index) {
  pessoaAtiva = index;
  const p = dados.pessoas[index];
  const c = document.getElementById('conteudo');

  c.innerHTML = `<h2>Tarefas de ${p.nome}</h2>`;

  if (p.tarefas.length === 0) {
    c.innerHTML += '<p>Sem tarefas.</p>';
    return;
  }

  c.innerHTML += `
    <div class="tabela-tarefas">
      <div class="tabela-cabecalho">
        <span class="col-check"></span>
        <span class="col-data">Data</span>
        <span class="col-local">Local</span>
        <span class="col-desc">Descrição</span>
        <span class="col-acoes">
          <button id="btn-concluir" disabled onclick="concluirSelecionadas()">Concluir</button>
        </span>
      </div>
      <div class="tabela-corpo">
        ${p.tarefas.map((t, i) => `
          <div class="linha-tarefa">
            <span class="col-check">
              <input type="checkbox" class="check-tarefa" data-index="${i}" onchange="verificarSelecao()">
            </span>
            <span class="col-data">
  ${formatarDataISO(t.data)}
  ${t.hora ? `<br><small>${t.hora}</small>` : ''}
</span>
            <span class="col-local">${t.local}</span>
            <span class="col-desc">${t.descricao}</span>
            <span class="col-acoes">
  <div class="dropdown-acoes">
    <button class="btn-acoes" onclick="abrirMenuAcoes(this)">Ações ▾</button>
    <div class="menu-acoes">
      <button onclick="editarTarefa(${i})">Editar</button>
      <button onclick="confirmarExcluirTarefa(${i})">Excluir</button>
    </div>
  </div>
</span>

          </div>
        `).join('')}
      </div>
    </div>
  `;
}



function editarTarefa(i) {
  const t = dados.pessoas[pessoaAtiva].tarefas[i];
  const nova = prompt('Nova descrição:', t.descricao);
  if (nova) {
    t.descricao = nova;
    salvarDados();
    verTarefasPessoa(pessoaAtiva);
  }
}

function concluirTarefa(i) {
  const t = dados.pessoas[pessoaAtiva].tarefas.splice(i, 1)[0];
  t.pessoa = dados.pessoas[pessoaAtiva].nome;
  t.concluida = new Date().toLocaleString();
  dados.tarefasFeitas.push(t);
  salvarDados();
  verTarefasPessoa(pessoaAtiva);
}

function confirmarExcluirTarefa(i) {
  abrirModal('Excluir Tarefa', 'Deseja excluir esta tarefa?', () => {
    dados.pessoas[pessoaAtiva].tarefas.splice(i, 1);
    salvarDados();
    verTarefasPessoa(pessoaAtiva);
    fecharModal();
  }, true);
}

function verMinhasTarefas() {
  verTarefasPessoa(pessoaAtiva);
}

function verConcluidas() {
  const c = document.getElementById('conteudo');
  c.innerHTML = '<h2>Tarefas Concluídas</h2>';

  if (dados.tarefasFeitas.length === 0) {
    c.innerHTML += '<p>Nenhuma tarefa concluída.</p>';
    return;
  }

  c.innerHTML += `
    <div class="tabela-tarefas">
      <div class="tabela-cabecalho">
        <span class="col-check"></span>
        <span class="col-data">Data</span>
        <span class="col-local">Local</span>
        <span class="col-desc">Descrição</span>
        <span class="col-acoes">Concluída em</span>
      </div>
      <div class="tabela-corpo">
        ${dados.tarefasFeitas.map(t => `
          <div class="linha-tarefa">
            <span class="col-check">✅</span>
            <span class="col-data">
  ${formatarDataISO(t.data)}
  ${t.hora ? `<br><small>${t.hora}</small>` : ''}
</span>
            <span class="col-local">${t.local}</span>
            <span class="col-desc">${t.descricao} <br><small><i>por ${t.pessoa}</i></small></span>
            <span class="col-acoes">${t.concluida}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}


function alternarSidebar() {
  const sidebar = document.getElementById('sidebar');
  const botao = document.querySelector('.toggle-sidebar');
  sidebar.classList.toggle('recolhida');
  botao.textContent = sidebar.classList.contains('recolhida') ? '❯' : '❮';
}

function abrirModal(titulo, texto, acaoConfirmar, exclusao = false) {
  const btn = document.getElementById('modal-confirmar');
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-texto').innerHTML = `<p>${texto}</p>`;
  document.getElementById('modal-overlay').style.display = 'flex';
  btn.textContent = exclusao ? 'Excluir' : 'Confirmar';
  btn.classList.toggle('vermelho', exclusao);
  btn.classList.toggle('botao-verde', !exclusao);
  btn.onclick = acaoConfirmar;
  document.getElementById('modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModal();
  });
  
}

function abrirModalComInput(titulo, texto, valorInicial, callback) {
  const btn = document.getElementById('modal-confirmar');
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-texto').innerHTML = `
    <label>${texto}</label>
    <input type="text" id="modal-input" value="${valorInicial}" />
  `;
  document.getElementById('modal-overlay').style.display = 'flex';
  btn.onclick = () => {
    const valor = document.getElementById('modal-input').value;
    fecharModal();
    callback(valor);
  };
}

function fecharModal() {
  const btn = document.getElementById('modal-confirmar');
  document.getElementById('modal-overlay').style.display = 'none';
  btn.textContent = 'Confirmar';
  btn.classList.remove('vermelho', 'botao-verde');
  btn.onclick = null;
}

function verificarAdicionarLocal(select) {
  if (select.value === '__novo__') {
    document.getElementById('popup-novo-local').style.display = 'flex';
    setTimeout(() => document.getElementById('popupNovoLocal').focus(), 100);
  }
}

function salvarNovoLocal() {
  const input = document.getElementById('popupNovoLocal');
  const novo = input.value.trim();
  if (!novo) return;

  if (!dados.locais.includes(novo)) {
    dados.locais.push(novo);
    salvarDados().then(() => {
      fecharNovoLocal();
      abrirCriadorTarefa();
      setTimeout(() => {
        const select = document.getElementById('local');
        if (select) select.value = novo;
      }, 0);
    });
  } else {
    alert('Esse local já existe.');
    fecharNovoLocal();
  }
}

function fecharNovoLocal() {
  document.getElementById('popup-novo-local').style.display = 'none';
  document.getElementById('popupNovoLocal').value = '';
}

let dataSelecionadaAgenda = null;

function abrirPopupAgenda(data) {
  dataSelecionadaAgenda = data;
  const tarefas = dados.pessoas[pessoaAtiva]?.tarefas.filter(t => t.data === data) || [];

  let html = `
    <h3 style="color: #1b3d2f;">Tarefas em ${data.split('-').reverse().join('/')}</h3>
    ${tarefas.length === 0 ? '<p style="color:#555;">Nenhuma tarefa.</p>' : ''}
    <div class="lista-tarefas-dia">
      ${tarefas.map((t, i) => `
        <div class="item-tarefa-dia" style="background:${t.cor || '#4CAF50'}">
          <div>
            <strong>${t.hora || '--:--'}</strong> ${t.descricao}
          </div>
          <div>
            <button onclick="editarTarefaAgenda('${data}', ${i})">✏️</button>
            <button onclick="excluirTarefaAgenda('${data}', ${i})">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
    <input type="text" id="inputTarefaAgenda" placeholder="Descrição da tarefa">
    <div class="linha-hora-cor">
      <input type="time" id="inputHoraAgenda">
      <select id="inputCorAgenda">
        <option value="#4CAF50">Verde</option>
        <option value="#2196F3">Azul</option>
        <option value="#FF9800">Laranja</option>
        <option value="#b71c1c">Vermelho Escuro</option>
      </select>
    </div>
    <div class="popup-botoes">
      <button onclick="fecharPopupAgenda()">Fechar</button>
      <button onclick="salvarTarefaAgenda()" class="botao-verde">Salvar</button>
    </div>
  `;

  document.querySelector('#popup-agenda .popup-caixa').innerHTML = html;
  document.getElementById('popup-agenda').style.display = 'flex';
}

document.getElementById('popup-agenda').addEventListener('click', function (e) {
  if (e.target === this) fecharPopupAgenda();
});



function fecharPopupAgenda() {
  document.getElementById('popup-agenda').style.display = 'none';
}

function salvarTarefaAgenda() {
  const desc = document.getElementById('inputTarefaAgenda').value.trim();
  const hora = document.getElementById('inputHoraAgenda').value;
  const cor = document.getElementById('inputCorAgenda').value;

  if (!desc) return;

  if (tipoUsuario === 'admin') {
    pessoaAtiva = parseInt(document.getElementById('agendaPessoaSelecionada')?.value);
  }
  
  if (!dados.pessoas[pessoaAtiva]) {
    alert("Pessoa inválida.");
    return;
  }
  

  dados.pessoas[pessoaAtiva].tarefas.push({
    descricao: desc,
    data: dataSelecionadaAgenda,
    hora: hora || '',
    local: 'Agenda',
    cor
  });

  salvarDados();
  fecharPopupAgenda();
  carregarAgenda();
}

function editarTarefaAgenda(data, index) {
  const tarefas = dados.pessoas[pessoaAtiva].tarefas;
  const tarefasDoDia = tarefas.filter(t => t.data === data);
  const realIndex = tarefas.indexOf(tarefasDoDia[index]);

  const novaDescricao = prompt("Editar descrição:", tarefas[realIndex].descricao);
  if (novaDescricao !== null) {
    tarefas[realIndex].descricao = novaDescricao.trim();
    salvarDados();
    carregarAgenda();
    abrirPopupAgenda(data); // reabre com a edição atualizada
  }
}

function excluirTarefaAgenda(data, index) {
  const tarefas = dados.pessoas[pessoaAtiva].tarefas;
  const tarefasDoDia = tarefas.filter(t => t.data === data);
  const realIndex = tarefas.indexOf(tarefasDoDia[index]);

  if (confirm("Deseja excluir esta tarefa?")) {
    tarefas.splice(realIndex, 1);
    salvarDados();
    carregarAgenda();
    abrirPopupAgenda(data); // reabre com a tarefa removida
  }
}


async function salvarDados() {
  try {
    const resposta = await fetch(`${BASE_URL}/api/tarefas`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) {
      throw new Error('Erro ao salvar os dados no servidor.');
    }
  } catch (erro) {
    console.error('Falha ao salvar:', erro);
    alert('Erro ao salvar os dados. Verifique o console.');
  }
}

async function carregarDados() {
  const res = await fetch(`${BASE_URL}/api/tarefas`);

  const json = await res.json();
  dados = json;
}

let mesAtual = new Date();


function carregarAgenda() {
  const c = document.getElementById('conteudo');
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const comecoSemana = primeiroDia.getDay();
  const totalDias = ultimoDia.getDate();

  let html = `<h2>Agenda</h2>`;

  if (tipoUsuario === 'admin') {
    html += `<label style="margin-bottom:10px;display:block;">Selecionar pessoa:</label>`;
    html += `<select id="agendaPessoaSelecionada" onchange="carregarAgenda()" style="margin-bottom:20px;">`;
    dados.pessoas.forEach((p, i) => {
      html += `<option value="${i}" ${i == pessoaAtiva ? 'selected' : ''}>${p.nome}</option>`;
    });
    html += `</select>`;
    pessoaAtiva = parseInt(document.getElementById('agendaPessoaSelecionada')?.value || 0);
  }

  html += `
    <div class="cabecalho-agenda">
      <button onclick="mudarMes(-1)">❮</button>
      <h2>${primeiroDia.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
      <button onclick="mudarMes(1)">❯</button>
    </div>
    <div class="dias-semana">
      ${diasSemana.map(d => `<div>${d}</div>`).join('')}
    </div>
    <div class="grade-agenda">
  `;

  for (let i = 0; i < comecoSemana; i++) {
    html += `<div class="dia-vazio"></div>`;
  }

  const hojeStr = new Date().toISOString().split('T')[0];

for (let dia = 1; dia <= totalDias; dia++) {
  const data = new Date(ano, mes, dia).toISOString().split('T')[0];
  const classeExtra = data === hojeStr ? 'hoje' : '';
  html += `
    <div class="dia-agenda ${classeExtra}" onclick="abrirPopupAgenda('${data}')">
      <div class="numero-dia">${dia}</div>
      <div class="tarefas-do-dia" id="tarefas-${data}"></div>
    </div>
  `;
}


  html += '</div>';
  c.innerHTML = html;

  preencherTarefasNaAgenda();
}


function mudarMes(direcao) {
  mesAtual.setMonth(mesAtual.getMonth() + direcao);
  carregarAgenda();
}


function preencherTarefasNaAgenda() {
  if (!dados.pessoas[pessoaAtiva]) return;
  const tarefas = dados.pessoas[pessoaAtiva].tarefas;

  // Agrupar tarefas por data
  const tarefasPorData = {};
  tarefas.forEach(t => {
    if (!tarefasPorData[t.data]) tarefasPorData[t.data] = [];
    tarefasPorData[t.data].push(t);
  });

  // Preencher tarefas na agenda
  Object.keys(tarefasPorData).forEach(data => {
    const div = document.getElementById('tarefas-' + data);
    if (div) {
      const tarefasDoDia = tarefasPorData[data];
      const maxExibir = 2;

      tarefasDoDia.slice(0, maxExibir).forEach(t => {
        const span = document.createElement('span');
        span.textContent = `• ${t.hora ? t.hora + ' - ' : ''}${t.descricao}`;
        span.title = t.descricao;
        span.style.backgroundColor = t.cor || '#ccc'; // ainda necessário, pois a cor é dinâmica
        div.appendChild(span);
      });
      

      if (tarefasDoDia.length > maxExibir) {
        const mais = document.createElement('span');
        mais.textContent = `+${tarefasDoDia.length - maxExibir} tarefa(s)...`;
        mais.style.fontSize = '11px';
        mais.style.color = '#777';
        mais.style.marginTop = '3px';
        div.appendChild(mais);
      }
    }
  });
}

function verificarSelecao() {
  const algumaMarcada = [...document.querySelectorAll('.check-tarefa')]
    .some(cb => cb.checked);
  document.getElementById('btn-concluir').disabled = !algumaMarcada;
}

function concluirSelecionadas() {
  const selecionadas = [...document.querySelectorAll('.check-tarefa:checked')]
    .map(cb => parseInt(cb.dataset.index))
    .sort((a, b) => b - a); // ordenar decrescente para remover sem bagunçar índices

  if (selecionadas.length === 0) return;

  selecionadas.forEach(i => {
    concluirTarefa(i);
  });

  // atualizar visual após concluir
  verTarefasPessoa(pessoaAtiva);
}

function formatarDataISO(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function abrirMenuAcoes(botao) {
  // Fecha todos antes
  document.querySelectorAll('.menu-acoes').forEach(menu => {
    if (menu !== botao.nextElementSibling) menu.style.display = 'none';
  });

  const menu = botao.nextElementSibling;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Fecha o menu se clicar fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown-acoes')) {
    document.querySelectorAll('.menu-acoes').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});

let anotacoes = JSON.parse(localStorage.getItem('anotacoes') || '{}');

function carregarBlocoAnotacoes() {
  const c = document.getElementById('conteudo');
  const lista = anotacoes[pessoaAtiva] || [];

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0;">Anotações</h2>
      <button class="botao-verde" onclick="abrirPopupAnotacao()">+ Nova Anotação</button>
    </div>
    <div class="grade-anotacoes">
  `;

  lista.forEach((a, i) => {
    html += `
      <div class="card-anotacao" onclick="verAnotacao(${i})">
        <div class="topo-card">
          <span class="estrela-fixar ${a.fixada ? 'ativa' : ''}" onclick="alternarFixacao(${i}, event)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15 9 22 9 17 14 18.5 21 12 17 5.5 21 7 14 2 9 9 9 12 2" />
            </svg>
          </span>
          <strong>${a.titulo}</strong>
          <span class="data-anotacao">${a.data}</span>
        </div>
        <p>${a.texto.slice(0, 80)}${a.texto.length > 80 ? '...' : ''}</p>
        <div class="botoes-card">
          <button onclick="editarAnotacao(${i})">✏️</button>
          <button onclick="excluirAnotacao(${i})">🗑️</button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  c.innerHTML = html;
}


function abrirPopupAnotacao(index = null) {
  document.getElementById('popup-anotacao').style.display = 'flex';
  document.getElementById('inputTituloAnotacao').value = index !== null ? (anotacoes[pessoaAtiva][index]?.titulo || '') : '';
  document.getElementById('inputTextoAnotacao').value = index !== null ? (anotacoes[pessoaAtiva][index]?.texto || '') : '';
  document.getElementById('popup-anotacao').setAttribute('data-index', index);
}

function fecharPopupAnotacao() {
  document.getElementById('popup-anotacao').style.display = 'none';
  document.getElementById('popup-anotacao').setAttribute('data-index', '');
}

function salvarAnotacao() {
  const titulo = document.getElementById('inputTituloAnotacao').value.trim();
  const texto = document.getElementById('inputTextoAnotacao').value.trim();
  if (!titulo || !texto) return;

  const index = document.getElementById('popup-anotacao').getAttribute('data-index');
  if (!anotacoes[pessoaAtiva]) anotacoes[pessoaAtiva] = [];

  if (index && index !== 'null') {
    anotacoes[pessoaAtiva][index] = { titulo, texto, data: anotacoes[pessoaAtiva][index].data };
  } else {
    anotacoes[pessoaAtiva].push({
      titulo,
      texto,
      data: new Date().toLocaleDateString()
    });
  }

  localStorage.setItem('anotacoes', JSON.stringify(anotacoes));
  fecharPopupAnotacao();
  carregarBlocoAnotacoes();
}

function editarAnotacao(index) {
  abrirPopupAnotacao(index);
}

function excluirAnotacao(index) {
  if (!confirm("Deseja excluir esta anotação?")) return;
  anotacoes[pessoaAtiva].splice(index, 1);
  localStorage.setItem('anotacoes', JSON.stringify(anotacoes));
  carregarBlocoAnotacoes();
}

function verAnotacao(index) {
  const a = anotacoes[pessoaAtiva][index];
  document.getElementById('tituloVerAnotacao').textContent = a.titulo;
  document.getElementById('textoVerAnotacao').textContent = a.texto;
  document.getElementById('popup-ver-anotacao').style.display = 'flex';

  // Exibe o ícone de fixado (opcional: aqui você pode validar se está fixado mesmo)
  document.getElementById('iconeFixar').style.display = 'inline';
}

document.getElementById('popup-ver-anotacao').addEventListener('click', function (e) {
  if (e.target === this) fecharPopupVerAnotacao();
});


function fecharPopupVerAnotacao() {
  document.getElementById('popup-ver-anotacao').style.display = 'none';
}

function alternarFixacao(index, event) {
  event.stopPropagation(); // impede que abra o popup ao clicar na bandeira

  const lista = anotacoes[pessoaAtiva];
  lista[index].fixada = !lista[index].fixada;

  // Reordenar: fixadas vão pro topo
  anotacoes[pessoaAtiva] = [
    ...lista.filter(a => a.fixada),
    ...lista.filter(a => !a.fixada)
  ];

  localStorage.setItem('anotacoes', JSON.stringify(anotacoes));
  carregarBlocoAnotacoes();
}

document.getElementById('popup-anotacao').addEventListener('click', function (e) {
  if (e.target === this) fecharPopupAnotacao();
});

document.getElementById('popup-novo-local').addEventListener('click', function (e) {
  if (e.target === this) fecharNovoLocal();
});


document.addEventListener('keydown', function (e) {
  const popupAnotacaoAberto = document.getElementById('popup-anotacao')?.style.display === 'flex';
  const ativo = document.querySelector('.popup-confirmar, .modal-overlay');
  const foco = document.activeElement;

  if (!ativo || ativo.style.display === 'none') return;
  if (!foco || (foco.tagName !== 'TEXTAREA' && foco.tagName !== 'INPUT')) return;

  // ⏎ Enter pressionado SEM Shift
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();

    // Caso especial: anotação → salvar direto
    if (popupAnotacaoAberto) {
      salvarAnotacao();
      return;
    }

    // Caso geral: clica no botão "Salvar" ou "Confirmar" do popup
    const botoes = ativo.querySelectorAll('button');
    for (let btn of botoes) {
      const texto = btn.textContent?.toLowerCase().trim();
      if (['salvar', 'confirmar'].includes(texto)) {
        btn.click();
        break;
      }
    }
  }
});



window.onload = carregarDados;


// Evitar quebra de linha no textarea de anotação e salvar ao pressionar Enter
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('inputTextoAnotacao');
  if (textarea) {
    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        salvarAnotacao();
      }
    });
  }
});
