import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { audioService } from '../services/api';
import './Ata.css';

function Ata() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showSignModal, setShowSignModal] = useState(false);
  const [signForm, setSignForm] = useState({
    nomeAssinante: '',
    cpfAssinante: '',
    emailAssinante: '',
    cargoAssinante: ''
  });
  const [signLoading, setSignLoading] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    loadAta();
  }, [id]);

  const loadAta = async () => {
    try {
      const response = await audioService.getById(id);
      if (response.data.success) {
        const audioData = response.data.data;
        
        if (!audioData.ataGerada || !audioData.textoAta) {
          setError('Esta transcrição ainda não possui uma ata gerada. Volte para a página de detalhes e clique em "Gerar Ata".');
          return;
        }
        
        setData(audioData);
      } else {
        setError(response.data.error || 'Erro ao carregar ata');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar ata');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const copyAta = async () => {
    try {
      await navigator.clipboard.writeText(data.textoAta);
      alert('✅ Ata copiada para a área de transferência!');
    } catch (err) {
      alert('❌ Erro ao copiar: ' + err);
    }
  };

  const downloadAta = (format = 'txt') => {
    if (!data || !data.textoAta) return;

    const fileName = data.idReuniaoOuTeste || data.nomeOriginal.split('.')[0];
    let content, mimeType, extension;

    if (format === 'json') {
      const jsonData = {
        id: data.id,
        reuniao: data.idReuniaoOuTeste,
        nomeArquivo: data.nomeOriginal,
        ata: data.textoAta,
        dataGeracao: data.ataGeradaEm,
        usuario: {
          nome: data.usuario.nome,
          email: data.usuario.email
        }
      };
      content = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      content = data.textoAta;
      mimeType = 'text/plain';
      extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ata_${fileName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSignSubmit = async (e) => {
    e.preventDefault();
    
    if (!signForm.nomeAssinante.trim()) {
      alert('Por favor, preencha seu nome');
      return;
    }

    setSignLoading(true);
    try {
      const response = await audioService.assinar(id, signForm);
      
      if (response.data.success) {
        alert('✅ Ata assinada com sucesso!');
        setShowSignModal(false);
        setSignForm({
          nomeAssinante: '',
          cpfAssinante: '',
          emailAssinante: '',
          cargoAssinante: ''
        });
        // Recarregar dados para mostrar nova assinatura
        loadAta();
      }
    } catch (err) {
      alert('❌ Erro ao assinar: ' + (err.response?.data?.error || 'Erro desconhecido'));
    } finally {
      setSignLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando ata...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>❌ Erro ao carregar ata</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/listagem')}
            style={{ marginTop: '20px' }}
          >
            Voltar para Listagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-top">
        <button onClick={() => navigate(`/detalhes/${id}`)} className="back-button">
          ← Voltar para Detalhes
        </button>
        <button className="theme-toggle" onClick={toggleTheme} title="Alternar tema">
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
      </div>

      <div className="ata-header">
        <h1>📄 Ata - {data.idReuniaoOuTeste || 'Reunião'}</h1>
        
        <div className="metadata">
          <div className="metadata-item">
            📅 <strong>Gerada em:</strong> <span>{formatDate(data.ataGeradaEm)}</span>
          </div>
          <div className="metadata-item">
            🏢 <strong>Reunião:</strong> <span>{data.idReuniaoOuTeste || 'Não vinculada'}</span>
          </div>
          <div className="metadata-item">
            👤 <strong>Usuário:</strong> <span>{data.usuario.nome}</span>
          </div>
          <div className="metadata-item">
            🎙️ <strong>Arquivo:</strong> <span>{data.nomeOriginal}</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-sign" onClick={() => setShowSignModal(true)}>
          ✍️ Assinar Ata
        </button>
        <button className="btn btn-primary" onClick={copyAta}>
          📋 Copiar Ata
        </button>
        <button className="btn btn-secondary" onClick={() => downloadAta('txt')}>
          💾 Baixar TXT
        </button>
        <button className="btn btn-secondary" onClick={() => downloadAta('json')}>
          💾 Baixar JSON
        </button>
        <button className="btn btn-outline" onClick={() => window.print()}>
          🖨️ Imprimir
        </button>
        <button className="btn btn-outline" onClick={() => navigate(`/detalhes/${id}`)}>
          📝 Ver Transcrição Original
        </button>
      </div>

      <div className="ata-content">
        <div className="ata-text">
          {data.textoAta}
        </div>
      </div>

      {/* Lista de Assinaturas */}
      {data.assinaturas && data.assinaturas.length > 0 && (
        <div className="assinaturas-section">
          <h2>✍️ Assinaturas ({data.assinaturas.length})</h2>
          <div className="assinaturas-list">
            {data.assinaturas.map((assinatura) => (
              <div key={assinatura.id} className="assinatura-card">
                <div className="assinatura-header">
                  <strong>{assinatura.nomeAssinante}</strong>
                  {assinatura.cargoAssinante && (
                    <span className="assinatura-cargo">{assinatura.cargoAssinante}</span>
                  )}
                </div>
                <div className="assinatura-details">
                  {assinatura.cpfAssinante && (
                    <span>CPF: {assinatura.cpfAssinante}</span>
                  )}
                  {assinatura.emailAssinante && (
                    <span>Email: {assinatura.emailAssinante}</span>
                  )}
                  <span>Assinado em: {formatDate(assinatura.assinadoEm)}</span>
                  <span className="assinatura-tipo">{assinatura.tipoAssinatura}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Assinatura */}
      {showSignModal && (
        <div className="modal-overlay" onClick={() => setShowSignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✍️ Assinar Ata</h2>
              <button className="modal-close" onClick={() => setShowSignModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSignSubmit}>
              <div className="form-group">
                <label htmlFor="nomeAssinante">Nome Completo *</label>
                <input
                  type="text"
                  id="nomeAssinante"
                  value={signForm.nomeAssinante}
                  onChange={(e) => setSignForm({...signForm, nomeAssinante: e.target.value})}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cargoAssinante">Cargo</label>
                <input
                  type="text"
                  id="cargoAssinante"
                  value={signForm.cargoAssinante}
                  onChange={(e) => setSignForm({...signForm, cargoAssinante: e.target.value})}
                  placeholder="Ex: Síndico, Subsíndico, Conselheiro"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cpfAssinante">CPF</label>
                <input
                  type="text"
                  id="cpfAssinante"
                  value={signForm.cpfAssinante}
                  onChange={(e) => setSignForm({...signForm, cpfAssinante: e.target.value})}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAssinante">E-mail</label>
                <input
                  type="email"
                  id="emailAssinante"
                  value={signForm.emailAssinante}
                  onChange={(e) => setSignForm({...signForm, emailAssinante: e.target.value})}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="sign-info">
                <p>ℹ️ <strong>Assinatura Simples</strong></p>
                <p>Esta é uma assinatura eletrônica simples para controle interno. Para assinatura com validade jurídica, será necessário integração com gov.br ou certificado digital.</p>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowSignModal(false)}
                  disabled={signLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-sign"
                  disabled={signLoading}
                >
                  {signLoading ? 'Assinando...' : '✍️ Assinar Ata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ata;
