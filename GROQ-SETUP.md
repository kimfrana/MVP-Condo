# 🔑 Configuração da API do Groq

Para habilitar a transcrição de áudio, você precisa configurar a API Key do Groq.

## Passos:

1. **Criar conta no Groq**: https://console.groq.com

2. **Gerar API Key**: 
   - Acesse: https://console.groq.com/keys
   - Clique em "Create API Key"
   - Copie a key gerada

3. **Configurar no projeto**:
   - Abra o arquivo `.env`
   - Substitua `your_groq_api_key_here` pela sua API Key:
   ```env
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

4. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

## Como funciona:

1. **Upload**: Arquivo é salvo com status `PENDENTE`
2. **Processamento Assíncrono**: Sistema inicia transcrição em background
3. **Status atualizado para**: `PROCESSANDO`
4. **Após conclusão**: 
   - Sucesso → `CONCLUIDO` (transcrição salva no banco)
   - Erro → `ERRO` (mensagem de erro salva)

## Verificar status da transcrição:

```bash
# Via API
curl http://localhost:3000/api/audio/{id}

# Ou use o Prisma Studio
npm run prisma:studio
```

## Modelo utilizado:

- **Whisper Large V3** (via Groq)
- Otimizado para português
- Alta precisão para reuniões e atas

## Limitações do Groq (Free Tier):

- Tamanho máximo de arquivo: ~25 MB
- Rate limit: consulte a documentação do Groq
- Para arquivos maiores, considere dividir o áudio ou usar plano pago

---

**Nota**: Se a API Key não estiver configurada, o upload funcionará normalmente, mas a transcrição falhará com status `ERRO`.
