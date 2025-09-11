// Configurações do sistema
const config = {
  pricing: {
    basePrice: 189.90,
    whiteChocolateExtra: 20.00, // Acréscimo para Chocolate Branco
    standardDiscount: 0.1, // 10% de desconto padrão
    standardDiscountValue: 18.99, // Valor do desconto padrão
    groupDiscountValue: 17.09 // Valor do desconto de grupo
  },
  stock: {
    initialStock: 10 // Estoque inicial de 10 unidades
  },
  share: {
    groupDiscountThreshold: 3,
    groupDiscountRate: 0.1, // 10% de desconto extra
    shareLink: window.location.href
  },
  pix: {
    pixKey: "sua-chave-pix-aqui@example.com", // Substitua pela sua chave Pix real
    pixQrCodeUrl: "https://placehold.co/200x200?text=QR+Code+Pix" // Substitua pela URL real do QR Code
  },
  delivery: {
    quickDeliveryHours: 2,
    businessHoursStart: 8,
    businessHoursEnd: 18
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
  hashtag: '#BrigadeiroGigante'
};

// Estado da aplicação
const state = {
  stock: config.stock.initialStock,
  lastStockUpdate: null, // Rastreia a última atualização do estoque
  group: {
    groupCode: '',
    groupSize: 0,
    privateShared: false,
    publicShared: false
  },
  deliveryType: 'quick',
  address: {
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: ''
  },
  whatsapp: '',
  name: '',
  date: ''
};

// Variável para gerenciar o temporizador
let timerInterval = null;

// Função para atualizar o preço exibido
function updatePriceDisplay() {
  const flavorInput = document.querySelector('input[name="sabor"]:checked');
  if (!flavorInput) return;

  const flavor = flavorInput.value;
  let price = config.pricing.basePrice;
  if (flavor === 'branco') {
    price += config.pricing.whiteChocolateExtra;
  }
  price = price * (1 - config.pricing.standardDiscount);
  if (state.group.groupSize >= config.share.groupDiscountThreshold && state.group.privateShared && state.group.publicShared) {
    price = price * (1 - config.share.groupDiscountRate);
  }
  const priceElement = document.getElementById('price');
  if (priceElement) {
    priceElement.textContent = price.toFixed(2).replace('.', ',');
  }
}

// Função para exibir notificações (toast)
function toast(message) {
  const toast = document.getElementById('toast');
  if (!toast) {
    console.error('Erro: Elemento #toast não encontrado no DOM.');
    return;
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Função para rolar até um elemento
function scrollToEl(id) {
  const el = document.querySelector(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Função para alternar áudio do vídeo
function toggleAudio(videoId) {
  const video = document.getElementById(videoId);
  const btn = document.querySelector(`[data-video-id="${videoId}"]`);
  if (video && btn) {
    video.muted = !video.muted;
    btn.textContent = video.muted ? '🔇' : '🔊';
    video.dataset.muted = video.muted;
    toast(video.muted ? '🔇 Áudio desativado.' : '🔊 Áudio ativado!');
  }
}

// Função para abrir modais
function openDataModal() {
  const dataModal = document.getElementById('data-modal');
  if (dataModal) {
    dataModal.classList.add('show');
    const deliveryTypeSelect = document.getElementById('delivery-type');
    const dateContainer = document.getElementById('date-container');
    const dateInput = document.getElementById('date');
    if (deliveryTypeSelect && dateContainer && dateInput) {
      dateContainer.classList.toggle('show', deliveryTypeSelect.value === 'event');
      if (deliveryTypeSelect.value === 'quick') {
        dateInput.value = '';
        state.date = '';
      }
    }
    toast('🍫 Preencha seus dados para receber seu brigadeiro gigante!');
  }
}

function openShareModal() {
  const shareModal = document.getElementById('share-modal');
  if (shareModal) {
    shareModal.classList.add('show');
    toast('🎁 Convide amigos e ganhe um desconto especial!');
  }
}

// Função para fechar modais
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

// Função para copiar a chave Pix (corrigida)
function copyPixKey() {
  const pixKeyText = document.getElementById('pix-key-text');
  if (!pixKeyText) {
    toast('⚠️ Erro: Chave Pix não encontrada.');
    console.error('Elemento #pix-key-text não encontrado no DOM.');
    return;
  }
  const pixKey = pixKeyText.textContent.trim();
  if (!pixKey || pixKey === 'undefined' || pixKey === '') {
    toast('⚠️ Erro: Chave Pix inválida ou não definida.');
    console.error('Chave Pix inválida:', pixKey);
    return;
  }

  // Tenta usar a Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(pixKey)
      .then(() => {
        toast('🔑 Chave Pix copiada com sucesso! 😊');
      })
      .catch((err) => {
        console.error('Erro ao copiar com Clipboard API:', err);
        // Tenta o fallback mesmo em caso de erro na Clipboard API
        fallbackCopyPixKey(pixKey);
      });
  } else {
    // Usa o método de fallback diretamente
    fallbackCopyPixKey(pixKey);
  }
}

// Função de fallback para copiar a chave Pix
function fallbackCopyPixKey(pixKey) {
  const textarea = document.createElement('textarea');
  textarea.value = pixKey;
  textarea.style.position = 'fixed'; // Evita interferência no layout
  textarea.style.opacity = '0'; // Torna invisível
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      toast('🔑 Chave Pix copiada com sucesso! 😊');
    } else {
      toast('⚠️ Erro ao copiar a chave Pix. Tente novamente.');
      console.error('Falha ao executar document.execCommand("copy")');
    }
  } catch (err) {
    toast('⚠️ Erro ao copiar a chave Pix. Tente novamente.');
    console.error('Erro no fallback de cópia:', err);
  } finally {
    document.body.removeChild(textarea);
  }
}

// Função para aplicar código de grupo
function applyGroupCode() {
  const groupCodeInput = document.getElementById('group-code');
  if (groupCodeInput) {
    state.group.groupCode = groupCodeInput.value.trim();
    state.group.groupSize = state.group.groupCode ? 3 : 0;
    localStorage.setItem('chocolatriaState', JSON.stringify(state));
    toast(state.group.groupCode ? `🎉 Código ${state.group.groupCode} aplicado! Desconto extra ativado!` : '⚠️ Por favor, insira um código válido.');
    updateGroupProgress();
    updatePriceDisplay();
  }
}

// Funções de compartilhamento
function sharePrivateGroup() {
  state.group.privateShared = true;
  localStorage.setItem('chocolatriaState', JSON.stringify(state));
  const text = `Ei, já viu o Brigadeiro Gigante da Chocolatria? 🍫 É edição limitada e perfeito para festas! Junte-se ao meu grupo e vamos garantir 10% OFF extra! Use o código ${state.group.groupCode || 'ABC123'}: ${config.share.shareLink} ${config.hashtag}`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  toast('📲 Compartilhado no WhatsApp! Chame mais amigos para o desconto!');
  updateGroupProgress();
  updatePriceDisplay();
}

function sharePublicGroup() {
  state.group.publicShared = true;
  localStorage.setItem('chocolatriaState', JSON.stringify(state));
  const text = `Descobri o Brigadeiro Gigante da Chocolatria! 🍫 Edição limitada, perfeito para surpreender! Junte-se ao grupo com o código ${state.group.groupCode || 'ABC123'} e ganhe 10% OFF extra! ${config.share.shareLink} ${config.hashtag}`;
  if (navigator.share) {
    navigator.share({
      title: 'Brigadeiro Gigante – Chocolatria',
      text: text,
      url: config.share.shareLink
    }).then(() => {
      toast('🌟 Compartilhado com sucesso! Convide mais amigos!');
    }).catch(() => {
      toast('⚠️ Erro ao compartilhar. Tente novamente.');
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      toast('📋 Texto copiado! Compartilhe nas suas redes! 😊');
    });
  }
  updateGroupProgress();
  updatePriceDisplay();
}

function shareViaEmail() {
  const subject = 'Experimente o Brigadeiro Gigante da Chocolatria!';
  const body = `Oi! Conheça o Brigadeiro Gigante da Chocolatria! 🍫 É uma delícia artesanal de 1,2 kg, perfeito para festas ou presentear. Use o código ${state.group.groupCode || 'ABC123'} para ganhar 10% OFF extra no Pix! Confira: ${config.share.shareLink} ${config.hashtag}`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  toast('📧 Email pronto para enviar! Convide seus amigos!');
  updateGroupProgress();
  updatePriceDisplay();
}

function copyShareLink() {
  navigator.clipboard.writeText(config.share.shareLink).then(() => {
    toast('🔗 Link copiado! Compartilhe com seus amigos! 😊');
  }).catch(() => {
    toast('⚠️ Erro ao copiar o link. Tente novamente.');
  });
}

function updateGroupProgress() {
  const groupProgress = document.getElementById('group-progress');
  if (groupProgress) {
    groupProgress.textContent = `Grupo: ${state.group.groupSize}/3 pessoas`;
  }
}

// Função para formatar CEP
function formatCep(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 5) {
    value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  }
  return value;
}

// Função para formatar WhatsApp
function formatWhatsapp(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
  }
  if (value.length > 10) {
    value = value.replace(/(\(\d{2}\)\s\d{5})(\d{1,4})/, '$1-$2');
  }
  return value;
}

// Função para buscar endereço por CEP automaticamente
function fetchAddress() {
  const cepInput = document.getElementById('data-cep');
  const cep = cepInput?.value.replace(/\D/g, '');
  if (cep && cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          toast('⚠️ CEP inválido. Por favor, verifique ou insira o endereço manualmente.');
          enableManualAddressInput();
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
        const stateEl = document.getElementById('data-state');
        const addressInput = document.getElementById('data-address-input');

        if (streetInput && neighborhoodInput && cityInput && stateEl && addressInput) {
          streetInput.value = state.address.street;
          neighborhoodInput.value = state.address.neighborhood;
          cityInput.value = state.address.city;
          stateEl.value = state.address.state;
          addressInput.style.display = 'block';

          if (!state.address.street || !state.address.neighborhood) {
            streetInput.removeAttribute('readonly');
            neighborhoodInput.removeAttribute('readonly');
            toast('📍 CEP encontrado! Complete a rua e o bairro, se necessário.');
          } else {
            streetInput.setAttribute('readonly', 'true');
            neighborhoodInput.setAttribute('readonly', 'true');
            toast('📍 Endereço encontrado! Confirme os dados.');
          }
        }
        validateForm();
      })
      .catch(() => {
        toast('⚠️ Erro ao buscar o CEP. Insira o endereço manualmente.');
        enableManualAddressInput();
      });
  } else {
    toast('⚠️ Por favor, insira um CEP válido (8 dígitos).');
    enableManualAddressInput();
  }
}

// Função para habilitar preenchimento manual de endereço
function enableManualAddressInput() {
  const streetInput = document.getElementById('data-street');
  const neighborhoodInput = document.getElementById('data-neighborhood');
  const addressInput = document.getElementById('data-address-input');
  if (streetInput && neighborhoodInput && addressInput) {
    streetInput.removeAttribute('readonly');
    neighborhoodInput.removeAttribute('readonly');
    addressInput.style.display = 'block';
  }
}

// Função para validar formulário
function validateForm() {
  const cepInput = document.getElementById('data-cep');
  const numberInput = document.getElementById('data-number');
  const whatsappInput = document.getElementById('data-whatsapp');
  const nameInput = document.getElementById('data-name');
  const deliveryTypeSelect = document.getElementById('delivery-type');
  const dateInput = document.getElementById('date');
  const streetInput = document.getElementById('data-street');
  const neighborhoodInput = document.getElementById('data-neighborhood');
  const cityInput = document.getElementById('data-city');
  const stateInput = document.getElementById('data-state');
  const confirmBtn = document.getElementById('confirm-data-btn');

  const cep = cepInput?.value.replace(/\D/g, '') || '';
  const number = numberInput?.value || '';
  const whatsapp = whatsappInput?.value.replace(/\D/g, '') || '';
  const name = nameInput?.value || '';
  const deliveryType = deliveryTypeSelect?.value || 'quick';
  const date = dateInput?.value || '';
  const street = streetInput?.value || '';
  const neighborhood = neighborhoodInput?.value || '';
  const city = cityInput?.value || '';
  const stateEl = stateInput?.value || '';

  const cepError = document.getElementById('cep-error');
  const streetError = document.getElementById('street-error');
  const numberError = document.getElementById('number-error');
  const neighborhoodError = document.getElementById('neighborhood-error');
  const cityError = document.getElementById('city-error');
  const stateError = document.getElementById('state-error');
  const whatsappError = document.getElementById('whatsapp-error');
  const nameError = document.getElementById('name-error');
  const dateError = document.getElementById('date-error');

  const isCepValid = cep && cep.length === 8;
  const isNumberValid = number && number.trim() !== '';
  const isWhatsappValid = whatsapp && whatsapp.length >= 10 && whatsapp.length <= 11;
  const isNameValid = name && name.trim().length >= 2;
  const isStreetValid = street && street.trim() !== '';
  const isNeighborhoodValid = neighborhood && neighborhood.trim() !== '';
  const isCityValid = city && city.trim() !== '';
  const isStateValid = stateEl && stateEl.trim() !== '';
  const isDateValid = deliveryType === 'quick' || (date && new Date(date) >= new Date());

  if (cepError) {
    cepError.style.display = isCepValid ? 'none' : 'block';
    cepError.textContent = isCepValid ? '' : 'Por favor, insira um CEP válido (8 dígitos).';
  }
  if (streetError) {
    streetError.style.display = isStreetValid ? 'none' : 'block';
    streetError.textContent = isStreetValid ? '' : 'Por favor, insira a rua.';
  }
  if (numberError) {
    numberError.style.display = isNumberValid ? 'none' : 'block';
    numberError.textContent = isNumberValid ? '' : 'Por favor, insira o número.';
  }
  if (neighborhoodError) {
    neighborhoodError.style.display = isNeighborhoodValid ? 'none' : 'block';
    neighborhoodError.textContent = isNeighborhoodValid ? '' : 'Por favor, insira o bairro.';
  }
  if (cityError) {
    cityError.style.display = isCityValid ? 'none' : 'block';
    cityError.textContent = isCityValid ? '' : 'Por favor, insira a cidade.';
  }
  if (stateError) {
    stateError.style.display = isStateValid ? 'none' : 'block';
    stateError.textContent = isStateValid ? '' : 'Por favor, insira o estado.';
  }
  if (whatsappError) {
    whatsappError.style.display = isWhatsappValid ? 'none' : 'block';
    whatsappError.textContent = isWhatsappValid ? '' : 'Por favor, insira um WhatsApp válido.';
  }
  if (nameError) {
    nameError.style.display = isNameValid ? 'none' : 'block';
    nameError.textContent = isNameValid ? '' : 'Por favor, insira um nome válido.';
  }
  if (dateError) {
    dateError.style.display = (deliveryType === 'event' && !isDateValid) ? 'block' : 'none';
    dateError.textContent = (deliveryType === 'event' && !isDateValid) ? 'Por favor, selecione uma data válida (futura).' : '';
  }

  if (confirmBtn) {
    if (isCepValid && isNumberValid && isWhatsappValid && isNameValid && isStreetValid && isNeighborhoodValid && isCityValid && isStateValid && (deliveryType === 'quick' || isDateValid)) {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.cursor = 'pointer';
    } else {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.6';
      confirmBtn.style.cursor = 'not-allowed';
    }
  }
}

// Função para confirmar dados
function confirmData() {
  const cepInput = document.getElementById('data-cep');
  const numberInput = document.getElementById('data-number');
  const whatsappInput = document.getElementById('data-whatsapp');
  const nameInput = document.getElementById('data-name');
  const deliveryTypeSelect = document.getElementById('delivery-type');
  const dateInput = document.getElementById('date');
  const streetInput = document.getElementById('data-street');
  const neighborhoodInput = document.getElementById('data-neighborhood');
  const cityInput = document.getElementById('data-city');
  const stateInput = document.getElementById('data-state');

  const cep = cepInput?.value.replace(/\D/g, '') || '';
  const number = numberInput?.value || '';
  const whatsapp = whatsappInput?.value.replace(/\D/g, '') || '';
  const name = nameInput?.value || '';
  const deliveryType = deliveryTypeSelect?.value || 'quick';
  const date = dateInput?.value || '';
  const street = streetInput?.value || '';
  const neighborhood = neighborhoodInput?.value || '';
  const city = cityInput?.value || '';
  const stateEl = stateInput?.value || '';

  if (cep && number && whatsapp && name && deliveryType && street && neighborhood && city && stateEl && (deliveryType === 'quick' || (date && new Date(date) >= new Date()))) {
    state.address.cep = cep;
    state.address.number = number;
    state.whatsapp = whatsapp;
    state.name = name;
    state.deliveryType = deliveryType;
    state.address.street = street;
    state.address.neighborhood = neighborhood;
    state.address.city = city;
    state.address.state = stateEl;
    state.date = date || '';

    if (state.stock > 0) {
      state.stock--;
      localStorage.setItem('chocolatriaState', JSON.stringify(state));
      document.getElementById('stock-alert').textContent = `Apenas ${state.stock} unidades disponíveis!`;
      checkout();
    } else {
      toast('⚠️ Estoque esgotado! Volte em breve para novas unidades! 😔');
    }
  }
}

// Função para iniciar o temporizador
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  let timeLeft = 15 * 60; // 15 minutos em segundos
  const timerEl = document.getElementById('timer');
  if (timerEl) {
    timerEl.textContent = '15:00';
    timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(timerInterval);
        timerEl.textContent = 'Expirado!';
        toast('⏰ O tempo para a oferta especial acabou! Tente novamente! 😔');
      }
    }, 1000);
  }
}

// Função para atualizar o estoque a cada 30 minutos
function updateStockPeriodically() {
  const now = new Date().getTime();
  const lastUpdate = state.lastStockUpdate ? parseInt(state.lastStockUpdate, 10) : now;
  const thirtyMinutesInMs = 30 * 60 * 1000; // 30 minutos em milissegundos

  // Verifica se passaram 30 minutos desde a última atualização
  if (now - lastUpdate >= thirtyMinutesInMs) {
    state.stock = config.stock.initialStock; // Reseta para 10
    state.lastStockUpdate = now; // Atualiza o horário da última atualização
    localStorage.setItem('chocolatriaState', JSON.stringify(state));
    toast(`📦 Estoque reabastecido! ${state.stock} unidades disponíveis!`);
  }

  // Atualiza a exibição do estoque
  const stockAlert = document.getElementById('stock-alert');
  if (stockAlert) {
    stockAlert.textContent = `Apenas ${state.stock} unidades disponíveis!`;
  }

  // Agenda a próxima verificação
  setTimeout(updateStockPeriodically, 60 * 1000); // Verifica a cada 1 minuto
}

// Função para finalizar o pedido
function checkout() {
  const flavorInput = document.querySelector('input[name="sabor"]:checked');
  if (!flavorInput) {
    toast('⚠️ Selecione um sabor antes de finalizar o pedido!');
    return;
  }
  const sabor = flavorInput.nextElementSibling.textContent.trim();
  const now = new Date();
  const currentHour = now.getHours();
  let deliveryDate;
  let deliveryNote = '';

  if (state.deliveryType === 'quick') {
    if (currentHour >= config.delivery.businessHoursStart && currentHour < config.delivery.businessHoursEnd) {
      const deliveryTime = new Date(now.getTime() + config.delivery.quickDeliveryHours * 60 * 60 * 1000);
      deliveryDate = deliveryTime.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      deliveryNote = `Seu brigadeiro será entregue em até 2 horas (${deliveryDate}) após a confirmação do pagamento!`;
    } else {
      const nextBusinessDay = new Date(now);
      nextBusinessDay.setDate(now.getDate() + (now.getDay() === 6 ? 2 : 1));
      nextBusinessDay.setHours(10, 0, 0, 0);
      deliveryDate = nextBusinessDay.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      deliveryNote = `Estamos fora do horário comercial, mas não se preocupe! Entraremos em contato no próximo dia útil (${deliveryDate}) para confirmar a entrega rapidinha!`;
    }
  } else {
    deliveryDate = new Date(state.date).toLocaleDateString('pt-BR');
    deliveryNote = `Seu brigadeiro está agendado para ${deliveryDate}! Prepararemos com todo carinho!`;
  }

  let preco = config.pricing.basePrice;
  if (flavorInput.value === 'branco') {
    preco += config.pricing.whiteChocolateExtra;
  }
  const groupCode = state.group.groupCode || '';

  let discountText = `Desconto de 10% (R$ ${config.pricing.standardDiscountValue.toFixed(2).replace('.', ',')}) aplicado!`;
  preco = Number((preco * (1 - config.pricing.standardDiscount)).toFixed(2));
  let groupDiscountApplied = false;
  if (state.group.groupSize >= config.share.groupDiscountThreshold && state.group.privateShared && state.group.publicShared) {
    preco = Number((preco * (1 - config.share.groupDiscountRate)).toFixed(2));
    groupDiscountApplied = true;
    discountText = `Desconto de 10% (R$ ${config.pricing.standardDiscountValue.toFixed(2).replace('.', ',')}) + 10% extra (R$ ${config.pricing.groupDiscountValue.toFixed(2).replace('.', ',')}) aplicado!`;
  }

  const summary = `
    <strong>Resumo do Seu Pedido:</strong><br>
    • Sabor: ${sabor}${sabor === 'Chocolate Branco' ? ' (+ R$ 20,00)' : ''}<br>
    • Nome: ${state.name}<br>
    • Endereço: ${state.address.street}, ${state.address.number}, ${state.address.neighborhood}, ${state.address.city} - ${state.address.state}, CEP: ${state.address.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}<br>
    • Frete: Grátis (nossa filial está pertinho, a 2,7 km!)<br>
    • Tipo de Entrega: ${state.deliveryType === 'quick' ? 'Entrega Rápida (2 horas)' : 'Festa/Evento'}<br>
    • ${deliveryNote}<br>
    • WhatsApp: ${state.whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}<br>
    • Preço: R$ ${preco.toFixed(2).replace('.', ',')}<br>
    ${groupCode ? '• Código do Grupo: ' + groupCode + '<br>' : ''}
    • <strong>${discountText}</strong><br>
    • <strong class="highlight">Feito com amor e entregue fresquinho após o pagamento!</strong>
  `;
  
  const orderSummary = document.getElementById('order-summary');
  const pixKeyText = document.getElementById('pix-key-text');
  const pixQrCode = document.getElementById('pix-qr-code');
  const confirmationModal = document.getElementById('confirmation-modal');
  const dataModal = document.getElementById('data-modal');
  
  if (orderSummary && pixKeyText && pixQrCode && confirmationModal && dataModal) {
    orderSummary.innerHTML = summary;
    pixKeyText.textContent = config.pix.pixKey || 'Chave Pix não configurada';
    pixQrCode.src = config.pix.pixQrCodeUrl || 'https://placehold.co/200x200?text=QR+Code+Não+Disponível';
    pixQrCode.alt = config.pix.pixKey ? `QR Code para pagamento Pix (${config.pix.pixKey})` : 'QR Code não disponível';
    dataModal.classList.remove('show');
    confirmationModal.classList.add('show');
    pixKeyText.focus();
    startTimer();
    toast(`🎉 Pedido confirmado, ${state.name}! Faça o pagamento via Pix para garantir sua delícia! 😋`);

    const orderData = {
      name: state.name,
      date: deliveryDate,
      deliveryType: state.deliveryType === 'quick' ? 'Entrega Rápida (2 horas)' : 'Festa/Evento',
      deliveryNote: deliveryNote,
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
  } else {
    toast('⚠️ Erro ao exibir o resumo do pedido. Tente novamente.');
    console.error('Elementos ausentes:', { orderSummary, pixKeyText, pixQrCode, confirmationModal, dataModal });
  }

  // Resetar formulário
  document.getElementById('date').value = '';
  document.getElementById('data-number').value = '';
  document.getElementById('data-whatsapp').value = '';
  document.getElementById('data-name').value = '';
  state.address.number = '';
  state.whatsapp = '';
  state.name = '';
  state.date = '';
}

// Função para salvar pedido no servidor
function saveOrderToServer(orderData) {
  fetch('/api/save-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        toast('📦 Pedido salvo com sucesso! Entraremos em contato em breve! 😊');
      } else {
        toast('⚠️ Erro ao salvar o pedido: ' + data.message);
      }
    })
    .catch(() => {
      toast('⚠️ Erro ao salvar o pedido. Tente novamente.');
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Carregar estado do localStorage
  const savedState = localStorage.getItem('chocolatriaState');
  if (savedState) {
    Object.assign(state, JSON.parse(savedState));
    updateGroupProgress();
    if (state.group.groupCode) {
      document.getElementById('group-code').value = state.group.groupCode;
    }
  }

  // Configurar estoque inicial
  updateStockPeriodically(); // Inicia a verificação do estoque

  // Configurar galeria de vídeos
  const videoGallery = document.getElementById('video-gallery');
  if (videoGallery) {
    config.videos.forEach((videoSrc, index) => {
      const videoCard = document.createElement('div');
      videoCard.className = 'video-card';
      videoCard.innerHTML = `
        <video autoplay loop playsinline muted data-muted="true">
          <source src="${videoSrc}" type="video/mp4">
        </video>
        <button class="btn audio-btn" data-video-id="video-${index}" aria-controls="video-${index}" onclick="toggleAudio('video-${index}')" aria-label="Ativar/desativar áudio do vídeo ${index + 1}">🔇</button>
      `;
      videoCard.querySelector('video').id = `video-${index}`;
      videoGallery.appendChild(videoCard);
    });
  }

  // Configurar controle de tipo de entrega
  const deliveryTypeSelect = document.getElementById('delivery-type');
  const dateContainer = document.getElementById('date-container');
  if (deliveryTypeSelect && dateContainer) {
    deliveryTypeSelect.addEventListener('change', () => {
      state.deliveryType = deliveryTypeSelect.value;
      dateContainer.classList.toggle('show', state.deliveryType === 'event');
      if (state.deliveryType === 'quick') {
        const dateInput = document.getElementById('date');
        if (dateInput) {
          dateInput.value = '';
          state.date = '';
        }
      }
      validateForm();
    });
  }

  // Configurar validação de formulário e máscaras
  const cepInput = document.getElementById('data-cep');
  const whatsappInput = document.getElementById('data-whatsapp');
  const inputs = document.querySelectorAll('#data-cep, #data-number, #data-whatsapp, #data-name, #date, #data-street, #data-neighborhood, #data-city, #data-state');
  inputs.forEach(input => {
    input.addEventListener('input', validateForm);
  });

  if (cepInput) {
    cepInput.addEventListener('input', () => {
      cepInput.value = formatCep(cepInput.value);
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length === 8) {
        fetchAddress();
      }
    });
  }

  if (whatsappInput) {
    whatsappInput.addEventListener('input', () => {
      whatsappInput.value = formatWhatsapp(whatsappInput.value);
      validateForm();
    });
  }

  // Configurar atualização de preço ao mudar sabor
  const flavorInputs = document.querySelectorAll('input[name="sabor"]');
  flavorInputs.forEach(input => {
    input.addEventListener('change', updatePriceDisplay);
  });

  // Inicializar preço e temporizador
  updatePriceDisplay();
  startTimer();
});
