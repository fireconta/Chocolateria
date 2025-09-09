const pixKey = "sua-chave-pix-aqui@example.com";
const pixQrCodeUrl = "https://placehold.co/200x200?text=QR+Code+Pix";

// Granulado animado
const spr = document.getElementById('sprinkles');
for (let i = 0; i < 160; i++) {
  const el = document.createElement('i');
  el.style.setProperty('--r', `${Math.random() * 80 - 40}deg`);
  el.style.setProperty('--tx', `${Math.random() * 240 - 120}%`);
  el.style.setProperty('--ty', `${Math.random() * 240 - 120}%`);
  el.style.left = Math.random() * 100 + '%';
  el.style.top = Math.random() * 100 + '%';
  el.style.opacity = Math.random() * 0.35 + 0.65;
  spr.appendChild(el);
}

// Funções utilitárias
function scrollToEl(sel) {
  document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
}

function toast(text) {
  const t = document.getElementById('toast');
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

// Temporizador de Urgência
function startTimer() {
  let time = 10 * 60; // 10 minutos
  const timerEl = document.getElementById('timer');
  const interval = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    time--;
    if (time < 0) {
      time = 10 * 60; // Reinicia o temporizador
      toast('Oferta renovada por mais 10 minutos!');
    }
  }, 1000);
}
startTimer();

// Controle de estoque animado
let stockCount = 5;
const stockEl = document.getElementById('stock-alert');
setInterval(() => {
  if (stockCount > 0) {
    stockCount--;
    stockEl.textContent = `Apenas ${stockCount} unidades disponíveis!`;
    if (stockCount === 0) {
      setTimeout(() => {
        stockCount = 5;
        stockEl.textContent = `Apenas ${stockCount} unidades disponíveis!`;
        toast('Estoque reposto! Garanta o seu agora!');
      }, 5000);
    }
  }
}, 15000);

// Validação de CEP
function submitCep() {
  const cep = document.getElementById('cep').value;
  const cepRegex = /^\d{5}-?\d{3}$/;
  if (!cepRegex.test(cep)) {
    toast('CEP inválido! Use o formato 12345-678');
    return;
  }
  document.getElementById('frete-message').textContent = 'Frete: Grátis (filial a 2,7 km)';
  document.getElementById('location-message').style.display = 'block';
  document.getElementById('cep-input').style.display = 'none';
}

// Validação de Data
function validateDate() {
  const dateInput = document.getElementById('date').value;
  const selectedDate = new Date(dateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    toast('Selecione uma data futura!');
    document.getElementById('date').value = '';
    return false;
  }
  return true;
}

// Checkout
function checkout() {
  const sabor = document.querySelector('input[name="sabor"]:checked')?.nextElementSibling.textContent.trim();
  const entrega = document.querySelector('input[name="retirada"]:checked')?.value;
  const data = document.getElementById('date').value || 'a combinar';
  const preco = document.getElementById('price').textContent;
  const cep = document.getElementById('cep')?.value || '';
  const freteMessage = entrega === 'Entrega' ? 'Frete: Grátis (filial a 2,7 km)' : 'Retirada no ateliê';

  if (!sabor) {
    toast('Selecione um sabor');
    return;
  }
  if (entrega === 'Entrega' && !document.getElementById('frete-message').textContent) {
    toast('Permita geolocalização ou insira CEP');
    return;
  }
  if (data !== 'a combinar' && !validateDate()) {
    return;
  }

  const summary = `
    <strong>Resumo do Pedido:</strong><br>
    • Sabor: ${sabor}<br>
    • Opção: ${entrega}<br>
    • ${freteMessage}<br>
    • Data: ${data}<br>
    • Preço: R$ ${preco}<br>
    ${cep ? '• CEP: ' + cep : ''}<br>
    • <strong>Desconto: 10% OFF aplicado!</strong>
  `;
  document.getElementById('order-summary').innerHTML = summary;
  document.getElementById('pix-key-text').textContent = pixKey;
  document.getElementById('confirmation-modal').classList.add('show');
}

// Copiar Chave Pix
function copyPixKey() {
  navigator.clipboard.writeText(pixKey).then(() => {
    toast('Chave Pix copiada!');
  });
}

// Compartilhar
function share() {
  if (navigator.share) {
    navigator.share({
      title: 'Brigadeiro Gigante – Chocolatria',
      text: 'Descubra o Brigadeiro Gigante da Chocolatria! Edição limitada, perfeito para surpreender!',
      url: window.location.href,
    });
  } else {
    toast('Compartilhe o link: ' + window.location.href);
  }
}

// Mostrar/Esconder Inputs de Localização
function checkLocation() {
  const entrega = document.querySelector('input[name="retirada"]:checked')?.value;
  document.getElementById('cep-input').style.display = entrega === 'Entrega' ? 'block' : 'none';
  document.getElementById('location-message').style.display = 'none';
}

function hideLocationInputs() {
  document.getElementById('cep-input').style.display = 'none';
  document.getElementById('location-message').style.display = 'none';
}
