import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export const transcribeAudio = async (audioBuffer, filename) => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.WHISPER_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ No OpenAI API Key found. Using Mock Transcription.');
    // Simulate slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `[MOCK TRANSCRIPTION] The volunteer expressed interest in street dog rescue and confirmed availability for weekend cycles. (Audio: ${filename})`;
  }

  const openai = new OpenAI({
    apiKey,
  });

  const tempPath = path.join(tmpdir(), `transcription-${Date.now()}-${filename}`);
  
  try {
    // Write buffer to temporary file because OpenAI API expects a file stream
    fs.writeFileSync(tempPath, audioBuffer);
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error('❌ Whisper Transcription Error:', error);
    throw error;
  } finally {
    // Delete temporary file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
};
