import axios from "axios";

import { API_KEY } from "@env";

const apiKey = API_KEY;

export async function fetchAudio(text, languageCode = "en-US") {
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const requestBody = {
    input: { text },
    voice: { languageCode },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const response = await axios.post(url, requestBody);
    if (response.data.audioContent) {
      return `data:audio/mp3;base64,${response.data.audioContent}`;
    }
  } catch (error) {
    console.error("Erro ao buscar o áudio:", error);
  }
}
