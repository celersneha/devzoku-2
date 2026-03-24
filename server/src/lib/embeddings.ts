import { MistralAIEmbeddings } from "@langchain/mistralai";

let embeddings: MistralAIEmbeddings | null = null;

export const getEmbeddings = () => {
  if (embeddings) {
    return embeddings;
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not set");
  }

  embeddings = new MistralAIEmbeddings({
    apiKey,
    model: "mistral-embed",
  });

  return embeddings;
};
