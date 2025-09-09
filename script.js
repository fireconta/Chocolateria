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
  },
  share: {
    baseUrl: window.location.origin + window.location.pathname,
    hashtag: '#BrigadeiroGigante',
    groupDiscountThreshold: 3,
    groupDiscountRate: 0.1
  },
  pricing: {
    basePrice: 189.90,
    standardDiscount: 0.1 // 10% OFF padrão
  }
};

// Estado do grupo e endereço
const state = {
  group: {
    groupCode: null,
    groupSize: 0,
    privateShared: false,
    publicShared: false
  },
  address: {
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: ''
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

// Configurar vídeo do hero
function setHeroVideo() {
  const heroVideo = document.querySelector('#hero-video source');
  if (!heroVideo) {
    console.error('Hero video source not found');
    toast('Erro ao carregar o vídeo principal');
    return;
  }
  heroVideo.src = config.videos[0];
  const videoElement = heroVideo.parentElement;
  videoElement.load();

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
      <video autoplay loop playsinline muted id="${videoId}" data-muted="true">
        <source src="${videoSrc}" type="video/mp4">
      </video>
      <button class="btn audio-btn" data-video-id="${videoId}" aria-controls="${videoId}" onclick="toggleAudio('${videoId}')" aria-label="Ativar áudio do vídeo ${index + 2}" tabindex="0">🔇</button>
      <p class="mini muted">Vídeo ${index + 2}</p>
    `;
    gallery.appendChild(videoCard);
  });
}

// Alternar áudio do vídeo
function toggleAudio(videoId) {
  const video = document.getElementById(videoId);
  const button = document.querySelector(`[data-video-id="${videoId}"]`);
  if (!video || !button) {
    console.error(`Video or button not found for ID: ${videoId}`);
    return;
  }

  const isMuted = video.getAttribute('data-muted') === 'true';

  document.querySelectorAll('video').forEach(v => {
    if (v.id !== videoId) {
      v.muted = true;
      v.setAttribute('data-muted', 'true');
      const btn = document.querySelector(`[data-video-id="${v.id}"]`);
      if (btn) {
        btn.textContent = '🔇';
        btn.setAttribute('aria-label', `Ativar áudio do vídeo ${v.id.includes('hero') ? 'principal' : v.id.split('-')[2]}`);
      }
    }
  });

  video.muted = !isMuted;
  video.setAttribute('data-muted', !isMuted);
  button.textContent = isMuted ? '🔊' : '🔇';
  button.setAttribute('aria-label', `${isMuted ? 'Desativar' : 'Ativar'} áudio do vídeo ${videoId.includes('hero') ? 'principal' : videoId.split('-')[2]}`);
  toast(`Áudio do vídeo ${videoId.includes('hero') ? 'principal' : videoId.split('-')[2]} ${isMuted ? 'ativado' : 'desativado'}`);
}

// Configurar Intersection Observer
function setupVideoObserver() {
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported');
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      const button = document.querySelector(`[data-video-id="${video.id}"]`);
      if (entry.isIntersecting) {
        video.play().catch(e => console.error(`Play failed for ${video.id}:`, e));
        document.querySelectorAll('video').forEach(v => {
          if (v.id !== video.id) {
            v.muted = true;
            v.setAttribute('data-muted', 'true');
            v.pause();
            const btn = document.querySelector(`[data-video-id="${v.id}"]`);
            if (btn) {
              btn.textContent = '🔇';
              btn.setAttribute('aria-label', `Ativar áudio do vídeo ${v.id.includes('hero') ? 'principal' : v.id.split('-')[2]}`);
            }
          }
        });
        video.muted = false;
        video.setAttribute('data-muted', 'false');
        if (button) {
          button.textContent = '🔊';
          button.setAttribute('aria-label', `Desativar áudio do vídeo ${video.id.includes('hero') ? 'principal' : video.id.split('-')[2]}`);
          toast(`Áudio do vídeo ${video.id.includes('hero') ? 'principal' : video.id.split('-')[2]} ativado automaticamente`);
        }
      } else {
        video.pause();
        video.muted = true;
        video.setAttribute('data-muted', 'true');
        if (button) {
          button.textContent = '🔇';
          button.setAttribute('aria-label', `Ativar áudio do vídeo ${video.id.includes('hero') ? 'principal' : v.id.split('-')[2]}`);
        }
      }
    });
  }, {
    threshold: 0.5
  });

  document.querySelectorAll('video').forEach(video => observer.observe(video));
}

// Buscar endereço pelo CEP
async function fetchAddress() {
  const cepInput = document.getElementById('cep');
  if (!cepInput) return;
  const cep = cepInput.value.replace(/\D/g, '');
  const cepRegex = /^\d{8}$/;
  if (!cepRegex.test(cep)) {
    toast('CEP inválido! Use o formato 12345-678');
    return;
  }

  // Simulação de consulta à API de CEP (ex.: ViaCEP)
  try {
    // Para testes, simulo um endereço. Em produção, use: fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const response = {
      cep: cep,
      logradouro: 'Rua Exemplo',
      bairro: 'Bairro Exemplo',
      localidade: 'São Paulo',
      uf: 'SP',
      erro: false
    };

    // Em produção, descomente:
    // const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(res => res.json());

    if (response.erro) {
      toast('CEP não encontrado!');
      return;
    }

    state.address.cep = cep;
    state.address.street = response.logradouro;
    state.address.neighborhood = response.bairro;
    state.address.city = response.localidade;
    state.address.state = response.uf;

    const streetInput = document.getElementById('street');
    const neighborhoodInput = document.getElementById('neighborhood');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const addressInput = document.getElementById('address-input');
    const cepInputContainer = document.getElementById('cep-input');
    const freteMessage = document.getElementById('frete-message');
    const locationMessage = document.getElementById('location-message');

    if (streetInput && neighborhoodInput && cityInput && stateInput && addressInput && cepInputContainer && freteMessage && locationMessage) {
      streetInput.value = response.logradouro;
      neighborhoodInput.value = response.bairro;
      cityInput.value = response.localidade;
      stateInput.value = response.uf;
      addressInput.style.display = 'block';
      cepInputContainer.style.display = 'none';
      freteMessage.textContent = 'Frete: Grátis (filial a 2,7 km)';
      locationMessage.style.display = 'block';
      toast('Endereço carregado! Insira o número.');
    }
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    toast('Erro ao buscar endereço. Tente novamente.');
  }
}

// Abrir modal de compartilhamento
function openShareModal() {
  const shareModal = document.getElementById('share-modal');
  if (shareModal) {
    shareModal.classList.add('show');
    updateGroupProgress();
  }
}

// Compartilhar grupo privado (WhatsApp)
function sharePrivateGroup() {
  const groupCode = state.group.groupCode || generateGroupCode();
  state.group.groupCode = groupCode;
  state.group.privateShared = true;
  const shareUrl = `${config.share.baseUrl}?ref=${groupCode}`;
  const message = `Junte-se ao meu grupo para comprar o Brigadeiro Gigante com 10% OFF extra via Pix! Use o código ${groupCode}: ${shareUrl}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Brigadeiro Gigante – Chocolatria',
      text: message,
      url: shareUrl
    }).then(() => {
      toast('Link compartilhado com sucesso!');
      updateGroupProgress();
    }).catch(() => {
      toast('Erro ao compartilhar. Copie o link manualmente.');
    });
  } else {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    toast('Compartilhe o link pelo WhatsApp!');
    updateGroupProgress();
  }
}

// Compartilhar grupo público (redes sociais)
function sharePublicGroup() {
  const message = `Descubra o Brigadeiro Gigante da Chocolatria! Edição limitada, perfeito para surpreender! ${config.share.hashtag} ${config.share.baseUrl}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Brigadeiro Gigante – Chocolatria',
      text: message,
      url: config.share.baseUrl
    }).then(() => {
      state.group.publicShared = true;
      toast('Post compartilhado nas redes sociais!');
      updateGroupProgress();
    }).catch(() => {
      toast('Erro ao compartilhar. Copie o link manualmente.');
    });
  } else {
    toast(`Compartilhe nas redes com ${config.share.hashtag}: ${config.share.baseUrl}`);
    state.group.publicShared = true;
    updateGroupProgress();
  }
}

// Compartilhar por e-mail
function shareViaEmail() {
  const groupCode = state.group.groupCode || generateGroupCode();
  state.group.groupCode = groupCode;
  state.group.privateShared = true;
  const shareUrl = `${config.share.baseUrl}?ref=${groupCode}`;
  const subject = 'Convite: Brigadeiro Gigante com 10% OFF!';
  const body = `Junte-se ao meu grupo para comprar o Brigadeiro Gigante com 10% OFF extra via Pix! Use o código ${groupCode}: ${shareUrl}`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  toast('Convite enviado por e-mail!');
  updateGroupProgress();
}

// Copiar link de compartilhamento
function copyShareLink() {
  const groupCode = state.group.groupCode || generateGroupCode();
  state.group.groupCode = groupCode;
  state.group.privateShared = true;
  const shareUrl = `${config.share.baseUrl}?ref=${groupCode}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    toast('Link de convite copiado!');
    updateGroupProgress();
  }).catch(() => {
    toast('Erro ao copiar o link');
  });
}

// Gerar código de grupo
function generateGroupCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Aplicar código de grupo
function applyGroupCode() {
  const groupCodeInput = document.getElementById('group-code');
  if (!groupCodeInput) return;
  const code = groupCodeInput.value.trim().toUpperCase();
  if (code && code.length !== 6) {
    toast('Código de grupo inválido! Use o formato ABC123');
    return;
  }
  state.group.groupCode = code || state.group.groupCode;
  state.group.groupSize = code ? Math.floor(Math.random() * 5) + 1 : state.group.groupSize; // Simulação
  updateGroupProgress();
  if (code) {
    toast(`Código ${code} aplicado! Grupo: ${state.group.groupSize}/${config.share.groupDiscountThreshold} pessoas`);
  }
}

// Atualizar progresso do grupo
function updateGroupProgress() {
  const progressEl = document.getElementById('group-progress');
  if (progressEl) {
    const status = state.group.privateShared && state.group.publicShared ? 'Completo' : 'Pendente';
    progressEl.innerHTML = `Grupo: ${state.group.groupSize}/${config.share.groupDiscountThreshold} pessoas | Status: ${status}`;
    if (state.group.groupSize >= config.share.groupDiscountThreshold && state.group.privateShared && state.group.publicShared) {
      toast('Desconto de 10% extra aplicado para o grupo!');
    }
  }
}

// Verificar código de grupo na URL
function checkUrlForGroupCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  if (ref) {
    state.group.groupCode = ref.toUpperCase();
    state.group.groupSize = Math.floor(Math.random() * 5) + 1; // Simulação
    const groupCodeInput = document.getElementById('group-code');
    if (groupCodeInput) groupCodeInput.value = ref;
    updateGroupProgress();
    toast(`Código ${ref} aplicado automaticamente!`);
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

// Validação de Endereço
function validateAddress() {
  if (state.address.cep && !state.address.number) {
    toast('Por favor, insira o número do endereço!');
    return false;
  }
  if (!state.address.cep || !state.address.street || !state.address.neighborhood || !state.address.city || !state.address.state) {
    toast('Endereço incompleto! Busque o CEP novamente.');
    return false;
  }
  return true;
}

// Checkout
function checkout() {
  const sabor = document.querySelector('input[name="sabor"]:checked')?.nextElementSibling.textContent.trim();
  const entrega = document.querySelector('input[name="retirada"]:checked')?.value;
  const data = document.getElementById('date')?.value || 'a combinar';
  let preco = config.pricing.basePrice;
  const numberInput = document.getElementById('number');
  const groupCode = state.group.groupCode || '';

  // Validações
  if (!sabor) {
    toast('Selecione um sabor');
    return;
  }
  if (entrega === 'Entrega' && !validateAddress()) {
    return;
  }
  if (data !== 'a combinar' && !validateDate()) {
    return;
  }
  if (stockCount === 0) {
    toast('Estoque esgotado! Aguarde a reposição.');
    return;
  }

  // Aplicar descontos
  let discountText = 'Desconto: 10% OFF aplicado!';
  preco = preco * (1 - config.pricing.standardDiscount); // 10% OFF padrão
  if (state.group.groupSize >= config.share.groupDiscountThreshold && state.group.privateShared && state.group.publicShared) {
    preco = preco * (1 - config.share.groupDiscountRate); // 10% OFF extra
    discountText = 'Desconto: 10% OFF + 10% OFF extra (grupo) aplicado!';
  }

  // Resumo do pedido
  const addressSummary = entrega === 'Entrega' ? `
    • Endereço: ${state.address.street}, ${state.address.number}, ${state.address.neighborhood}, ${state.address.city} - ${state.address.state}, CEP: ${state.address.cep}
    • Frete: Grátis (filial a 2,7 km)
  ` : '• Retirada no ateliê';
  
  const summary = `
    <strong>Resumo do Pedido:</strong><br>
    • Sabor: ${sabor}<br>
    • Opção: ${entrega}<br>
    ${addressSummary}<br>
    • Data: ${data}<br>
    • Preço: R$ ${preco.toFixed(2).replace('.', ',')}<br>
    ${groupCode ? '• Código do Grupo: ' + groupCode + '<br>' : ''}
    • <strong>${discountText}</strong>
  `;
  
  const orderSummary = document.getElementById('order-summary');
  const pixKeyText = document.getElementById('pix-key-text');
  const confirmationModal = document.getElementById('confirmation-modal');
  if (orderSummary && pixKeyText && confirmationModal) {
    orderSummary.innerHTML = summary;
    pixKeyText.textContent = config.pix.pixKey;
    confirmationModal.classList.add('show');
    toast('Pedido finalizado! Confirme os detalhes.');
    if (numberInput) numberInput.value = ''; // Limpa número após checkout
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

// Mostrar/Esconder Inputs de Localização
function checkLocation() {
  const entrega = document.querySelector('input[name="retirada"]:checked')?.value;
  const cepInput = document.getElementById('cep-input');
  const addressInput = document.getElementById('address-input');
  const locationMessage = document.getElementById('location-message');
  if (cepInput && addressInput && locationMessage) {
    cepInput.style.display = entrega === 'Entrega' ? 'block' : 'none';
    addressInput.style.display = entrega === 'Entrega' && state.address.cep ? 'block' : 'none';
    locationMessage.style.display = entrega === 'Entrega' && state.address.cep ? 'block' : 'none';
  }
}

function hideLocationInputs() {
  const cepInput = document.getElementById('cep-input');
  const addressInput = document.getElementById('address-input');
  const locationMessage = document.getElementById('location-message');
  if (cepInput && addressInput && locationMessage) {
    cepInput.style.display = 'none';
    addressInput.style.display = 'none';
    locationMessage.style.display = 'none';
    state.address = { cep: '', street: '', number: '', neighborhood: '', city: '', state: '' }; // Resetar endereço
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  checkImageLoad();
  setupSprinkles();
  setHeroVideo();
  setupVideoGallery();
  setupVideoObserver();
  checkLocation();
  startTimer();
  checkUrlForGroupCode();
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

// Temporizador
function startTimer() {
  let time = 10 * 60;
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
  const interval = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    time--;
    if (time < 0) {
      time = 10 * 60;
      toast('Oferta renovada por mais 10 minutos!');
    }
  }, 1000);
}

// Controle de estoque
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
