# 🎬 Instalação do FFmpeg

Para usar as funcionalidades de compressão e divisão de áudio, você precisa ter o **FFmpeg** instalado no sistema.

## Windows

### Opção 1: Usando Chocolatey (Recomendado)
```bash
choco install ffmpeg
```

### Opção 2: Download Manual
1. Baixe o FFmpeg em: https://www.gyan.dev/ffmpeg/builds/
2. Extraia o arquivo ZIP
3. Adicione a pasta `bin` ao PATH do sistema:
   - Abra "Configurações do Sistema" → "Variáveis de Ambiente"
   - Adicione o caminho `C:\ffmpeg\bin` na variável PATH
4. Reinicie o terminal

### Opção 3: Usando Scoop
```bash
scoop install ffmpeg
```

## Verificar Instalação

Após instalar, verifique se o FFmpeg está disponível:

```bash
ffmpeg -version
```

Você deve ver a versão do FFmpeg e informações de compilação.

## Funcionamento do Sistema

### 1. Arquivo <= 25MB
- ✅ Transcreve diretamente
- Sem processamento adicional

### 2. Arquivo > 25MB
- 🗜️ **Comprime** automaticamente:
  - Reduz bitrate para 64kbps
  - Converte para mono
  - Reduz frequência para 16kHz
- ✅ Se após compressão <= 25MB: transcreve
- ✂️ Se ainda > 25MB: divide em partes de 10 minutos

### 3. Múltiplas Partes
- Cada parte é transcrita separadamente
- Transcrições são concatenadas
- Arquivos temporários são removidos automaticamente

## Logs do Sistema

O sistema mostra logs detalhados no console:

```
🔄 Processando áudio [id]...
📊 Tamanho original: 45.2MB
📊 Tamanho processado: 15.8MB
🗜️ Foi comprimido: Sim
📝 Transcrevendo...
✅ Transcrição concluída
🧹 Arquivos temporários limpos
```

## Troubleshooting

### "FFmpeg não encontrado"
- Verifique se o FFmpeg está no PATH
- Reinicie o terminal/servidor após instalação
- Execute `ffmpeg -version` para confirmar

### "Erro ao processar áudio"
- Verifique se o formato do arquivo é suportado
- Confirme que o arquivo não está corrompido
- Veja os logs do servidor para detalhes

---

**Nota**: O FFmpeg é necessário apenas para processamento de arquivos > 25MB. Arquivos menores funcionam sem ele.
