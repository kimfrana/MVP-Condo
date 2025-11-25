#!/bin/bash

echo "🚀 Configurando SGC-MVP - Sistema de Transcrição..."
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar Prisma Client
echo ""
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Executar migrations
echo ""
echo "🗄️ Executando migrations do banco de dados..."
npx prisma migrate dev --name init

# Executar seed
echo ""
echo "🌱 Criando usuário de teste..."
npx tsx prisma/seed.ts

# Criar diretório de uploads
echo ""
echo "📁 Criando diretório de uploads..."
mkdir -p uploads

echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "Para iniciar o servidor, execute:"
echo "  npm run dev"
echo ""
echo "O servidor estará disponível em: http://localhost:3000"
