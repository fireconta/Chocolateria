// 

// Render header
document.getElementById('header').innerHTML = `
<div class="container nav">
  <div class="brand">
    <div class="logo" aria-hidden="true"></div>
    <h1>Chocolatria</h1>
  </div>
  <nav style="display:flex;gap:14px;align-items:center">
    <a href="#sabores" class="mini">Sabores</a>
    <a href="#como-fazer" class="mini">Como funciona</a>
    <a href="#videos" class="mini">Vídeos</a>
    <a href="#comprar" class="mini">Comprar</a>
  </nav>
</div>
`;

// Render Hero
document.getElementById('hero').innerHTML = `
<div class="container heroInner">
  <div>
    <span class="pill">Edição limitada • Feito à mão</span>
    <h2 class="headline">Brigadeiro Gigante<br/>para presentear sem moderação.</h2>
    <p class="sub">Casquinha de chocolate belga, recheado com brigadeiro cremoso e granulado premium.</p>
    <div class="stats">
      <div class="stat"><strong>± 1,2 kg</strong><div class="mini">peso aproximado</div></div>
      <div class="stat"><strong>72 h</strong><div class="mini">produção sob demanda</div></div>
      <div class="stat"><strong>Entrega</strong><div class="mini">SP e região (retirada disponível)</div></div>
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      <button class="btn" onclick="document.querySelector('#comprar').scrollIntoView({behavior:'smooth'})">Quero garantir o meu</button>
      <button class="btn secondary" onclick="document.querySelector('#sabores').scrollIntoView({behavior:'smooth'})">Ver sabores</button>
    </div>
    <p class="mini" style="margin-top:8px">Fotos ilustrativas. Produto artesanal, variações são esperadas.</p>
  </div>
  <div class="imgWrap">
    <div class="bigBrigadeiro">
      <div class="choco" aria-label="Brigadeiro gigante ilustrado">
        <div class="sprinkles" id="sprinkles"></div>
        <div class="cup" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</div>
`;

// Render Sabores
document.getElementById('sabores').innerHTML = `
<h2>Sabores Disponíveis</h2>
<div class="grid cols-2">
  <div class="card">Chocolate ao Leite</div>
  <div class="card">Chocolate Meio Amargo</div>
</div>
`;

// Render Como Funciona
document.getElementById('como-fazer').innerHTML = `
<h2>Como Funciona</h2>
<ol class="list">
  <li>Escolha seu sabor favorito</li>
  <li>Calcule o frete (gratuito)</li>
  <li>Finalize o pedido via WhatsApp</li>
</ol>
`;

// Render Vídeos
document.getElementById('videos').innerHTML = `
<h2>Veja como é irresistível</h2>
<div class="video-grid">
  <a href="https://www.instagram.com/reel/DGat3LzxnKC/" target="_blank" class="video-card"><img src="https://via.placeholder.com/220x220.png?text=Vídeo+1"><span>Reel 1</span></a>
  <a href="https://www.instagram.com/reel/DOJ8MfKASXr/" target="_blank" class="video-card"><img src="https://via.placeholder.com/220x220.png?text=Vídeo+2"><span>Reel 2</span></a>
  <a href="https://www.instagram.com/reel/DOH1dV6Db-5/" target="_blank" class="video-card"><img src="https://via.placeholder.com/220x220.png?text=Vídeo+3"><span>Reel 3</span></a>
  <a href="https://www.instagram.com/reel/DGjKvNgx536/" target="_blank" class="video-card"><img src="https://via.placeholder.com/220x220.png?text=Vídeo+4"><span>Reel 4</span></a>
</div>
`;

// Render Comprar
document.getElementById('comprar').innerHTML = `
<h2>Faça seu pedido</h2>
<p>Selecione seu sabor e calcule o frete:</p>
<select id="sabor">
  <option value="chocolateLeite">Chocolate ao Leite</option>
  <option value="chocolateMeioAmargo">Chocolate Meio Amargo</option>
</select>
<br>
<button class="btn" id="calcularFrete">Calcular Frete</button>
<p id="freteInfo" class="mini" style="margin-top:8px"></p>
<button class="btn" id="pedidoWhatsApp" style="display:none">Finalizar Pedido no WhatsApp</button>
`;

// Função de frete com geolocalização
const freteInfo = document.getElementById('freteInfo');
const pedidoBtn = document.getElementById('pedidoWhatsApp');
document.getElementById('calcularFrete').addEventListener('click', ()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const distancia = 2.7; // km fixo para demo
      freteInfo.innerText = `Encontramos uma filial a ${distancia} km de você. Frete grátis!`;
      pedidoBtn.style.display = 'inline-block';
    }, ()=>{
      const cep = prompt('Não conseguimos sua localização. Digite seu CEP:');
      freteInfo.innerText = `Encontramos uma filial próxima ao CEP ${cep}. Frete grátis!`;
      pedidoBtn.style.display = 'inline-block';
    });
  } else {
    const cep = prompt('Seu navegador não suporta geolocalização. Digite seu CEP:');
    freteInfo.innerText = `Encontramos uma filial próxima ao CEP ${cep}. Frete grátis!`;
    pedidoBtn.style.display = 'inline-block';
  }
});

pedidoBtn.addEventListener('click', ()=>{
  const sabor = document.getElementById('sabor').value;
  const linkWhatsApp = `https://wa.me/5511999999999?text=Olá! Quero pedir um brigadeiro gigante sabor ${sabor}.`; // substitua pelo seu número
  window.open(linkWhatsApp,'_blank');
});
