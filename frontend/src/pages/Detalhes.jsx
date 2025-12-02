import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { audioService } from '../services/api';
import './Detalhes.css';

function Detalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [generatingAta, setGeneratingAta] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    loadDetails();
    
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [id]);

  const loadDetails = async () => {
    try {
      const response = await audioService.getById(id);
      if (response.data.success) {
        const audioData = response.data.data;
        setData(audioData);
        
        // Se estiver processando, iniciar polling
        if (audioData.statusProcessamento === 'PROCESSANDO') {
          startProcessingPolling();
        }
        
        // Se ata estiver sendo gerada, iniciar polling da ata
        if (audioData.statusAta === 'GERANDO') {
          setGeneratingAta(true);
          startAtaPolling();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  const startProcessingPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await audioService.getById(id);
        if (response.data.success) {
          const audioData = response.data.data;
          setData(audioData);
          
          if (audioData.statusProcessamento === 'CONCLUIDO' || audioData.statusProcessamento === 'ERRO') {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, 3000);
    
    setPollingInterval(interval);
  };

  const startAtaPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await audioService.getById(id);
        if (response.data.success) {
          const audioData = response.data.data;
          setData(audioData);
          
          if (audioData.statusAta === 'CONCLUIDA') {
            clearInterval(interval);
            setGeneratingAta(false);
            // Redirecionar para página da ata
            navigate(`/ata/${id}`);
          } else if (audioData.statusAta === 'ERRO') {
            clearInterval(interval);
            setGeneratingAta(false);
            alert(`❌ Erro ao gerar ata${audioData.erroAta ? ': ' + audioData.erroAta : ''}`);
          }
        }
      } catch (error) {
        console.error('Erro no polling da ata:', error);
      }
    }, 2000);
  };

  const handleGenerateAta = async () => {
    if (!data) return;
    
    setGeneratingAta(true);
    try {
      const response = await audioService.generateAta(id);
      if (response.data.success) {
        startAtaPolling();
      }
    } catch (error) {
      setGeneratingAta(false);
      alert('❌ Erro ao gerar ata: ' + (error.response?.data?.error || 'Erro desconhecido'));
    }
  };

  const copyTranscription = async () => {
    if (!data?.transcricao) return;
    
    try {
      await navigator.clipboard.writeText(data.transcricao);
      alert('✅ Transcrição copiada para a área de transferência!');
    } catch (err) {
      alert('❌ Erro ao copiar: ' + err);
    }
  };

  const downloadTranscription = (format = 'txt') => {
    if (!data?.transcricao) {
      alert('Nenhuma transcrição disponível para download');
      return;
    }

    const fileName = data.idReuniaoOuTeste || data.nomeOriginal.split('.')[0];
    let content, mimeType, extension;

    if (format === 'json') {
      const jsonData = {
        id: data.id,
        reuniao: data.idReuniaoOuTeste,
        nomeArquivo: data.nomeOriginal,
        formato: data.formato,
        tamanhoBytes: data.tamanhoBytes,
        statusProcessamento: data.statusProcessamento,
        transcricao: data.transcricao,
        dataUpload: data.createdAt,
        dataProcessamento: data.processadoEm,
        usuario: {
          nome: data.usuario.nome,
          email: data.usuario.email
        }
      };
      content = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      content = data.transcricao;
      mimeType = 'text/plain';
      extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcricao_${fileName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDENTE': 'Pendente',
      'PROCESSANDO': 'Processando',
      'CONCLUIDO': 'Concluído',
      'ERRO': 'Erro'
    };
    return statusMap[status] || status;
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="details-card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando detalhes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <div className="details-card">
          <div className="loading">
            <p style={{ color: '#e74c3c' }}>❌ Erro ao carregar detalhes</p>
            <button className="btn btn-primary" onClick={() => navigate('/listagem')}>
              Voltar para Listagem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-top">
        <button onClick={() => navigate('/listagem')} className="back-button">
          ← Voltar para Listagem
        </button>
        <button className="theme-toggle" onClick={toggleTheme} title="Alternar tema">
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
      </div>

      <div className="details-card">
        <h1>{data.nomeOriginal}</h1>
        <p className="subtitle">{formatDate(data.createdAt)}</p>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Reunião</div>
            <div className="info-value">{data.idReuniaoOuTeste || 'Não vinculada'}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Tamanho</div>
            <div className="info-value">{formatFileSize(data.tamanhoBytes)}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Formato</div>
            <div className="info-value">{data.formato.toUpperCase()}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Status</div>
            <div className="info-value">
              <span className={`status-badge status-${data.statusProcessamento.toLowerCase()}`}>
                {getStatusText(data.statusProcessamento)}
              </span>
            </div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Enviado por</div>
            <div className="info-value">{data.usuario.nome}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Processado em</div>
            <div className="info-value">
              {data.processadoEm ? formatDate(data.processadoEm) : 'Aguardando processamento'}
            </div>
          </div>
        </div>

        {data.statusProcessamento === 'ERRO' && data.erroProcessamento && (
          <div className="error-message">
            ❌ {data.erroProcessamento}
          </div>
        )}
      </div>

      <div className="transcription-section">
        <h2>📝 Transcrição</h2>
        
        {data.statusProcessamento === 'PROCESSANDO' && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processando transcrição...</p>
          </div>
        )}

        <div className="transcription-text">
          {data.statusProcessamento === 'CONCLUIDO' && data.transcricao ? (
            data.transcricao
          ) : data.statusProcessamento === 'PROCESSANDO' ? (
            <div className="no-transcription">⏳ Transcrição em processamento...</div>
          ) : data.statusProcessamento === 'ERRO' ? (
            <div className="no-transcription">❌ Erro ao processar transcrição</div>
          ) : (
            <div className="no-transcription">⏳ Aguardando processamento...</div>
          )}
        </div>

        {data.statusProcessamento === 'CONCLUIDO' && data.transcricao && (
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={copyTranscription}>
              📋 Copiar Transcrição
            </button>
            <button className="btn btn-secondary" onClick={() => downloadTranscription('txt')}>
              💾 Baixar como TXT
            </button>
            <button className="btn btn-secondary" onClick={() => downloadTranscription('json')}>
              💾 Baixar como JSON
            </button>
            
            {data.ataGerada && data.statusAta === 'CONCLUIDA' ? (
              <button 
                className="btn btn-ata"
                onClick={() => navigate(`/ata/${id}`)}
              >
                📄 Ver Ata Gerada
              </button>
            ) : (
              <button 
                className="btn btn-ata"
                onClick={handleGenerateAta}
                disabled={generatingAta}
              >
                {generatingAta ? '⏳ Gerando...' : '📄 Gerar Ata'}
              </button>
            )}
          </div>
        )}

        {generatingAta && (
          <div className="loading" style={{ marginTop: '20px' }}>
            <div className="spinner"></div>
            <p>Gerando ata da reunião...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detalhes;
