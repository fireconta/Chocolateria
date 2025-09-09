// Configurações
const config = {
  pix: {
    pixKey: "sua-chave-pix-aqui@example.com",
    pixQrCodeUrl: "https://placehold.co/200x200?text=QR+Code+Pix"
  },
  videos: [
    'Videos/Video01.mp4',
    'Videos/Video02.mp4',
    'Videos/Video03.mp4',
    'Videos/Video04.mp4'
  ],
  images: {
    logo: 'Imagens/Logoluci.png',
    brigadeiro: 'Imagens/Imagem2.jpeg'
  }
};

// Verificar carregamento de imagens
function checkImageLoad() {
  const logoImg = document.querySelector('.logo');
  const brigadeiroImg = document.querySelector('.thumb');
  
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      console.error(`Erro ao carregar a imagem do logo: ${config.images.logo}`);
      toast('Erro ao carregar o logo. Verifique o caminho da imagem.');
    });
    logoImg.addEventListener('load', () => {
      console.log(`Logo carregado com sucesso: ${config.images.logo}`);
    });
  }
  
  if (brigadeiroImg) {
    brigadeiroImg.addEventListener('error', () => {
      console.error(`Erro ao carregar a imagem do brigadeiro: ${config.images.brigadeiro}`);
      toast('Erro ao carregar a imagem do brigadeiro. Verifique o caminho da imagem.');
    });
    brigadeiroImg.addEventListener('load', () => {
      console.log(`Imagem do brigadeiro carregada com sucesso: ${config.images.brigadeiro}`);
    });
  }
}

// Granulado animado
function setupSprinkles() {
  const spr = document.getElementById('sprinkles');
  if (!spr) {
    console.error('Sprinkles container not found');
    return;
  }
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
}

// Configurar vídeo do hero com autoplay garantido
function setHeroVideo() {
  const heroVideo = document.querySelector('#hero-video source');
  if (!heroVideo) {
    console.error('Hero video source not found');
    toast('Erro ao carregar o vídeo principal');
    return;
  }
  heroVideo.src = config.videos[0]; // Usa Video01.mp4 para o hero
  const videoElement = heroVideo.parentElement;
  videoElement.load(); // Recarrega o vídeo

  // Força autoplay com retry
  function tryPlay(attempts = 3, delay = 500) {
    videoElement.play().catch(e => {
      console.warn(`Autoplay attempt failed: ${e.message}`);
      if (attempts > 0) {
        setTimeout(() => tryPlay(attempts - 1, delay * 2), delay);
      } else {
        console.error('Autoplay failed after retries');
        toast('Toque no vídeo para iniciar a reprodução');
      }
    });
  }

  videoElement.addEventListener('loadeddata', () => {
    tryPlay();
  }, { once: true });

  // Fallback para interação do usuário
  videoElement.addEventListener('click', () => {
    if (videoElement.paused) {
      videoElement.play().catch(e => console.error('Manual play failed:', e));
    }
  });
}

// Configurar galeria de vídeos
function setupVideoGallery() {
  const gallery = document.getElementById('video-gallery');
  if (!gallery) {
    console.error('Video gallery container not found');
    return;
  }
  config.videos.slice(1).forEach((videoSrc, index) => {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    const videoId = `gallery-video-${index}`;
    videoCard.innerHTML = `
      <video autoplay loop playsinline muted id="${videoId}">
        <source src="${videoSrc}" type="video/mp4">
      </video>
      <p class="mini muted">Vídeo ${index + 2}</p>
    `;
    gallery.appendChild(videoCard);
  });
}

// Configurar Intersection Observer para pausar/reproduzir vídeos
function setupVideoObserver() {
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported');
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Reproduzir vídeo visível
        video.play().catch(e => console.error(`Play failed for ${video.id}:`, e));
      } else {
        // Pausar vídeo fora da tela
        video.pause();
      }
    });
  }, {
    threshold: 0.5 // Ativar/pausar quando 50% do vídeo estiver visível
  });

  // Observar todos os vídeos
  document.querySelectorAll('video').forEach(video => observer.observe(video));
}

// Chama as funções ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  checkImageLoad(); // Verificar carregamento de imagens
  setupSprinkles();
  setHeroVideo();
  setupVideoGallery();
  setupVideoObserver();
  checkLocation(); // Inicializa o estado do campo de CEP
  startTimer(); // Inicia o temporizador
});

// Funções utilitárias
function scrollToEl(sel) {
  const el = document.querySelector(sel);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toast(text) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

// Temporizador de Urgência
function startTimer() {
  let time = 10 * 60; // 10 minutos
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
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

// Controle de estoque animado
let stockCount = 5;
const stockEl = document.getElementById('stock-alert');
if (stockEl) {
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
}

// Validação de CEP
function submitCep() {
  const cepInput = document.getElementById('cep');
  if (!cepInput) return;
  const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  const cepRegex = /^\d{8}$/;
  if (!cepRegex.test(cep)) {
    toast('CEP inválido! Use o formato 12345-678');
    return;
  }
  const freteMessage = document.getElementById('frete-message');
  const locationMessage = document.getElementById('location-message');
  const cepInputContainer = document.getElementById('cep-input');
  if (freteMessage && locationMessage && cepInputContainer) {
    freteMessage.textContent = 'Frete: Grátis (filial a 2,7 km)';
    locationMessage.style.display = 'block';
    cepInputContainer.style.display = 'none';
  }
}

// Validação de Data
function validateDate() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return false;
  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    toast('Selecione uma data futura!');
    dateInput.value = '';
    return false;
  }
  return true;
}

// Checkout
function checkout() {
  const sabor = document.querySelector('input[name="sabor"]:checked')?.nextElementSibling.textContent.trim();
  const entrega = document.querySelector('input[name="retirada"]:checked')?.value;
  const data = document.getElementById('date')?.value || 'a combinar';
  const preco = document.getElementById('price')?.textContent;
  const cep = document.getElementById('cep')?.value || '';
  const freteMessage = entrega === 'Entrega' && cep ? 'Frete: Grátis (filial a 2,7 km)' : entrega === 'Entrega' ? 'Informe o CEP' : 'Retirada no ateliê';

  if (!sabor) {
    toast('Selecione um sabor');
    return;
  }
  if (entrega === 'Entrega' && !cep) {
    toast('Por favor, insira o CEP para entrega');
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
  const orderSummary = document.getElementById('order-summary');
  const pixKeyText = document.getElementById('pix-key-text');
  const confirmationModal = document.getElementById('confirmation-modal');
  if (orderSummary && pixKeyText && confirmationModal) {
    orderSummary.innerHTML = summary;
    pixKeyText.textContent = config.pix.pixKey;
    confirmationModal.classList.add('show');
  }
}

// Copiar Chave Pix
function copyPixKey() {
  navigator.clipboard.writeText(config.pix.pixKey).then(() => {
    toast('Chave Pix copiada!');
  }).catch(() => {
    toast('Erro ao copiar a chave Pix');
  });
}

// Compartilhar
function share() {
  if (navigator.share) {
    navigator.share({
      title: 'Brigadeiro Gigante – Chocolatria',
      text: 'Descubra o Brigadeiro Gigante da Chocolatria! Edição limitada, perfeito para surpreender!',
      url: window.location.href,
    }).catch(() => {
      toast('Erro ao compartilhar');
    });
  } else {
    toast('Compartilhe o link: ' + window.location.href);
  }
}

// Mostrar/Esconder Inputs de Localização
function checkLocation() {
  const entrega = document.querySelector('input[name="retirada"]:checked')?.value;
  const cepInput = document.getElementById('cep-input');
  const locationMessage = document.getElementById('location-message');
  if (cepInput && locationMessage) {
    cepInput.style.display = entrega === 'Entrega' ? 'block' : 'none';
    locationMessage.style.display = 'none';
  }
}

function hideLocationInputs() {
  const cepInput = document.getElementById('cep-input');
  const locationMessage = document.getElementById('location-message');
  if (cepInput && locationMessage) {
    cepInput.style.display = 'none';
    locationMessage.style.display = 'none';
  }
}
