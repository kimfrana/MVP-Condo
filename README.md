# 🎙️ SGC-MVP - Sistema de Transcrição de Atas para Condomínios

MVP de transcrição de áudio de atas para condomínios, implementando a história de usuário US-001: Upload de Arquivo de Áudio.

## 📋 Funcionalidades Implementadas

### História de Usuário US-001

**Como** Usuário de teste  
**Quero** enviar um arquivo de áudio  
**Para que** o sistema inicie o processamento e gere uma transcrição

### ✅ Regras de Negócio Implementadas

- **RN-001.01**: Formatos suportados: `.mp3`, `.wav`, `.m4a`
- **RN-001.02**: Tamanho máximo de 400 MB
- **RN-001.03**: Upload vinculado a um ID (reunião/teste)
- **RN-001.04**: Status inicial = "pendente"

### ✅ Critérios de Aceite

- **CA-001.01**: Upload bem-sucedido cria registro com status pendente ✓
- **CA-001.02**: Arquivo inválido retorna erro claro ✓
- **CA-001.03**: Arquivo maior que o limite é rejeitado ✓

## 🚀 Tecnologias

- **Backend**: Node.js + TypeScript + Express
- **Banco de Dados**: SQLite + Prisma ORM
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Upload**: express-fileupload
- **Validação**: Zod

## 📦 Estrutura do Projeto

```
SGC-MVP/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── seed.ts                # Seed para criar usuário de teste
│   └── migrations/            # Migrações do banco
├── src/
│   ├── config/
│   │   └── upload.config.ts   # Configurações de upload
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma
│   ├── middleware/
│   │   └── validateAudioFile.ts  # Validação de arquivos
│   ├── routes/
│   │   └── audio.routes.ts    # Rotas da API
│   └── server.ts              # Servidor Express
├── public/
│   └── index.html             # Interface de upload
├── uploads/                   # Diretório para arquivos enviados
├── .env                       # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passo a Passo

1. **Clone ou navegue até o diretório do projeto**

```bash
cd c:\Users\kim_f\Documents\Projects\SGC-MVP
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o banco de dados**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Crie o usuário de teste**

```bash
npx tsx prisma/seed.ts
```

Este comando criará um usuário de teste e exibirá o UUID que você precisará usar no upload.

5. **Inicie o servidor**

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

## 📖 Como Usar

### 1. Interface Web

1. Acesse `http://localhost:3000` no navegador
2. Clique na área de upload ou arraste um arquivo de áudio
3. Cole o ID do usuário de teste (gerado pelo seed)
4. Opcionalmente, adicione um ID de reunião/teste
5. Clique em "Enviar Arquivo"

### 2. API REST

#### Upload de Arquivo

**Endpoint**: `POST /api/audio/upload`

**Headers**:
```
Content-Type: multipart/form-data
```

**Body** (form-data):
- `audio`: Arquivo de áudio (.mp3, .wav ou .m4a)
- `usuarioId`: UUID do usuário (obrigatório)
- `idReuniaoOuTeste`: Identificador da reunião (opcional)

**Exemplo de resposta (sucesso)**:
```json
{
  "success": true,
  "message": "Arquivo enviado com sucesso",
  "data": {
    "id": "uuid-do-arquivo",
    "nomeOriginal": "reuniao.mp3",
    "tamanhoBytes": 5242880,
    "formato": "mp3",
    "statusProcessamento": "PENDENTE",
    "idReuniaoOuTeste": "reuniao-001",
    "usuario": {
      "id": "uuid-do-usuario",
      "nome": "Usuário de Teste",
      "email": "teste@condominio.com"
    },
    "createdAt": "2025-11-24T..."
  }
}
```

**Exemplo de erro**:
```json
{
  "success": false,
  "error": "Formato não suportado. Formatos aceitos: mp3, wav, m4a"
}
```

#### Listar Arquivos

**Endpoint**: `GET /api/audio`

**Query Parameters**:
- `usuarioId`: Filtrar por usuário
- `status`: Filtrar por status (PENDENTE, PROCESSANDO, CONCLUIDO, ERRO)

#### Buscar Arquivo Específico

**Endpoint**: `GET /api/audio/:id`

### 3. Exemplo com cURL

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "audio=@/caminho/para/reuniao.mp3" \
  -F "usuarioId=seu-uuid-aqui" \
  -F "idReuniaoOuTeste=reuniao-001"
```

## 🗄️ Modelo de Dados

### Tabela: Usuario

| Campo     | Tipo     | Descrição           |
|-----------|----------|---------------------|
| id        | UUID     | Identificador único |
| nome      | String   | Nome do usuário     |
| email     | String   | Email (único)       |
| createdAt | DateTime | Data de criação     |
| updatedAt | DateTime | Data de atualização |

### Tabela: ArquivoAudio

| Campo               | Tipo     | Descrição                    |
|---------------------|----------|------------------------------|
| id                  | UUID     | Identificador único          |
| nomeOriginal        | String   | Nome original do arquivo     |
| nomeArmazenado      | String   | Nome no sistema de arquivos  |
| caminhoArquivo      | String   | Caminho completo do arquivo  |
| tamanhoBytes        | Int      | Tamanho em bytes             |
| formato             | String   | Extensão do arquivo          |
| statusProcessamento | Enum     | Status (PENDENTE, etc.)      |
| idReuniaoOuTeste    | String?  | ID vinculado (opcional)      |
| usuarioId           | UUID     | Relacionamento com Usuario   |
| transcricao         | String?  | Texto transcrito (futuro)    |
| processadoEm        | DateTime?| Data do processamento        |
| erroProcessamento   | String?  | Mensagem de erro (se houver) |
| createdAt           | DateTime | Data de criação              |
| updatedAt           | DateTime | Data de atualização          |

## 🧪 Cenários de Teste (Gherkin)

### ✅ Cenário 1: Upload bem-sucedido

```gherkin
Dado que estou na tela de upload
Quando envio um arquivo "reuniao.mp3" válido
Então o sistema deve salvar o arquivo
E criar registro com StatusProcessamento = "pendente"
```

### ✅ Cenário 2: Upload de formato inválido

```gherkin
Dado que estou na tela de upload
Quando envio "arquivo.txt"
Então o sistema deve exibir "Formato não suportado"
```

### ✅ Cenário 3: Arquivo muito grande

```gherkin
Dado que estou na tela de upload
Quando envio um arquivo maior que 400MB
Então o sistema deve exibir "Arquivo muito grande"
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento com hot-reload
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Gerar cliente Prisma
npm run prisma:generate

# Criar nova migration
npm run prisma:migrate

# Abrir Prisma Studio (interface visual do banco)
npm run prisma:studio

# Setup completo (instalar + gerar + migrar)
npm run setup
```

## 🔐 Variáveis de Ambiente

Arquivo `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000

# Upload
MAX_FILE_SIZE_MB=400
UPLOAD_DIR=./uploads

# Formatos suportados
SUPPORTED_FORMATS=mp3,wav,m4a
```

## 🛠️ Desenvolvimento Futuro

- [ ] Integração com serviço de transcrição (Whisper, Google Speech-to-Text, etc.)
- [ ] Processamento assíncrono com fila (Bull/BullMQ)
- [ ] Autenticação e autorização
- [ ] Dashboard de gerenciamento
- [ ] Notificações por email
- [ ] Exportação de transcrições (PDF, DOCX)
- [ ] Edição de transcrições
- [ ] Identificação de speakers

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências foram instaladas
2. Confirme que o banco de dados foi migrado
3. Verifique se o usuário de teste foi criado
4. Consulte os logs do servidor no terminal

## 📄 Licença

ISC

---

**Desenvolvido para SGC-MVP** 🏢
