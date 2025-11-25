@echo off
echo 🚀 Configurando SGC-MVP - Sistema de Transcrição...
echo.

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install

REM Gerar Prisma Client
echo.
echo 🔧 Gerando Prisma Client...
call npx prisma generate

REM Executar migrations
echo.
echo 🗄️ Executando migrations do banco de dados...
call npx prisma migrate dev --name init

REM Executar seed
echo.
echo 🌱 Criando usuário de teste...
call npx tsx prisma/seed.ts

REM Criar diretório de uploads
echo.
echo 📁 Criando diretório de uploads...
if not exist "uploads" mkdir uploads

echo.
echo ✅ Setup concluído com sucesso!
echo.
echo Para iniciar o servidor, execute:
echo   npm run dev
echo.
echo O servidor estará disponível em: http://localhost:3000
pause
