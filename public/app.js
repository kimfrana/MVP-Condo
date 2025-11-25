// Variáveis globais
let selectedFile = null;
const usuarioId = '4f51bb24-a766-45f0-b78f-8e2f09087422'; // Simular usuário logado

// Carregar transcrições ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTranscriptions();
    setupUploadHandlers();
    
    // Atualizar lista a cada 5 segundos (para ver mudanças de status)
    setInterval(loadTranscriptions, 5000);
});

// CA-003.01 e RN-003.02 - Carregar transcrições com filtro
async function loadTranscriptions() {
    const statusFilter = document.getElementById('statusFilter').value;
    const tbody = document.getElementById('transcriptionsBody');
    const emptyState = document.getElementById('emptyState');
    
    try {
        let url = '/api/audio';
        const params = new URLSearchParams();
        
        if (statusFilter) {
            params.append('status', statusFilter);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            // CA-003.02 - Exibir apenas registros existentes
            tbody.innerHTML = result.data.map(item => `
                <tr>
                    <td>
                        <strong>${item.nomeOriginal}</strong><br>
                        <small style="color: #999;">${formatFileSize(item.tamanhoBytes)}</small>
                    </td>
                    <td>${item.idReuniaoOuTeste || '-'}</td>
                    <td>${formatDate(item.createdAt)}</td>
                    <td>
                        <span class="status-badge status-${item.statusProcessamento.toLowerCase()}">
                            ${getStatusText(item.statusProcessamento)}
                        </span>
                    </td>
                    <td>
                        ${item.ataGerada && item.statusAta === 'CONCLUIDA' ? `
                            <a href="/ata.html?id=${item.id}" class="btn-action btn-ata">
                                📄 Ver Ata
                            </a>
                        ` : '<span style="color: #999; font-size: 12px;">-</span>'}
                    </td>
                    <td>
                        <div class="action-buttons">
                            ${item.statusProcessamento === 'PENDENTE' ? `
                                <button class="btn-action btn-edit" onclick="editTranscription('${item.id}')">
                                    ✏️ Editar
                                </button>
                            ` : ''}
                            <button class="btn-action btn-details" onclick="viewDetails('${item.id}')">
                                👁️ Detalhes
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            emptyState.style.display = 'none';
        } else {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar transcrições:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #e74c3c; padding: 40px;">
                    ❌ Erro ao carregar transcrições. Verifique se o servidor está rodando.
                </td>
            </tr>
        `;
    }
}

// RN-003.03 - Editar áudio (somente se PENDENTE)
function editTranscription(id) {
    alert(`Funcionalidade de edição será implementada na próxima US.\nID: ${id}`);
    // TODO: Implementar tela de edição
}

// RN-003.04 - Ver detalhes do áudio
function viewDetails(id) {
    window.location.href = `/detalhes.html?id=${id}`;
}

// Formatação de data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatação de tamanho de arquivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Texto do status em português
function getStatusText(status) {
    const statusMap = {
        'PENDENTE': 'Pendente',
        'PROCESSANDO': 'Processando',
        'CONCLUIDO': 'Concluído',
        'ERRO': 'Erro'
    };
    return statusMap[status] || status;
}

// Modal functions
function openUploadModal() {
    document.getElementById('uploadModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Resetar formulário
    document.getElementById('uploadForm').reset();
    selectedFile = null;
    document.getElementById('fileInfo').classList.remove('show');
    hideAlerts();
}

// Setup upload handlers
function setupUploadHandlers() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const form = document.getElementById('uploadForm');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragging');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragging');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragging');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    form.addEventListener('submit', handleSubmit);
}

function handleFile(file) {
    const validExtensions = ['mp3', 'wav', 'm4a'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        showError('Formato não suportado. Use: MP3, WAV ou M4A');
        return;
    }

    const maxSize = 400 * 1024 * 1024;
    if (file.size > maxSize) {
        showError('Arquivo muito grande. Tamanho máximo: 400MB');
        return;
    }

    selectedFile = file;
    
    document.getElementById('fileName').textContent = `📄 ${file.name}`;
    document.getElementById('fileSize').textContent = `📊 Tamanho: ${formatFileSize(file.size)}`;
    document.getElementById('fileInfo').classList.add('show');
    
    hideAlerts();
}

async function handleSubmit(e) {
    e.preventDefault();
    
    if (!selectedFile) {
        showError('Por favor, selecione um arquivo de áudio');
        return;
    }

    const reuniaoSelect = document.getElementById('reuniaoSelect');
    const idReuniaoOuTeste = reuniaoSelect.value;

    if (!idReuniaoOuTeste) {
        showError('Por favor, selecione uma reunião');
        return;
    }

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('usuarioId', usuarioId);
    formData.append('idReuniaoOuTeste', idReuniaoOuTeste);

    document.getElementById('loading').classList.add('show');
    document.getElementById('submitBtn').disabled = true;
    hideAlerts();

    try {
        const response = await fetch('/api/audio/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showSuccess(`✅ Arquivo enviado com sucesso!<br><br>
                <strong>Status:</strong> ${result.data.statusProcessamento}<br>
                A transcrição será processada em background.`);
            
            // Recarregar lista após 2 segundos
            setTimeout(() => {
                closeUploadModal();
                loadTranscriptions();
            }, 2000);
        } else {
            showError(result.error || 'Erro ao enviar arquivo');
        }
    } catch (error) {
        showError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('submitBtn').disabled = false;
    }
}

function showSuccess(message) {
    hideAlerts();
    const alert = document.getElementById('successAlert');
    alert.innerHTML = message;
    alert.classList.add('show');
}

function showError(message) {
    hideAlerts();
    const alert = document.getElementById('errorAlert');
    alert.textContent = message;
    alert.classList.add('show');
}

function hideAlerts() {
    document.getElementById('successAlert').classList.remove('show');
    document.getElementById('errorAlert').classList.remove('show');
}
