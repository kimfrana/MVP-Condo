-- CreateTable
CREATE TABLE "assinaturas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "arquivoAudioId" TEXT NOT NULL,
    "nomeAssinante" TEXT NOT NULL,
    "cpfAssinante" TEXT,
    "emailAssinante" TEXT,
    "cargoAssinante" TEXT,
    "tipoAssinatura" TEXT NOT NULL DEFAULT 'SIMPLES',
    "hashDocumento" TEXT,
    "ipAssinante" TEXT,
    "userAgentAssinante" TEXT,
    "govbrCpf" TEXT,
    "govbrNivelConta" TEXT,
    "govbrCertificadoId" TEXT,
    "assinadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assinaturas_arquivoAudioId_fkey" FOREIGN KEY ("arquivoAudioId") REFERENCES "arquivos_audio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
