# 🚀 Quick Start Guide - SGC-MVP

## Usuário de Teste Criado

**ID do Usuário**: `4f51bb24-a766-45f0-b78f-8e2f09087422`
**Email**: `teste@condominio.com`

Use este ID para fazer upload de arquivos!

---

## Como Iniciar o Servidor

### Opção 1: Comando npm
```bash
npm run dev
```

### Opção 2: Comando direto
```bash
npx tsx watch src/server.ts
```

### Opção 3: Windows (PowerShell/CMD)
```cmd
npm run dev
```

Após iniciar, acesse:
- **Interface Web**: http://localhost:3000
- **API**: http://localhost:3000/api/audio
- **Health Check**: http://localhost:3000/health

---

## Teste Rápido via Interface Web

1. Abra o navegador em http://localhost:3000
2. Clique ou arraste um arquivo de áudio (.mp3, .wav ou .m4a)
3. Cole o ID do usuário: `4f51bb24-a766-45f0-b78f-8e2f09087422`
4. (Opcional) Adicione um ID de reunião, ex: "reuniao-001"
5. Clique em "Enviar Arquivo"

---

## Teste Rápido via cURL

```bash
curl -X POST http://localhost:3000/api/audio/upload \
  -F "audio=@seu-arquivo.mp3" \
  -F "usuarioId=4f51bb24-a766-45f0-b78f-8e2f09087422" \
  -F "idReuniaoOuTeste=reuniao-001"
```

---

## Comandos Úteis

```bash
# Ver banco de dados no Prisma Studio
npm run prisma:studio

# Criar novo usuário
npm run seed

# Listar arquivos enviados (API)
curl http://localhost:3000/api/audio

# Verificar status do servidor
curl http://localhost:3000/health
```

---

## Estrutura de Pastas

```
SGC-MVP/
├── src/               # Código-fonte TypeScript
├── prisma/            # Schema e migrations do banco
├── public/            # Interface web
├── uploads/           # Arquivos de áudio enviados
└── README.md          # Documentação completa
```

---

## Validações Implementadas ✅

- ✅ Formatos: .mp3, .wav, .m4a
- ✅ Tamanho máximo: 400 MB
- ✅ Usuário deve existir no banco
- ✅ Status inicial: PENDENTE
- ✅ Mensagens de erro claras

---

## Próximos Passos

1. **Teste o upload** via interface web
2. **Veja os registros** no Prisma Studio: `npm run prisma:studio`
3. **Consulte a API**: veja `API-TESTS.md` para exemplos
4. **Leia o README.md** para documentação completa

---

**Desenvolvido para SGC-MVP** 🏢
