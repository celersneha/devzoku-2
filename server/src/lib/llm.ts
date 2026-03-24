import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let model: ChatGoogleGenerativeAI | null = null;

const getLlm = () => {
  if (model) {
    return model;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set");
  }

  model = new ChatGoogleGenerativeAI({
    apiKey,
    model: "gemini-2.0-flash",
  });

  return model;
};

export { getLlm };
