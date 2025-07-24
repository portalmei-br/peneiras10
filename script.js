// FUNÇÃO APRIMORADA PARA CRIAR CARDS DE PENEIRAS - DESIGN PROFISSIONAL
function createResultCard(peneira) {
    const card = document.createElement('div');
    card.className = 'peneira-card';
    
    // Adicionar classe de estado se encerrada
    if (peneira.status === 'encerrada') {
        card.classList.add('encerrada');
    }
    
    const dataFormatada = formatDateComplete(peneira.data);
    const dataSimples = formatDateSimple(peneira.data);
    const distanciaTexto = peneira.distancia < 1 ? 
        `${Math.round(peneira.distancia * 1000)}m` : 
        `${peneira.distancia}km`;
    
    // Determinar status e urgência
    const statusInfo = getStatusInfo(peneira);
    const vagasInfo = getVagasInfo(peneira);
    const prazoInfo = getPrazoInfo(peneira);
    
    card.innerHTML = `
        <!-- Header do Card -->
        <div class="card-header status-${peneira.status}">
            <div class="status-badge ${statusInfo.class}">
                <i class="fas fa-${statusInfo.icon} status-icon"></i>
                <span>${statusInfo.text}</span>
            </div>
            <div class="distance-badge">
                <i class="fas fa-map-marker-alt"></i>
                ${distanciaTexto}
            </div>
        </div>
        
        <!-- Conteúdo Principal -->
        <div class="card-content">
            <!-- Seção de Título e Clube -->
            <div class="card-title-section">
                <h3 class="peneira-title">${peneira.titulo}</h3>
                <div class="peneira-club">
                    <div class="club-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <span>${peneira.clube}</span>
                </div>
            </div>
            
            <!-- Seção de Informações -->
            <div class="card-info-section">
                <!-- Data e Hora - Destaque -->
                <div class="datetime-row">
                    <div class="info-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-primary">${dataSimples} • ${peneira.horario}</div>
                        <div class="info-secondary">${dataFormatada}</div>
                    </div>
                </div>
                
                <!-- Local -->
                <div class="info-row">
                    <div class="info-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-primary">Local</div>
                        <div class="info-secondary">${peneira.endereco}</div>
                    </div>
                </div>
                
                <!-- Categoria -->
                <div class="info-row">
                    <div class="info-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-primary">Categoria</div>
                        <div class="info-secondary">${peneira.categoria}</div>
                    </div>
                </div>
                
                <!-- Requisitos -->
                <div class="info-row">
                    <div class="info-icon">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-primary">Requisitos</div>
                        <div class="info-secondary">${peneira.requisitos}</div>
                    </div>
                </div>
            </div>
            
            ${peneira.status === 'aberta' ? `
                <!-- Seção de Vagas -->
                <div class="vagas-section">
                    <div class="vagas-header">
                        <span class="vagas-title">Vagas Disponíveis</span>
                        <span class="vagas-count">${peneira.vagasDisponiveis}/${peneira.totalVagas}</span>
                    </div>
                    <div class="vagas-progress">
                        <div class="vagas-progress-bar ${vagasInfo.class}" style="width: ${vagasInfo.percentage}%"></div>
                    </div>
                    <div class="vagas-status ${vagasInfo.class}">${vagasInfo.text}</div>
                </div>
                
                <!-- Seção de Prazo -->
                <div class="prazo-section ${prazoInfo.urgent ? 'prazo-urgente' : ''}">
                    <div class="prazo-label">Inscrições até ${formatDateSimple(peneira.prazoInscricao)}</div>
                    <div class="prazo-value">${prazoInfo.text}</div>
                </div>
            ` : ''}
        </div>
        
        <!-- Rodapé com Ações -->
        <div class="card-footer">
            <div class="card-actions">
                ${peneira.status === 'aberta' ? `
                    <button class="btn-primary" onclick="openDirections('${peneira.endereco}')" aria-label="Ver localização da peneira">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Ver Local</span>
                    </button>
                    <button class="btn-share" onclick="shareResult(${peneira.id})" aria-label="Compartilhar peneira">
                        <i class="fas fa-share-alt"></i>
                    </button>
                ` : `
                    <button class="btn-disabled" disabled aria-label="Peneira encerrada">
                        <i class="fas fa-lock"></i>
                        <span>Encerrada</span>
                    </button>
                    <button class="btn-share" onclick="shareResult(${peneira.id})" aria-label="Compartilhar peneira">
                        <i class="fas fa-share-alt"></i>
                    </button>
                `}
            </div>
        </div>
    `;
    
    return card;
}

// Função para obter informações de status
function getStatusInfo(peneira) {
    if (peneira.status === 'encerrada') {
        return {
            class: 'encerrada',
            text: 'Encerrada',
            icon: 'lock'
        };
    }
    
    if (peneira.vagasDisponiveis <= 3) {
        return {
            class: 'urgente',
            text: 'Últimas Vagas',
            icon: 'exclamation-triangle'
        };
    } else if (peneira.vagasDisponiveis <= 8) {
        return {
            class: 'aberta',
            text: 'Vagas Limitadas',
            icon: 'clock'
        };
    } else {
        return {
            class: 'aberta',
            text: 'Disponível',
            icon: 'check-circle'
        };
    }
}

// Função para obter informações de vagas
function getVagasInfo(peneira) {
    if (peneira.status !== 'aberta') {
        return { class: '', text: '', percentage: 0 };
    }
    
    const percentage = (peneira.vagasDisponiveis / peneira.totalVagas) * 100;
    
    if (peneira.vagasDisponiveis <= 3) {
        return {
            class: 'urgente',
            text: 'Poucas vagas restantes!',
            percentage: percentage
        };
    } else if (peneira.vagasDisponiveis <= 8) {
        return {
            class: 'limitado',
            text: 'Vagas limitadas',
            percentage: percentage
        };
    } else {
        return {
            class: 'disponivel',
            text: 'Muitas vagas disponíveis',
            percentage: percentage
        };
    }
}

// Função para obter informações de prazo
function getPrazoInfo(peneira) {
    const hoje = new Date();
    const prazo = new Date(peneira.prazoInscricao);
    const diffTime = prazo - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { text: 'Prazo expirado', urgent: true };
    } else if (diffDays === 0) {
        return { text: 'Último dia!', urgent: true };
    } else if (diffDays === 1) {
        return { text: 'Termina amanhã', urgent: true };
    } else if (diffDays <= 3) {
        return { text: `${diffDays} dias restantes`, urgent: true };
    } else {
        return { text: `${diffDays} dias restantes`, urgent: false };
    }
}

// Função para formatar data completa
function formatDateComplete(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para formatar data simples (mantida para compatibilidade)
function formatDateSimple(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
    });
}

// Função aprimorada para exibir resultados com animações
function displayResults(results) {
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    if (results.length === 0) {
        resultsContainer.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    resultsContainer.style.display = 'grid';
    resultsContainer.innerHTML = '';
    
    results.forEach((peneira, index) => {
        const resultCard = createResultCard(peneira);
        resultsContainer.appendChild(resultCard);
        
        // Animação escalonada aprimorada
        setTimeout(() => {
            resultCard.classList.add('animate-fade-in-up');
        }, index * 150);
    });
    
    // Adicionar observador para animações de scroll
    setupCardAnimations();
}

// Função para configurar animações dos cards
function setupCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar todos os cards
    const cards = document.querySelectorAll('.peneira-card');
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Função aprimorada para compartilhar resultado
function shareResult(peneiraId) {
    const peneira = peneirasData.find(p => p.id === peneiraId);
    
    if (!peneira) {
        showNotification('Erro ao encontrar informações da peneira', 'error');
        return;
    }
    
    const shareData = {
        title: `Peneira: ${peneira.titulo}`,
        text: `🏆 ${peneira.titulo} - ${peneira.clube}\n📅 ${formatDateComplete(peneira.data)} às ${peneira.horario}\n📍 ${peneira.endereco}\n👥 ${peneira.categoria}\n\n✅ Encontre mais peneiras em:`,
        url: window.location.href
    };
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => {
                showNotification('Peneira compartilhada com sucesso!', 'success');
            })
            .catch(err => {
                console.log('Erro ao compartilhar:', err);
                fallbackShare(peneira);
            });
    } else {
        fallbackShare(peneira);
    }
}

// Função de fallback para compartilhamento
function fallbackShare(peneira) {
    const text = `🏆 ${peneira.titulo} - ${peneira.clube}
📅 ${formatDateComplete(peneira.data)} às ${peneira.horario}
📍 ${peneira.endereco}
👥 ${peneira.categoria}
📞 ${peneira.contato}

✅ Encontre mais peneiras em: ${window.location.href}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Informações copiadas para a área de transferência!', 'success');
            })
            .catch(() => {
                legacyCopyToClipboard(text);
            });
    } else {
        legacyCopyToClipboard(text);
    }
}

// Função legacy para copiar texto
function legacyCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Informações copiadas para a área de transferência!', 'success');
        } else {
            showNotification('Não foi possível copiar as informações', 'error');
        }
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showNotification('Erro ao copiar informações', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

// Função aprimorada para abrir direções
function openDirections(endereco) {
    try {
        const encodedAddress = encodeURIComponent(endereco);
        
        // Detectar se é dispositivo móvel
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        let url;
        if (isMobile) {
            // Para dispositivos móveis, tentar abrir o app nativo
            url = `https://maps.google.com/maps?daddr=${encodedAddress}`;
        } else {
            // Para desktop, abrir no Google Maps web
            url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        }
        
        const newWindow = window.open(url, '_blank');
        
        if (!newWindow) {
            // Se o popup foi bloqueado, mostrar notificação
            showNotification('Por favor, permita popups para abrir o mapa', 'warning');
        } else {
            showNotification('Abrindo direções no Google Maps...', 'info');
        }
        
    } catch (error) {
        console.error('Erro ao abrir direções:', error);
        showNotification('Erro ao abrir direções. Tente novamente.', 'error');
    }
}

// Função para adicionar loading state aos cards
function setCardLoading(cardElement, isLoading) {
    if (isLoading) {
        cardElement.classList.add('loading');
        cardElement.setAttribute('aria-busy', 'true');
    } else {
        cardElement.classList.remove('loading');
        cardElement.removeAttribute('aria-busy');
    }
}

// Função para melhorar acessibilidade dos cards
function enhanceCardAccessibility() {
    const cards = document.querySelectorAll('.peneira-card');
    
    cards.forEach((card, index) => {
        // Adicionar role e aria-label
        card.setAttribute('role', 'article');
        card.setAttribute('aria-labelledby', `card-title-${index}`);
        
        // Adicionar ID ao título
        const title = card.querySelector('.peneira-title');
        if (title) {
            title.id = `card-title-${index}`;
        }
        
        // Melhorar navegação por teclado
        card.setAttribute('tabindex', '0');
        
        // Adicionar eventos de teclado
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const primaryButton = card.querySelector('.btn-primary');
                if (primaryButton && !primaryButton.disabled) {
                    primaryButton.click();
                }
            }
        });
    });
}

// Função para otimizar performance dos cards
function optimizeCardPerformance() {
    // Lazy loading para cards fora da viewport
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    const cards = document.querySelectorAll('.peneira-card');
    cards.forEach(card => {
        cardObserver.observe(card);
    });
}

// Função para validar dados da peneira
function validatePeneiraData(peneira) {
    const required = ['id', 'titulo', 'clube', 'endereco', 'data', 'horario', 'categoria', 'status'];
    
    for (const field of required) {
        if (!peneira[field]) {
            console.warn(`Campo obrigatório ausente: ${field}`, peneira);
            return false;
        }
    }
    
    // Validar data
    const date = new Date(peneira.data);
    if (isNaN(date.getTime())) {
        console.warn('Data inválida:', peneira.data);
        return false;
    }
    
    // Validar status
    if (!['aberta', 'encerrada'].includes(peneira.status)) {
        console.warn('Status inválido:', peneira.status);
        return false;
    }
    
    return true;
}

// Função para filtrar e validar dados antes de exibir
function displayValidatedResults(results) {
    const validResults = results.filter(validatePeneiraData);
    
    if (validResults.length !== results.length) {
        console.warn(`${results.length - validResults.length} peneiras foram removidas por dados inválidos`);
    }
    
    displayResults(validResults);
    
    // Melhorar acessibilidade após renderização
    setTimeout(() => {
        enhanceCardAccessibility();
        optimizeCardPerformance();
    }, 100);
}

// Substituir a função displayResults original
const originalDisplayResults = displayResults;
displayResults = displayValidatedResults;

// Adicionar estilos CSS adicionais via JavaScript
const enhancedStyles = `
    /* Melhorias de acessibilidade */
    .peneira-card:focus {
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    /* Estados de loading aprimorados */
    .peneira-card.loading {
        position: relative;
        overflow: hidden;
    }
    
    .peneira-card.loading::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.6) 50%, 
            transparent 100%);
        animation: loading-shimmer 1.5s infinite;
        z-index: 1000;
    }
    
    @keyframes loading-shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    /* Melhorias para foco */
    .btn-primary:focus-visible,
    .btn-share:focus-visible {
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    /* Transições suaves para visibilidade */
    .peneira-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .peneira-card.visible,
    .peneira-card.animate-fade-in-up {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Melhorias para dispositivos touch */
    @media (hover: none) and (pointer: coarse) {
        .peneira-card:hover {
            transform: none;
        }
        
        .peneira-card:active {
            transform: scale(0.98);
        }
        
        .btn-primary:hover,
        .btn-share:hover {
            transform: none;
        }
        
        .btn-primary:active,
        .btn-share:active {
            transform: scale(0.95);
        }
    }
`;

// Adicionar estilos aprimorados
if (!document.getElementById('enhanced-card-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'enhanced-card-styles';
    styleSheet.textContent = enhancedStyles;
    document.head.appendChild(styleSheet);
}

