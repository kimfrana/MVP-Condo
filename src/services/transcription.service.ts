import Groq from 'groq-sdk';
import fs from 'fs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

/**
 * Transcreve um arquivo de áudio usando a API do Groq (Whisper)
 * @param filePath Caminho completo do arquivo de áudio
 * @returns Resultado da transcrição
 */
export async function transcribeAudio(filePath: string): Promise<TranscriptionResult> {
  try {
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo não encontrado');
    }

    // Criar stream do arquivo
    const fileStream = fs.createReadStream(filePath);

    // Fazer a transcrição usando Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-large-v3',
      prompt: 'Esta é uma transcrição de uma reunião de condomínio.',
      response_format: 'verbose_json',
      language: 'pt',
      temperature: 0.0
    });

    return {
      text: transcription.text,
      duration: transcription.duration,
      language: transcription.language
    };

  } catch (error: any) {
    console.error('Erro ao transcrever áudio:', error);
    throw new Error(`Falha na transcrição: ${error.message || 'Erro desconhecido'}`);
  }
}

/**
 * Verifica se a API Key do Groq está configurada
 */
export function isGroqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
}
