// ========================================= //
// FUNÇÃO OTIMIZADA PARA CRIAR CARDS MOBILE-FIRST //
// Estrutura HTML semântica e acessível //
// ========================================= //

/**
 * Cria um card de peneira otimizado para dispositivos móveis
 * @param {Object} peneira - Objeto com dados da peneira
 * @returns {HTMLElement} - Elemento DOM do card
 */
function createResultCard(peneira) {
    // Criar elemento principal do card
    const card = document.createElement('article');
    card.className = 'peneira-card';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-labelledby', `peneira-title-${peneira.id}`);
    card.setAttribute('data-peneira-id', peneira.id);
    
    // Formatação de dados
    const dataFormatada = formatDateForMobile(peneira.data);
    const distanciaTexto = formatDistanceForMobile(peneira.distancia);
    
    // Determinar status e classes
    const statusInfo = getStatusInfo(peneira);
    const urgenciaInfo = getUrgenciaInfo(peneira);
    const prazoInfo = getPrazoInfo(peneira);
    
    // Estrutura HTML otimizada para mobile
    card.innerHTML = `
        <header class="card-status ${statusInfo.class}" role="banner">
            <div class="status-text" aria-label="Status da peneira">
                ${statusInfo.text}
            </div>
            <div class="distance" aria-label="Distância: ${distanciaTexto}">
                ${distanciaTexto}
            </div>
        </header>
        
        <main class="card-main" role="main">
            <h3 id="peneira-title-${peneira.id}" class="peneira-title">
                ${escapeHtml(peneira.titulo)}
            </h3>
            
            <div class="peneira-club" aria-label="Clube responsável">
                ${escapeHtml(peneira.clube)}
            </div>
            
            <section class="peneira-info" aria-label="Informações da peneira">
                <div class="info-primary">
                    <time class="data-hora" datetime="${peneira.data}T${peneira.horario}" 
                          aria-label="Data e horário: ${dataFormatada} às ${peneira.horario}">
                        ${dataFormatada} • ${peneira.horario}
                    </time>
                </div>
                
                <div class="info-secondary">
                    <address class="local" aria-label="Local da peneira">
                        ${escapeHtml(peneira.endereco)}
                    </address>
                    
                    <div class="categoria" aria-label="Categorias aceitas">
                        ${escapeHtml(peneira.categoria)}
                    </div>
                </div>
            </section>
            
            ${peneira.status === 'aberta' ? createVagasSection(peneira, urgenciaInfo) : ''}
            ${peneira.status === 'aberta' ? createPrazoSection(peneira, prazoInfo) : ''}
        </main>
        
        <footer class="card-actions" role="contentinfo">
            ${createActionButtons(peneira)}
        </footer>
    `;
    
    // Adicionar event listeners otimizados para mobile
    addMobileEventListeners(card, peneira);
    
    return card;
}

/**
 * Cria a seção de informações sobre vagas
 * @param {Object} peneira - Dados da peneira
 * @param {Object} urgenciaInfo - Informações de urgência
 * @returns {string} - HTML da seção de vagas
 */
function createVagasSection(peneira, urgenciaInfo) {
    return `
        <section class="vagas-info ${urgenciaInfo.class}" 
                 aria-label="Informações sobre vagas disponíveis"
                 role="region">
            <div class="vagas-text" aria-label="${urgenciaInfo.ariaLabel}">
                ${urgenciaInfo.text}
            </div>
            <div class="vagas-count" 
                 aria-label="Vagas disponíveis: ${peneira.vagasDisponiveis} de ${peneira.totalVagas}">
                ${peneira.vagasDisponiveis}/${peneira.totalVagas}
            </div>
        </section>
    `;
}

/**
 * Cria a seção de informações sobre prazo
 * @param {Object} peneira - Dados da peneira
 * @param {Object} prazoInfo - Informações de prazo
 * @returns {string} - HTML da seção de prazo
 */
function createPrazoSection(peneira, prazoInfo) {
    const prazoFormatado = formatDateForMobile(peneira.prazoInscricao);
    
    return `
        <section class="prazo-info" 
                 aria-label="Informações sobre prazo de inscrição"
                 role="region">
            <div class="prazo-text">
                Inscrições até ${prazoFormatado}
            </div>
            <div class="prazo-restante" 
                 aria-label="Tempo restante: ${prazoInfo.text}"
                 class="${prazoInfo.urgente ? 'prazo-urgente' : ''}">
                ${prazoInfo.text}
            </div>
        </section>
    `;
}

/**
 * Cria os botões de ação do card
 * @param {Object} peneira - Dados da peneira
 * @returns {string} - HTML dos botões de ação
 */
function createActionButtons(peneira) {
    if (peneira.status === 'aberta') {
        return `
            <button type="button" 
                    class="btn-primary" 
                    data-action="directions" 
                    data-address="${escapeHtml(peneira.endereco)}"
                    aria-label="Ver localização da peneira no mapa">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Ver Local</span>
            </button>
            
            <button type="button" 
                    class="btn-share" 
                    data-action="share" 
                    data-peneira-id="${peneira.id}"
                    aria-label="Compartilhar informações desta peneira">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16,6 12,2 8,6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
            </button>
        `;
    } else {
        return `
            <button type="button" 
                    class="btn-disabled" 
                    disabled
                    aria-label="Peneira encerrada - não é possível mais se inscrever">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Encerrada</span>
            </button>
            
            <button type="button" 
                    class="btn-share" 
                    data-action="share" 
                    data-peneira-id="${peneira.id}"
                    aria-label="Compartilhar informações desta peneira">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16,6 12,2 8,6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
            </button>
        `;
    }
}

/**
 * Adiciona event listeners otimizados para dispositivos móveis
 * @param {HTMLElement} card - Elemento do card
 * @param {Object} peneira - Dados da peneira
 */
function addMobileEventListeners(card, peneira) {
    // Event listener para botões de ação
    card.addEventListener('click', handleCardClick, { passive: false });
    
    // Event listener para gestos touch (opcional)
    if ('ontouchstart' in window) {
        let touchStartY = 0;
        let touchStartTime = 0;
        
        card.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });
        
        card.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            const touchDistance = Math.abs(touchEndY - touchStartY);
            
            // Detectar tap rápido (não é scroll)
            if (touchDuration < 200 && touchDistance < 10) {
                card.classList.add('card-tapped');
                setTimeout(() => {
                    card.classList.remove('card-tapped');
                }, 150);
            }
        }, { passive: true });
    }
    
    // Melhorar acessibilidade com navegação por teclado
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const primaryButton = card.querySelector('.btn-primary, .btn-disabled');
            if (primaryButton && !primaryButton.disabled) {
                primaryButton.click();
            }
        }
    });
}

/**
 * Manipula cliques nos cards e botões
 * @param {Event} e - Evento de clique
 */
function handleCardClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const action = target.dataset.action;
    
    // Feedback visual imediato
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        target.style.transform = '';
    }, 150);
    
    switch (action) {
        case 'directions':
            handleDirectionsClick(target.dataset.address);
            break;
        case 'share':
            handleShareClick(target.dataset.peneiraId);
            break;
    }
}

/**
 * Manipula clique no botão de direções
 * @param {string} address - Endereço da peneira
 */
function handleDirectionsClick(address) {
    // Mostrar loading
    showMobileLoading('Abrindo mapa...');
    
    try {
        const encodedAddress = encodeURIComponent(address);
        
        // Detectar se é dispositivo móvel para usar app nativo
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        let url;
        if (isMobile) {
            // Tentar abrir app nativo do Google Maps
            url = `https://maps.google.com/maps?daddr=${encodedAddress}`;
        } else {
            // Abrir versão web
            url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        }
        
        window.open(url, '_blank');
        
        // Analytics (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'directions_clicked', {
                'event_category': 'peneira_card',
                'event_label': address
            });
        }
        
    } catch (error) {
        console.error('Erro ao abrir direções:', error);
        showMobileNotification('Erro ao abrir o mapa. Tente novamente.', 'error');
    } finally {
        hideMobileLoading();
    }
}

/**
 * Manipula clique no botão de compartilhar
 * @param {string} peneiraId - ID da peneira
 */
function handleShareClick(peneiraId) {
    const peneira = peneirasData.find(p => p.id == peneiraId);
    if (!peneira) return;
    
    const shareData = {
        title: `Peneira: ${peneira.titulo}`,
        text: `Encontrei esta peneira do ${peneira.clube}! Data: ${formatDateForMobile(peneira.data)} às ${peneira.horario}`,
        url: window.location.href
    };
    
    // Usar Web Share API se disponível (principalmente mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => {
                showMobileNotification('Compartilhado com sucesso!', 'success');
                
                // Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share_success', {
                        'event_category': 'peneira_card',
                        'event_label': peneira.titulo
                    });
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Erro ao compartilhar:', error);
                    fallbackShare(peneira);
                }
            });
    } else {
        // Fallback para dispositivos sem Web Share API
        fallbackShare(peneira);
    }
}

/**
 * Fallback para compartilhamento em dispositivos sem Web Share API
 * @param {Object} peneira - Dados da peneira
 */
function fallbackShare(peneira) {
    const text = `Peneira: ${peneira.titulo} - ${peneira.clube}\nData: ${formatDateForMobile(peneira.data)} às ${peneira.horario}\nLocal: ${peneira.endereco}\n\nVeja mais em: ${window.location.href}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showMobileNotification('Informações copiadas para a área de transferência!', 'success');
            })
            .catch(() => {
                legacyCopyToClipboard(text);
            });
    } else {
        legacyCopyToClipboard(text);
    }
}

/**
 * Copia texto para clipboard usando método legado
 * @param {string} text - Texto para copiar
 */
function legacyCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showMobileNotification('Informações copiadas!', 'success');
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showMobileNotification('Erro ao copiar informações', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ========================================= //
// FUNÇÕES UTILITÁRIAS PARA MOBILE //
// ========================================= //

/**
 * Formata data para exibição otimizada em mobile
 * @param {string} dateString - Data em formato ISO
 * @returns {string} - Data formatada
 */
function formatDateForMobile(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Verificar se é hoje ou amanhã
    if (date.toDateString() === today.toDateString()) {
        return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Amanhã';
    } else {
        return date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }
}

/**
 * Formata distância para exibição otimizada em mobile
 * @param {number} distancia - Distância em km
 * @returns {string} - Distância formatada
 */
function formatDistanceForMobile(distancia) {
    if (distancia < 1) {
        return `${Math.round(distancia * 1000)}m`;
    } else if (distancia < 10) {
        return `${distancia.toFixed(1)}km`;
    } else {
        return `${Math.round(distancia)}km`;
    }
}

/**
 * Obtém informações de status da peneira
 * @param {Object} peneira - Dados da peneira
 * @returns {Object} - Informações de status
 */
function getStatusInfo(peneira) {
    if (peneira.status === 'encerrada') {
        return {
            class: 'encerrada',
            text: 'Encerrada',
            ariaLabel: 'Esta peneira está encerrada'
        };
    }
    
    if (peneira.vagasDisponiveis <= 3) {
        return {
            class: 'aberta',
            text: 'Últimas Vagas',
            ariaLabel: 'Peneira aberta com poucas vagas restantes'
        };
    } else if (peneira.vagasDisponiveis <= 10) {
        return {
            class: 'aberta',
            text: 'Vagas Limitadas',
            ariaLabel: 'Peneira aberta com vagas limitadas'
        };
    } else {
        return {
            class: 'aberta',
            text: 'Disponível',
            ariaLabel: 'Peneira aberta com vagas disponíveis'
        };
    }
}

/**
 * Obtém informações de urgência das vagas
 * @param {Object} peneira - Dados da peneira
 * @returns {Object} - Informações de urgência
 */
function getUrgenciaInfo(peneira) {
    if (peneira.status !== 'aberta') {
        return { class: '', text: '', ariaLabel: '' };
    }
    
    const percentualVagas = (peneira.vagasDisponiveis / peneira.totalVagas) * 100;
    
    if (percentualVagas <= 10) {
        return {
            class: 'urgente',
            text: 'Poucas vagas restantes!',
            ariaLabel: 'Atenção: restam poucas vagas para esta peneira'
        };
    } else if (percentualVagas <= 25) {
        return {
            class: 'limitado',
            text: 'Vagas limitadas',
            ariaLabel: 'Vagas limitadas disponíveis'
        };
    } else {
        return {
            class: 'disponivel',
            text: 'Vagas disponíveis',
            ariaLabel: 'Há vagas disponíveis para esta peneira'
        };
    }
}

/**
 * Obtém informações sobre prazo de inscrição
 * @param {Object} peneira - Dados da peneira
 * @returns {Object} - Informações de prazo
 */
function getPrazoInfo(peneira) {
    const hoje = new Date();
    const prazo = new Date(peneira.prazoInscricao);
    const diffTime = prazo - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { text: 'Expirado', urgente: true };
    } else if (diffDays === 0) {
        return { text: 'Hoje!', urgente: true };
    } else if (diffDays === 1) {
        return { text: 'Amanhã', urgente: true };
    } else if (diffDays <= 3) {
        return { text: `${diffDays} dias`, urgente: true };
    } else {
        return { text: `${diffDays} dias`, urgente: false };
    }
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto para escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ========================================= //
// FUNÇÕES DE FEEDBACK VISUAL PARA MOBILE //
// ========================================= //

/**
 * Mostra loading otimizado para mobile
 * @param {string} message - Mensagem de loading
 */
function showMobileLoading(message = 'Carregando...') {
    const existingLoader = document.querySelector('.mobile-loader');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    const loader = document.createElement('div');
    loader.className = 'mobile-loader';
    loader.innerHTML = `
        <div class="mobile-loader-content">
            <div class="mobile-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    // Estilos inline para garantir funcionamento
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    `;
    
    document.body.appendChild(loader);
    document.body.style.overflow = 'hidden';
}

/**
 * Esconde loading mobile
 */
function hideMobileLoading() {
    const loader = document.querySelector('.mobile-loader');
    if (loader) {
        loader.remove();
    }
    document.body.style.overflow = '';
}

/**
 * Mostra notificação otimizada para mobile
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error, warning, info)
 */
function showMobileNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.mobile-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `mobile-notification mobile-notification-${type}`;
    notification.innerHTML = `
        <div class="mobile-notification-content">
            <div class="mobile-notification-icon">
                ${getMobileNotificationIcon(type)}
            </div>
            <span class="mobile-notification-text">${message}</span>
        </div>
    `;
    
    // Estilos inline otimizados para mobile
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 16px;
        right: 16px;
        background: ${getMobileNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 500;
        animation: mobileSlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        max-width: calc(100vw - 32px);
    `;
    
    document.body.appendChild(notification);
    
    // Remover automaticamente após 4 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'mobileSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
    
    // Permitir fechar tocando na notificação
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

/**
 * Obtém ícone para notificação mobile
 * @param {string} type - Tipo da notificação
 * @returns {string} - HTML do ícone
 */
function getMobileNotificationIcon(type) {
    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    return icons[type] || icons.info;
}

/**
 * Obtém cor para notificação mobile
 * @param {string} type - Tipo da notificação
 * @returns {string} - Cor CSS
 */
function getMobileNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        error: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        warning: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
        info: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
    };
    return colors[type] || colors.info;
}

// ========================================= //
// ESTILOS CSS ADICIONAIS PARA ANIMAÇÕES //
// ========================================= //

// Adicionar estilos de animação via JavaScript
const mobileAnimationStyles = `
    @keyframes mobileSlideDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes mobileSlideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
    
    .card-tapped {
        transform: scale(0.98);
        transition: transform 0.1s ease-out;
    }
    
    .mobile-loader-content {
        text-align: center;
        color: white;
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 16px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .mobile-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid #FFC107;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .mobile-notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
    }
    
    .mobile-notification-icon {
        flex-shrink: 0;
    }
    
    .mobile-notification-text {
        flex: 1;
        line-height: 1.4;
    }
`;

// Adicionar estilos ao documento
if (!document.querySelector('#mobile-animation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mobile-animation-styles';
    styleSheet.textContent = mobileAnimationStyles;
    document.head.appendChild(styleSheet);
}

// ========================================= //
// MELHORIAS DE UX MOBILE PARA CARDS DE PENEIRAS //
// Otimizações de performance e experiência do usuário //
// ========================================= //

/**
 * Classe para gerenciar a experiência mobile dos cards
 */
class MobileCardManager {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.isMobile = this.detectMobile();
        this.visibilityObserver = null;
        this.resizeObserver = null;
        this.touchStartTime = 0;
        this.touchStartY = 0;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    /**
     * Inicializa o gerenciador mobile
     */
    init() {
        this.setupViewportOptimizations();
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.setupScrollOptimizations();
        this.setupTouchOptimizations();
        this.setupPerformanceOptimizations();
        
        // Adicionar classe CSS para dispositivos móveis
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
        }
        
        console.log('MobileCardManager inicializado:', {
            isTouch: this.isTouch,
            isMobile: this.isMobile,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }
    
    /**
     * Detecta se é dispositivo móvel
     * @returns {boolean}
     */
    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const screenWidth = window.innerWidth <= 768;
        
        return mobileRegex.test(userAgent) || screenWidth;
    }
    
    /**
     * Configura otimizações de viewport
     */
    setupViewportOptimizations() {
        // Prevenir zoom acidental em inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (this.isMobile) {
                    // Scroll suave para o input
                    setTimeout(() => {
                        input.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            });
        });
        
        // Otimizar viewport para diferentes orientações
        this.handleOrientationChange();
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });
    }
    
    /**
     * Lida com mudanças de orientação
     */
    handleOrientationChange() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && this.isMobile) {
            // Força recálculo do viewport
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
            
            // Recalcular layout dos cards
            setTimeout(() => {
                this.recalculateCardLayout();
            }, 200);
        }
    }
    
    /**
     * Configura Intersection Observer para lazy loading
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        this.visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                
                if (entry.isIntersecting) {
                    // Card está visível - ativar animações
                    card.classList.add('card-visible');
                    this.preloadCardAssets(card);
                } else {
                    // Card não está visível - pausar animações desnecessárias
                    card.classList.remove('card-visible');
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }
    
    /**
     * Configura ResizeObserver para layout responsivo
     */
    setupResizeObserver() {
        if (!('ResizeObserver' in window)) return;
        
        this.resizeObserver = new ResizeObserver((entries) => {
            // Debounce para evitar muitas execuções
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });
        
        this.resizeObserver.observe(document.body);
    }
    
    /**
     * Lida com redimensionamento da tela
     */
    handleResize() {
        const newIsMobile = this.detectMobile();
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            
            if (this.isMobile) {
                document.body.classList.add('mobile-device');
            } else {
                document.body.classList.remove('mobile-device');
            }
            
            this.recalculateCardLayout();
        }
    }
    
    /**
     * Recalcula layout dos cards
     */
    recalculateCardLayout() {
        const resultsGrid = document.querySelector('.results-grid');
        if (!resultsGrid) return;
        
        // Força recálculo do CSS Grid
        resultsGrid.style.display = 'none';
        resultsGrid.offsetHeight; // Trigger reflow
        resultsGrid.style.display = 'grid';
        
        // Reobservar cards para lazy loading
        const cards = resultsGrid.querySelectorAll('.peneira-card');
        cards.forEach(card => {
            if (this.visibilityObserver) {
                this.visibilityObserver.observe(card);
            }
        });
    }
    
    /**
     * Configura otimizações de scroll
     */
    setupScrollOptimizations() {
        let isScrolling = false;
        
        // Throttle scroll events
        const handleScroll = () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    this.onScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Detectar fim do scroll
        window.addEventListener('scroll', () => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.onScrollEnd();
            }, 150);
        }, { passive: true });
    }
    
    /**
     * Executado durante o scroll
     */
    onScroll() {
        // Adicionar classe durante scroll para otimizações CSS
        document.body.classList.add('is-scrolling');
        
        // Pausar animações desnecessárias durante scroll
        const cards = document.querySelectorAll('.peneira-card');
        cards.forEach(card => {
            if (!card.classList.contains('card-visible')) {
                card.style.willChange = 'auto';
            }
        });
    }
    
    /**
     * Executado quando o scroll termina
     */
    onScrollEnd() {
        document.body.classList.remove('is-scrolling');
        
        // Reativar animações
        const cards = document.querySelectorAll('.peneira-card');
        cards.forEach(card => {
            if (card.classList.contains('card-visible')) {
                card.style.willChange = 'transform';
            }
        });
    }
    
    /**
     * Configura otimizações para touch
     */
    setupTouchOptimizations() {
        if (!this.isTouch) return;
        
        // Melhorar responsividade do touch
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        
        // Prevenir zoom duplo-toque em elementos específicos
        const preventDoubleZoom = (e) => {
            if (e.detail > 1) {
                e.preventDefault();
            }
        };
        
        document.addEventListener('click', preventDoubleZoom);
    }
    
    /**
     * Lida com início do toque
     * @param {TouchEvent} e 
     */
    handleTouchStart(e) {
        this.touchStartTime = Date.now();
        this.touchStartY = e.touches[0].clientY;
        
        const card = e.target.closest('.peneira-card');
        if (card) {
            card.classList.add('touch-active');
        }
    }
    
    /**
     * Lida com fim do toque
     * @param {TouchEvent} e 
     */
    handleTouchEnd(e) {
        const touchEndTime = Date.now();
        const touchEndY = e.changedTouches[0].clientY;
        const touchDuration = touchEndTime - this.touchStartTime;
        const touchDistance = Math.abs(touchEndY - this.touchStartY);
        
        const card = e.target.closest('.peneira-card');
        if (card) {
            card.classList.remove('touch-active');
            
            // Detectar tap rápido (não é scroll)
            if (touchDuration < 200 && touchDistance < 10) {
                this.handleCardTap(card, e);
            }
        }
    }
    
    /**
     * Lida com movimento do toque
     * @param {TouchEvent} e 
     */
    handleTouchMove(e) {
        const card = e.target.closest('.peneira-card');
        if (card) {
            card.classList.remove('touch-active');
        }
    }
    
    /**
     * Lida com tap no card
     * @param {HTMLElement} card 
     * @param {TouchEvent} e 
     */
    handleCardTap(card, e) {
        // Feedback visual
        card.classList.add('card-tapped');
        setTimeout(() => {
            card.classList.remove('card-tapped');
        }, 150);
        
        // Se não clicou em botão, destacar informações importantes
        if (!e.target.closest('button')) {
            this.highlightCardInfo(card);
        }
    }
    
    /**
     * Destaca informações importantes do card
     * @param {HTMLElement} card 
     */
    highlightCardInfo(card) {
        const dataHora = card.querySelector('.data-hora');
        const vagas = card.querySelector('.vagas-count');
        
        if (dataHora) {
            dataHora.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                dataHora.style.animation = '';
            }, 600);
        }
        
        if (vagas) {
            vagas.style.animation = 'pulse 0.6s ease-out 0.2s';
            setTimeout(() => {
                vagas.style.animation = '';
            }, 800);
        }
    }
    
    /**
     * Configura otimizações de performance
     */
    setupPerformanceOptimizations() {
        // Usar requestIdleCallback quando disponível
        const scheduleWork = window.requestIdleCallback || setTimeout;
        
        // Otimizar renderização de cards
        scheduleWork(() => {
            this.optimizeCardRendering();
        });
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Configurar Service Worker para cache (se disponível)
        if ('serviceWorker' in navigator) {
            this.setupServiceWorker();
        }
    }
    
    /**
     * Otimiza renderização dos cards
     */
    optimizeCardRendering() {
        const cards = document.querySelectorAll('.peneira-card');
        
        cards.forEach((card, index) => {
            // Lazy load cards que não estão na viewport inicial
            if (index > 2) {
                card.style.contain = 'layout style paint';
                card.style.contentVisibility = 'auto';
            }
            
            // Observar para lazy loading
            if (this.visibilityObserver) {
                this.visibilityObserver.observe(card);
            }
        });
    }
    
    /**
     * Preload de recursos críticos
     */
    preloadCriticalResources() {
        // Preload de fontes importantes
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];
        
        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Preload de assets do card
     * @param {HTMLElement} card 
     */
    preloadCardAssets(card) {
        // Preload de imagens se houver
        const images = card.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    /**
     * Configura Service Worker
     */
    setupServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('Erro ao registrar Service Worker:', error);
            });
    }
    
    /**
     * Otimiza exibição de resultados para mobile
     * @param {Array} results - Array de resultados
     */
    displayResultsOptimized(results) {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) return;
        
        // Limpar container
        resultsContainer.innerHTML = '';
        
        // Renderizar cards em batches para melhor performance
        const batchSize = this.isMobile ? 3 : 6;
        let currentBatch = 0;
        
        const renderBatch = () => {
            const startIndex = currentBatch * batchSize;
            const endIndex = Math.min(startIndex + batchSize, results.length);
            
            for (let i = startIndex; i < endIndex; i++) {
                const card = createResultCard(results[i]);
                resultsContainer.appendChild(card);
                
                // Animação escalonada
                setTimeout(() => {
                    card.classList.add('animate-fade-in-up');
                }, (i - startIndex) * 100);
            }
            
            currentBatch++;
            
            // Renderizar próximo batch se houver
            if (endIndex < results.length) {
                setTimeout(renderBatch, 200);
            } else {
                // Todos os cards renderizados
                this.onAllCardsRendered();
            }
        };
        
        renderBatch();
    }
    
    /**
     * Executado quando todos os cards são renderizados
     */
    onAllCardsRendered() {
        // Recalcular layout
        this.recalculateCardLayout();
        
        // Scroll suave para os resultados
        const resultsSection = document.getElementById('results');
        if (resultsSection && this.isMobile) {
            setTimeout(() => {
                resultsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }
    
    /**
     * Limpa recursos quando não precisar mais
     */
    destroy() {
        if (this.visibilityObserver) {
            this.visibilityObserver.disconnect();
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        clearTimeout(this.scrollTimeout);
        clearTimeout(this.resizeTimeout);
    }
}

// ========================================= //
// MELHORIAS ESPECÍFICAS PARA FORMULÁRIOS MOBILE //
// ========================================= //

/**
 * Otimiza formulários para dispositivos móveis
 */
class MobileFormOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeSearchInput();
        this.setupVirtualKeyboard();
        this.setupFormValidation();
    }
    
    /**
     * Otimiza input de busca para mobile
     */
    optimizeSearchInput() {
        const cepInput = document.getElementById('cep-input');
        if (!cepInput) return;
        
        // Melhorar teclado virtual
        cepInput.setAttribute('inputmode', 'numeric');
        cepInput.setAttribute('pattern', '[0-9]*');
        
        // Auto-formatação do CEP
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 8) {
                value = value.slice(0, 8);
            }
            
            // Formatação visual (opcional)
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            }
            
            e.target.value = value;
        });
        
        // Melhorar UX do botão de busca
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            // Feedback visual melhorado
            searchBtn.addEventListener('touchstart', () => {
                searchBtn.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            searchBtn.addEventListener('touchend', () => {
                searchBtn.style.transform = '';
            }, { passive: true });
        }
    }
    
    /**
     * Configura otimizações para teclado virtual
     */
    setupVirtualKeyboard() {
        // Detectar quando teclado virtual abre/fecha
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            if (heightDifference > 150) {
                // Teclado provavelmente aberto
                document.body.classList.add('keyboard-open');
            } else {
                // Teclado fechado
                document.body.classList.remove('keyboard-open');
            }
        });
    }
    
    /**
     * Configura validação de formulário otimizada
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showValidationErrors(form);
                }
            });
        });
    }
    
    /**
     * Valida formulário
     * @param {HTMLFormElement} form 
     * @returns {boolean}
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    /**
     * Mostra erros de validação
     * @param {HTMLFormElement} form 
     */
    showValidationErrors(form) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

// ========================================= //
// INICIALIZAÇÃO E CONFIGURAÇÃO //
// ========================================= //

// Instância global do gerenciador mobile
let mobileCardManager = null;
let mobileFormOptimizer = null;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    mobileCardManager = new MobileCardManager();
    mobileFormOptimizer = new MobileFormOptimizer();
});

// Limpar recursos quando página for fechada
window.addEventListener('beforeunload', () => {
    if (mobileCardManager) {
        mobileCardManager.destroy();
    }
});

// ========================================= //
// FUNÇÃO MELHORADA PARA EXIBIR RESULTADOS //
// ========================================= //

/**
 * Versão otimizada da função displayResults
 * @param {Array} results - Array de resultados
 */
function displayResultsOptimized(results) {
    if (mobileCardManager) {
        mobileCardManager.displayResultsOptimized(results);
    } else {
        // Fallback para versão original
        displayResults(results);
    }
}

// ========================================= //
// ESTILOS CSS ADICIONAIS PARA MOBILE UX //
// ========================================= //

const mobileUXStyles = `
    /* Estados de touch */
    .touch-active {
        transform: scale(0.98);
        transition: transform 0.1s ease-out;
    }
    
    .card-tapped {
        transform: scale(0.98);
        transition: transform 0.1s ease-out;
    }
    
    /* Otimizações durante scroll */
    .is-scrolling .peneira-card {
        pointer-events: none;
    }
    
    .is-scrolling .peneira-card:not(.card-visible) {
        transform: translateZ(0);
        will-change: auto;
    }
    
    /* Estados de visibilidade */
    .card-visible {
        will-change: transform;
    }
    
    /* Otimizações para teclado virtual */
    .keyboard-open .hero {
        min-height: 50vh;
    }
    
    .keyboard-open .results-section {
        padding-bottom: 200px;
    }
    
    /* Melhorias de acessibilidade mobile */
    .mobile-device .peneira-card:focus-within {
        outline: 3px solid #1B5E20;
        outline-offset: 2px;
    }
    
    /* Estados de erro para formulários */
    input.error {
        border-color: #f44336 !important;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
    }
    
    /* Animação de pulse para destacar informações */
    @keyframes pulse {
        0% {
            transform: scale(1);
            background-color: rgba(27, 94, 32, 0.1);
        }
        50% {
            transform: scale(1.05);
            background-color: rgba(27, 94, 32, 0.2);
        }
        100% {
            transform: scale(1);
            background-color: rgba(27, 94, 32, 0.1);
        }
    }
    
    /* Otimizações de performance */
    .peneira-card {
        contain: layout style paint;
        content-visibility: auto;
        contain-intrinsic-size: 0 400px;
    }
    
    /* Melhorias para alto contraste */
    @media (prefers-contrast: high) {
        .peneira-card {
            border-width: 3px;
        }
        
        .btn-primary,
        .btn-share {
            border-width: 3px;
        }
    }
    
    /* Redução de movimento */
    @media (prefers-reduced-motion: reduce) {
        .peneira-card,
        .touch-active,
        .card-tapped {
            transition: none;
            animation: none;
            transform: none;
        }
    }
    
    /* Otimizações para telas pequenas */
    @media (max-width: 360px) {
        .peneira-card {
            contain-intrinsic-size: 0 350px;
        }
    }
`;

// Adicionar estilos ao documento
if (!document.querySelector('#mobile-ux-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mobile-ux-styles';
    styleSheet.textContent = mobileUXStyles;
    document.head.appendChild(styleSheet);
}

// ========================================= //
// EXPORTAR FUNÇÕES PARA USO GLOBAL //
// ========================================= //

// Disponibilizar funções globalmente
window.MobileCardManager = MobileCardManager;
window.MobileFormOptimizer = MobileFormOptimizer;
window.displayResultsOptimized = displayResultsOptimized;

