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

// Controle de estoque
let stockCount = 5;

// Função para exibir toast
function toast(message) {
  const toastEl = document.getElementById('toast');
  if (toastEl) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }
}

// Scroll suave para elemento
function scrollToEl(id) {
  const element = document.querySelector(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Fechar modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

// Copiar chave Pix
function copyPixKey() {
  const pixKeyText = document.getElementById('pix-key-text');
  if (pixKeyText) {
    navigator.clipboard.writeText(pixKeyText.textContent).then(() => {
      toast('Chave Pix copiada com sucesso! 📋');
    }).catch(() => {
      toast('Erro ao copiar a chave Pix 😕');
    });
  }
}

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

// Autoformatação do CEP
function formatCEP(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  
  if (value.length <= 5) {
    input.value = value;
  } else {
    input.value = `${value.slice(0, 5)}-${value.slice(5)}`;
  }
  
  console.log(`CEP digitado: ${value}`);
  if (value.length === 8) {
    console.log('CEP completo, chamando fetchAddress');
    fetchAddress();
  } else {
    console.log('CEP incompleto, aguardando mais dígitos');
  }
}

// Buscar endereço pelo CEP
async function fetchAddress() {
  const cepInput = document.getElementById('data-cep');
  if (!cepInput) {
    console.error('Campo CEP (#data-cep) não encontrado');
    toast('Erro interno: campo CEP não encontrado 😕');
    return;
  }
  const cep = cepInput.value.replace(/\D/g, '');
  const cepRegex = /^\d{8}$/;
  if (!cepRegex.test(cep)) {
    console.warn(`CEP inválido: ${cep}`);
    toast('CEP inválido! Use o formato 12345-678 📍');
    updateFormStatus();
    return;
  }

  console.log(`Buscando endereço para CEP: ${cep}`);
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      console.warn(`CEP não encontrado: ${cep}`);
      toast('CEP não encontrado! 😕');
      updateFormStatus();
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
      cepInput.value = `${cep.slice(0, 5)}-${cep.slice(5)}`;
      console.log('Endereço carregado:', data);
      toast('Endereço carregado! Insira o número, WhatsApp e nome. ✅');
    } else {
      console.error('Campos de endereço não encontrados');
      toast('Erro interno: campos de endereço não encontrados 😕');
    }
    updateFormStatus();
  } catch (error) {
    console.error('Erro ao buscar endereço:', error.message);
    toast('Erro ao buscar endereço. Verifique sua conexão e tente novamente. 🔄');
    updateFormStatus();
  }
}

// Atualizar status do formulário
function updateFormStatus() {
  const dateInput = document.getElementById('date');
  const cepInput = document.getElementById('data-cep');
  const streetInput = document.getElementById('data-street');
  const numberInput = document.getElementById('data-number');
  const neighborhoodInput = document.getElementById('data-neighborhood');
  const cityInput = document.getElementById('data-city');
  const stateInput = document.getElementById('data-state');
  const whatsappInput = document.getElementById('data-whatsapp');
  const nameInput = document.getElementById('data-name');
  const statusEl = document.getElementById('form-status');
  const confirmBtn = document.getElementById('confirm-data-btn');

  if (!dateInput || !cepInput || !streetInput || !numberInput || !neighborhoodInput || !cityInput || !stateInput || !whatsappInput || !nameInput || !statusEl || !confirmBtn) {
    console.error('Um ou mais elementos do formulário não encontrados');
    toast('Erro interno: formulário incompleto 😕');
    return;
  }

  const selectedDateStr = dateInput.value;
  let isDateValid = false;
  if (selectedDateStr) {
    const selectedDate = new Date(selectedDateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentHour = now.getHours();
    selectedDate.setHours(0, 0, 0, 0);
    isDateValid = !isNaN(selectedDate.getTime()) && selectedDate >= today;
    if (selectedDate.getTime() === today.getTime() && currentHour >= config.delivery.cutoffHour) {
      isDateValid = false;
    }
    console.log(`Validação de data: ${selectedDateStr} -> ${isDateValid ? 'Válida' : 'Inválida'}`);
  } else {
    console.log('Data não preenchida');
  }

  const cep = cepInput.value.replace(/\D/g, '');
  const isCepValid = /^\d{8}$/.test(cep);
  console.log(`Validação de CEP: ${cep} -> ${isCepValid ? 'Válido' : 'Inválido'}`);

  const isAddressValid = cepInput.value.trim() && numberInput.value.trim() && cityInput.value.trim() && stateInput.value.trim();
  console.log(`Validação de endereço: CEP=${cepInput.value}, Número=${numberInput.value}, Cidade=${cityInput.value}, Estado=${stateInput.value} -> ${isAddressValid ? 'Válido' : 'Inválido'}`);

  const whatsapp = whatsappInput.value.replace(/\D/g, '');
  const isWhatsAppValid = /^\d{10,11}$/.test(whatsapp);
  console.log(`Validação de WhatsApp: ${whatsapp} -> ${isWhatsAppValid ? 'Válido' : 'Inválido'}`);

  const name = nameInput.value.trim();
  const isNameValid = /^[A-Za-z\s]{3,}$/.test(name);
  console.log(`Validação de nome: ${name} -> ${isNameValid ? 'Válido' : 'Inválido'}`);

  let statusMessage = '';
  if (!isDateValid) statusMessage += 'Data de entrega inválida ou não preenchida. ';
  if (!isCepValid) statusMessage += 'CEP inválido. ';
  if (!isAddressValid) statusMessage += 'Endereço incompleto (número, cidade ou estado faltando). ';
  if (!isWhatsAppValid) statusMessage += 'WhatsApp inválido. ';
  if (!isNameValid) statusMessage += 'Nome inválido (mínimo 3 letras). ';

  const allValid = isDateValid && isCepValid && isAddressValid && isWhatsAppValid && isNameValid;
  if (allValid) {
    statusEl.textContent = 'Todos os campos foram preenchidos corretamente! ✅';
    statusEl.style.color = 'var(--success)';
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
    confirmBtn.style.cursor = 'pointer';
    console.log('Formulário válido, botão Confirmar Dados habilitado');
  } else {
    statusEl.textContent = statusMessage || 'Preencha todos os campos obrigatórios! 🚫';
    statusEl.style.color = 'var(--danger)';
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.6';
    confirmBtn.style.cursor = 'not-allowed';
    console.log('Formulário inválido:', statusMessage);
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
    updateDateInput();

    const whatsappInput = document.getElementById('data-whatsapp');
    const cepInput = document.getElementById('data-cep');
    const dateInput = document.getElementById('date');
    const numberInput = document.getElementById('data-number');
    const nameInput = document.getElementById('data-name');

    const newWhatsappInput = whatsappInput.cloneNode(true);
    const newCepInput = cepInput.cloneNode(true);
    const newDateInput = dateInput.cloneNode(true);
    const newNumberInput = numberInput.cloneNode(true);
    const newNameInput = nameInput.cloneNode(true);
    whatsappInput.parentNode.replaceChild(newWhatsappInput, whatsappInput);
    cepInput.parentNode.replaceChild(newCepInput, cepInput);
    dateInput.parentNode.replaceChild(newDateInput, dateInput);
    numberInput.parentNode.replaceChild(newNumberInput, numberInput);
    nameInput.parentNode.replaceChild(newNameInput, nameInput);

    newWhatsappInput.addEventListener('input', () => {
      formatWhatsApp(newWhatsappInput);
      state.whatsapp = newWhatsappInput.value.replace(/\D/g, '');
      updateFormStatus();
    });
    newCepInput.addEventListener('input', () => {
      formatCEP(newCepInput);
      updateFormStatus();
    });
    newDateInput.addEventListener('input', updateFormStatus);
    newNumberInput.addEventListener('input', updateFormStatus);
    newNameInput.addEventListener('input', updateFormStatus);

    console.log('Modal de dados aberto, inicializando validação');
    updateFormStatus();
  } else {
    console.error('Modal #data-modal não encontrado');
    toast('Erro interno: modal de dados não encontrado 😕');
  }
}

// Confirmar dados do modal
function confirmData() {
  updateFormStatus();
  const confirmBtn = document.getElementById('confirm-data-btn');
  if (confirmBtn.disabled) {
    toast('Preencha todos os campos corretamente antes de confirmar! 🚫');
    return;
  }
  if (!validateDate()) return;
  const numberInput = document.getElementById('data-number');
  const whatsappInput = document.getElementById('data-whatsapp');
  const nameInput = document.getElementById('data-name');
  if (numberInput) state.address.number = numberInput.value.trim();
  if (whatsappInput) state.whatsapp = whatsappInput.value.replace(/\D/g, '');
  if (nameInput) state.name = nameInput.value.trim();
  if (!validateAddress()) return;
  if (!validateWhatsApp()) return;
  if (!validateName()) return;
  checkout();
}

// Enviar pedido ao servidor
async function saveOrderToServer(orderData) {
  try {
    const response = await fetch('save_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    const result = await response.json();
    if (result.success) {
      stockCount--;
      updateStock();
      toast('Dados do pedido salvos com sucesso! ✅');
    } else {
      console.error('Erro ao salvar pedido:', result.error);
      toast('Erro ao salvar os dados do pedido. Tente novamente. 😕');
    }
  } catch (error) {
    console.error('Erro na requisição ao servidor:', error);
    toast('Erro ao salvar os dados do pedido. Tente novamente. 🔄');
  }
}

// Atualizar estoque
function updateStock() {
  const stockAlert = document.getElementById('stock-alert');
  if (stockAlert) {
    stockAlert.textContent = `Apenas ${stockCount} unidades disponíveis!`;
    if (stockCount === 0) {
      stockAlert.textContent = 'Estoque esgotado! Aguarde a reposição. ⏳';
    }
  }
}

// Checkout
function checkout() {
  const sabor = document.querySelector('input[name="sabor"]:checked')?.nextElementSibling.textContent.trim();
  const data = document.getElementById('date')?.value;
  let preco = config.pricing.basePrice;
  const groupCode = state.group.groupCode || '';

  let discountText = `Desconto: 10% OFF (R$ ${config.pricing.standardDiscountValue.toFixed(2).replace('.', ',')}) aplicado!`;
  preco = preco * (1 - config.pricing.standardDiscount);
  let groupDiscountApplied = false;
  if (state.group.groupSize >= config.share.groupDiscountThreshold && state.group.privateShared && state.group.publicShared) {
    preco = preco * (1 - config.share.groupDiscountRate);
    groupDiscountApplied = true;
    discountText = `Desconto: 10% OFF (R$ ${config.pricing.standardDiscountValue.toFixed(2).replace('.', ',')}) + 10% OFF extra (R$ ${config.pricing.groupDiscountValue.toFixed(2).replace('.', ',')}) aplicado!`;
  }

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

    const orderData = {
      name: state.name,
      date: new Date(data).toLocaleDateString('pt-BR'),
      cep: state.address.cep.replace(/(\d{5})(\d{3})/, '$1-$2'),
      street: state.address.street,
      number: state.address.number,
      neighborhood: state.address.neighborhood,
      city: state.address.city,
      state: state.address.state,
      whatsapp: state.whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
      flavor: sabor,
      price: preco.toFixed(2).replace('.', ','),
      groupCode: groupCode || 'Nenhum'
    };

    saveOrderToServer(orderData);

    document.getElementById('date').value = '';
    document.getElementById('data-number').value = '';
    document.getElementById('data-whatsapp').value = '';
    document.getElementById('data-name').value = '';
    state.address.number = '';
    state.whatsapp = '';
    state.name = '';
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
  state.group.groupSize = code ? Math.floor(Math.random() * 5) + 1 : state.group.groupSize;
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
    state.group.groupSize = Math.floor(Math.random() * 5) + 1;
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
  
  console.log(`Validando data: ${selectedDateStr} (Selecionada: ${selectedDate.toLocaleDateString('pt-BR')}, Hoje: ${today.toLocaleDateString('pt-BR')}, Horário: ${now.toLocaleTimeString('pt-BR')})`);
  
  if (selectedDate < today) {
    toast(`Data inválida! Escolha a partir de ${today.toLocaleDateString('pt-BR')} 📅`);
    dateInput.value = '';
    dateInput.focus();
    return false;
  }
  
  if (selectedDate.getTime() === today.getTime() && currentHour >= config.delivery.cutoffHour) {
    toast('Entregas no mesmo dia após 16h não são permitidas. Escolha outra data. 🚚');
    dateInput.value = '';
    dateInput.focus();
    return false;
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
  const currentHour = now.getHours();
  let minDate = today;
  
  if (currentHour >= config.delivery.cutoffHour) {
    minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
  }
  
  const minDateStr = minDate.toISOString().split('T')[0];
  dateInput.min = minDateStr;
  console.log(`Data mínima definida: ${minDateStr} (Horário atual: ${now.toLocaleString('pt-BR')})`);
  
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
    if (selectedDate < minDate) {
      console.warn(`Data selecionada (${dateInput.value}) é anterior à mínima (${minDateStr})`);
      toast(`Data inválida! Escolha a partir de ${minDate.toLocaleDateString('pt-BR')} 📅`);
      dateInput.value = '';
      dateInput.focus();
    }
  }
}

// Validação de Endereço
function validateAddress() {
  if (!state.address.cep || !state.address.number || !state.address.city || !state.address.state) {
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
  return true;
}

// Validação de Nome
function validateName() {
  const nameInput = document.getElementById('data-name');
  if (!nameInput) return false;
  const name = nameInput.value.trim();
  const nameRegex = /^[A-Za-z\s]{3,}$/;
  if (!nameRegex.test(name)) {
    toast('Nome inválido! Use pelo menos 3 letras (apenas letras e espaços). 😊');
    nameInput.classList.add('invalid');
    nameInput.focus();
    return false;
  }
  nameInput.classList.remove('invalid');
  return true;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  checkImageLoad();
  setupSprinkles();
  setHeroVideo();
  setupVideoGallery();
  setupVideoObserver();
  checkUrlForGroupCode();
  updateStock();
});
