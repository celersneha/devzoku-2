import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddings } from "./embeddings";

const initialiseVectorStore = async ({
  collectionName,
}: {
  collectionName: string;
}) => {
  const qdrantUrl = process.env.QDRANT_URL;
  if (!qdrantUrl) {
    throw new Error("QDRANT_URL is not set");
  }

  let vectorStore: any = null;

  vectorStore = await QdrantVectorStore.fromExistingCollection(
    getEmbeddings(),
    {
      url: qdrantUrl,
      collectionName: collectionName,
    },
  );

  return vectorStore;
};

export { initialiseVectorStore };
