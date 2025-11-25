# Testes de API - SGC-MVP

## Upload Bem-Sucedido (MP3)

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "audio=@reuniao.mp3" \
  -F "usuarioId=SEU-UUID-AQUI" \
  -F "idReuniaoOuTeste=reuniao-001"
```

## Upload Bem-Sucedido (WAV)

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "audio=@reuniao.wav" \
  -F "usuarioId=SEU-UUID-AQUI" \
  -F "idReuniaoOuTeste=reuniao-002"
```

## Upload Bem-Sucedido (M4A)

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "audio=@reuniao.m4a" \
  -F "usuarioId=SEU-UUID-AQUI"
```

## Teste de Formato Inválido

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "audio=@arquivo.txt" \
  -F "usuarioId=SEU-UUID-AQUI"
```

**Resposta esperada**: 
```json
{
  "success": false,
  "error": "Formato não suportado. Formatos aceitos: mp3, wav, m4a"
}
```

## Teste de Usuário Inexistente

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "audio=@reuniao.mp3" \
  -F "usuarioId=00000000-0000-0000-0000-000000000000"
```

**Resposta esperada**: 
```json
{
  "success": false,
  "error": "Usuário não encontrado"
}
```

## Teste Sem Arquivo

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "usuarioId=SEU-UUID-AQUI"
```

**Resposta esperada**: 
```json
{
  "success": false,
  "error": "Nenhum arquivo foi enviado"
}
```

## Listar Todos os Arquivos

```bash
curl http://localhost:3000/api/audio
```

## Listar Arquivos por Usuário

```bash
curl "http://localhost:3000/api/audio?usuarioId=SEU-UUID-AQUI"
```

## Listar Arquivos Pendentes

```bash
curl "http://localhost:3000/api/audio?status=PENDENTE"
```

## Buscar Arquivo Específico

```bash
curl http://localhost:3000/api/audio/ID-DO-ARQUIVO
```

## Health Check

```bash
curl http://localhost:3000/health
```

---

## Testando com Postman

### 1. Upload de Arquivo

- Método: `POST`
- URL: `http://localhost:3000/api/audio/upload`
- Body: `form-data`
  - Key: `audio` (Type: File) - Selecione um arquivo .mp3, .wav ou .m4a
  - Key: `usuarioId` (Type: Text) - Cole o UUID do usuário de teste
  - Key: `idReuniaoOuTeste` (Type: Text) - Ex: "reuniao-001" (opcional)

### 2. Listar Arquivos

- Método: `GET`
- URL: `http://localhost:3000/api/audio`

### 3. Buscar Arquivo por ID

- Método: `GET`
- URL: `http://localhost:3000/api/audio/{id}`

---

## Validações Implementadas

✅ Formato de arquivo (.mp3, .wav, .m4a)  
✅ MIME type correto  
✅ Tamanho máximo (400MB)  
✅ Usuário existente  
✅ UUID válido  
✅ Arquivo presente na requisição
