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
    standardDiscount: 0.1, // 10% OFF padrão
    standardDiscountValue: 18.99, // R$ 18,99
    groupDiscountValue: 17.09 // R$ 17,09 (10% sobre R$ 170,91)
  },
  delivery: {
    cutoffHour: 16 // 16h para entrega no mesmo dia
  }
};

// Estado
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
  },
  whatsapp: '',
  name: ''
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
          button.setAttribute('aria-label', `Ativar áudio do vídeo ${video.id.includes('hero') ? 'principal' : video.id.split('-')[2]}`);
        }
      }
    });
  }, {
    threshold: 0.5
  });

  document.querySelectorAll('video').forEach(video => observer.observe(video));
}

// Autoformatação do WhatsApp
function formatWhatsApp(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length <= 2) {
    input.value = value;
  } else if (value.length <= 7) {
    input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  } else {
    input.value = `(${value.slice(0, 2)}) ${value.slice(2, value.length - 4)}-${value.slice(-4)}`;
  }
}

// Abrir modal de dados
function openDataModal() {
  const sabor = document.querySelector('input[name="sabor"]:checked')?.nextElementSibling.textContent.trim();
  if (!sabor) {
    toast('Selecione um sabor antes de continuar! 🍫');
    scrollToEl('#comprar');
    return;
  }
  if (stockCount === 0) {
    toast('Estoque esgotado! Aguarde a reposição. ⏳');
    return;
  }
  const dataModal = document.getElementById('data-modal');
  if (dataModal) {
    dataModal.classList.add('show');
    document.getElementById('date').value = '';
    document.getElementById('data-cep').value = state.address.cep || '';
    document.getElementById('data-street').value = state.address.street || '';
    document.getElementById('data-number').value = state.address.number || '';
    document.getElementById('data-neighborhood').value = state.address.neighborhood || '';
    document.getElementById('data-city').value = state.address.city || '';
    document.getElementById('data-state').value = state.address.state || '';
    document.getElementById('data-whatsapp').value = state.whatsapp || '';
    document.getElementById('data-name').value = state.name || '';
    document.getElementById('data-address-input').style.display = state.address.cep ? 'block' : 'none';
    updateDateInput(); // Configura data mínima no modal

    // Adicionar listener para formatação do WhatsApp
    const whatsappInput = document.getElementById('data-whatsapp');
    if (whatsappInput) {
      whatsappInput.addEventListener('input', () => formatWhatsApp(whatsappInput));
    }
  }
}

// Buscar endereço pelo CEP (usando API ViaCEP)
async function fetchAddress() {
  const cepInput = document.getElementById('data-cep');
  if (!cepInput) return;
  const cep = cepInput.value.replace(/\D/g, '');
  const cepRegex = /^\d{8}$/;
  if (!cepRegex.test(cep)) {
    toast('CEP inválido! Use o formato 12345-678 📍');
    return;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      toast('CEP não encontrado! 😕');
      return;
    }

    state.address.cep = cep;
    state.address.street = data.logradouro || '';
    state.address.neighborhood = data.bairro || '';
    state.address.city = data.localidade || '';
    state.address.state = data.uf || '';

    const streetInput = document.getElementById('data-street');
    const neighborhoodInput = document.getElementById('data-neighborhood');
    const cityInput = document.getElementById('data-city');
    const stateInput = document.getElementById('data-state');
    const addressInput = document.getElementById('data-address-input');

    if (streetInput && neighborhoodInput && cityInput && stateInput && addressInput) {
      streetInput.value = data.logradouro || '';
      neighborhoodInput.value = data.bairro || '';
      cityInput.value = data.localidade || '';
      stateInput.value = data.uf || '';
      addressInput.style.display = 'block';
      toast('Endereço carregado! Insira o número, WhatsApp e nome. ✅');
    }
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    toast('Erro ao buscar endereço. Tente novamente. 🔄');
  }
}

// Confirmar dados do modal
function confirmData() {
  if (!validateDate()) return;
  const numberInput = document.getElementById('data-number');
  if (numberInput) {
    state.address.number = numberInput.value.trim();
  }
  if (!validateAddress()) return;
  if (!validateWhatsApp()) return;
  if (!validateName()) return;
  checkout();
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
  const message = `Junte-se ao meu grupo para comprar o Brigadeiro Gigante com 10% OFF extra (R$ 17,09)! Use o código ${groupCode}: ${shareUrl}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Brigadeiro Gigante – Chocolatria',
      text: message,
      url: shareUrl
    }).then(() => {
      toast('Link compartilhado com sucesso! 🎉');
      updateGroupProgress();
    }).catch(() => {
      toast('Erro ao compartilhar. Copie o link manualmente. 🔗');
    });
  } else {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    toast('Compartilhe o link pelo WhatsApp! 📲');
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
      toast('Post compartilhado nas redes sociais! 📸');
      updateGroupProgress();
    }).catch(() => {
      toast('Erro ao compartilhar. Copie o link manualmente. 🔗');
    });
  } else {
    toast(`Compartilhe nas redes com ${config.share.hashtag}: ${config.share.baseUrl} 📷`);
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
  const body = `Junte-se ao meu grupo para comprar o Brigadeiro Gigante com 10% OFF extra (R$ 17,09)! Use o código ${groupCode}: ${shareUrl}`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  toast('Convite enviado por e-mail! 📧');
  updateGroupProgress();
}

// Copiar link de compartilhamento
function copyShareLink() {
  const groupCode = state.group.groupCode || generateGroupCode();
  state.group.groupCode = groupCode;
  state.group.privateShared = true;
  const shareUrl = `${config.share.baseUrl}?ref=${groupCode}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    toast('Link de convite copiado! 🔗');
    updateGroupProgress();
  }).catch(() => {
    toast('Erro ao copiar o link 😕');
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
    toast('Código de grupo inválido! Use o formato ABC123 😕');
    return;
  }
  state.group.groupCode = code || state.group.groupCode;
  state.group.groupSize = code ? Math.floor(Math.random() * 5) + 1 : state.group.groupSize; // Simulação
  updateGroupProgress();
  if (code) {
    toast(`Código ${code} aplicado! Grupo: ${state.group.groupSize}/${config.share.groupDiscountThreshold} pessoas 🎉`);
  }
}

// Atualizar progresso do grupo
function updateGroupProgress() {
  const progressEl = document.getElementById('group-progress');
  if (progressEl) {
    const status = state.group.privateShared && state.group.publicShared ? 'Completo' : 'Pendente';
    progressEl.innerHTML = `Grupo: ${state.group.groupSize}/${config.share.groupDiscountThreshold} pessoas | Status: ${status}`;
    if (state.group.groupSize >= config.share.groupDiscountThreshold && state.group.privateShared && state.group.publicShared) {
      toast('Desconto de 10% extra (R$ 17,09) aplicado para o grupo! 🎁');
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
    toast(`Código ${ref} aplicado automaticamente! 🎉`);
  }
}

// Validação de Data
function validateDate() {
  const dateInput = document.getElementById('date');
  if (!dateInput) {
    console.error('Campo de data (#date) não encontrado');
    toast('Erro interno: campo de data não encontrado. 😕');
    return false;
  }
  const selectedDateStr = dateInput.value;
  if (!selectedDateStr) {
    console.warn('Nenhuma data selecionada');
    toast('Selecione a data de entrega! 📅');
    dateInput.focus();
    return false;
  }
  const selectedDate = new Date(selectedDateStr);
  if (isNaN(selectedDate.getTime())) {
    console.warn('Data inválida fornecida:', selectedDateStr);
    toast('Formato de data inválido! Use o formato DD/MM/AAAA 📅');
    dateInput.value = '';
    dateInput.focus();
    return false;
  }
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentHour = now.getHours();
  
  selectedDate.setHours(0, 0, 0, 0);
  
  console.log(`Validando data: ${selectedDateStr} (Selecionada: ${selectedDate.toLocaleDateString('pt-BR')}, Mínima: ${today.toLocaleDateString('pt-BR')})`);
  
  if (selectedDate < today) {
    toast(`Data inválida! Escolha a partir de ${today.toLocaleDateString('pt-BR')} 📅`);
    dateInput.value = '';
    dateInput.focus();
    return false;
  }
  
  if (currentHour >= config.delivery.cutoffHour && selectedDate.getTime() === today.getTime()) {
    toast('Entregas no mesmo dia após 16h podem ter prazo estendido. 🚚');
  }
  
  return true;
}

// Configurar data mínima
function updateDateInput() {
  const dateInput = document.getElementById('date');
  if (!dateInput) {
    console.error('Campo de data (#date) não encontrado');
    toast('Erro interno: campo de data não encontrado. 😕');
    return;
  }
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minDateStr = today.toISOString().split('T')[0]; // Data mínima é hoje
  dateInput.min = minDateStr;
  console.log(`Data mínima definida: ${minDateStr} (Horário atual: ${now.toLocaleString('pt-BR')})`);
  
  // Limpar valor se for anterior à data mínima
  if (dateInput.value) {
    const selectedDate = new Date(dateInput.value);
    if (isNaN(selectedDate.getTime())) {
      console.warn('Data inválida no campo:', dateInput.value);
      toast('Formato de data inválido! Selecione uma data válida. 📅');
      dateInput.value = '';
      dateInput.focus();
      return;
    }
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      console.warn(`Data selecionada (${dateInput.value}) é anterior à mínima (${minDateStr})`);
      toast(`Data inválida! Escolha a partir de ${today.toLocaleDateString('pt-BR')} 📅`);
      dateInput.value = '';
      dateInput.focus();
    }
  }
}

// Validação de Endereço
function validateAddress() {
  if (!state.address.cep || !state.address.street || !state.address.number || !state.address.neighborhood || !state.address.city || !state.address.state) {
    toast('Endereço incompleto! Busque o CEP e insira o número. 📍');
    return false;
  }
  return true;
}

// Validação de WhatsApp
function validateWhatsApp() {
  const whatsappInput = document.getElementById('data-whatsapp');
  if (!whatsappInput) return false;
  const whatsapp = whatsappInput.value.replace(/\D/g, '');
  const whatsappRegex = /^\d{10,11}$/;
  if (!whatsappRegex.test(whatsapp)) {
    toast('Número de WhatsApp inválido! Use o formato (XX) XXXXX-XXXX 📱');
    whatsappInput.classList.add('invalid');
    whatsappInput.focus();
    return false;
  }
  whatsappInput.classList.remove('invalid');
  state.whatsapp = whatsapp;
  return true;
}

// Validação de Nome Completo
function validateName() {
  const nameInput = document.getElementById('data-name');
  if (!nameInput) return false;
  const name = nameInput.value.trim();
  const nameRegex = /^[A-Za-z\s]{3,}$/;
  if (!nameRegex.test(name)) {
    toast('Nome completo inválido! Use pelo menos 3 letras. 😊');
    return false;
  }
  state.name = name;
  return true;
}

// Checkout
function checkout() {
  const sabor = document.querySelector('input[name="sabor"]:checked')?.nextElementSibling.textContent.trim();
  const data = document.getElementById('date')?.value;
  let preco = config.pricing.basePrice;
  const groupCode = state.group.groupCode || '';

  // Aplicar descontos
  let discountText = `Desconto: 10% OFF (R$ ${config.pricing.standardDiscountValue.toFixed(2).replace('.', ',')}) aplicado!`;
  preco = preco * (1 - config.pricing.standardDiscount); // 10% OFF padrão
  let groupDiscountApplied = false;
  if (state.group.groupSize >= config.share.groupDiscountThreshold && state.group.privateShared && state.group.publicShared) {
    preco = preco * (1 - config.share.groupDiscountRate); // 10% OFF extra
    groupDiscountApplied = true;
    discountText = `Desconto: 10% OFF (R$ ${config.pricing.standardDiscountValue.toFixed(2).replace('.', ',')}) + 10% OFF extra (R$ ${config.pricing.groupDiscountValue.toFixed(2).replace('.', ',')}) aplicado!`;
  }

  // Resumo do pedido
  const summary = `
    <strong>Resumo do Pedido:</strong><br>
    • Sabor: ${sabor}<br>
    • Nome: ${state.name}<br>
    • Endereço: ${state.address.street}, ${state.address.number}, ${state.address.neighborhood}, ${state.address.city} - ${state.address.state}, CEP: ${state.address.cep}<br>
    • Frete: Grátis (filial a 2,7 km)<br>
    • Data de Entrega: ${new Date(data).toLocaleDateString('pt-BR')}<br>
    • WhatsApp: ${state.whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}<br>
    • Preço: R$ ${preco.toFixed(2).replace('.', ',')}<br>
    ${groupCode ? '• Código do Grupo: ' + groupCode + '<br>' : ''}
    • <strong>${discountText}</strong><br>
    • <strong class="highlight">Feito sob encomenda após pagamento!</strong>
  `;
  
  const orderSummary = document.getElementById('order-summary');
  const pixKeyText = document.getElementById('pix-key-text');
  const confirmationModal = document.getElementById('confirmation-modal');
  const dataModal = document.getElementById('data-modal');
  if (orderSummary && pixKeyText && confirmationModal && dataModal) {
    orderSummary.innerHTML = summary;
    pixKeyText.textContent = config.pix.pixKey;
    dataModal.classList.remove('show');
    confirmationModal.classList.add('show');
    toast('🚚 Dados confirmados! Prossiga para o pagamento. 💸');
    document.getElementById('date').value = '';
    document.getElementById('data-number').value = '';
    document.getElementById('data-whatsapp').value = '';
    document.getElementById('data-name').value = '';
    state.address.number = '';
    state.whatsapp = '';
    state.name = '';
  }
}

// Copiar Chave Pix
function copyPixKey() {
  navigator.clipboard.writeText(config.pix.pixKey).then(() => {
    toast('Chave Pix copiada! 💸');
  }).catch(() => {
    toast('Erro ao copiar a chave Pix 😕');
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  checkImageLoad();
  setupSprinkles();
  setHeroVideo();
  setupVideoGallery();
  setupVideoObserver();
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
      toast('Oferta renovada por mais 10 minutos! ⏳');
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
          toast('Estoque reposto! Garanta o seu agora! 🎉');
        }, 5000);
      }
    }
  }, 15000);
}
