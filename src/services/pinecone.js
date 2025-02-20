import { PineconeStore, PineconeEmbeddings  } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { config } from 'dotenv';
config();

const init = async () => {
    const embeddings = new PineconeEmbeddings({
        model: "multilingual-e5-large",
    });

    const pinecone = new PineconeClient();
    // Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
    
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
    });

    return vectorStore;
}

const addStores = async (datas = [], primaryKey = 'id') => {

    const vectorStore = await init();
    const documents = datas;

    let ids = [];

    for (let index = 0; index < documents.length; index++) {
        ids.push(documents[index][primaryKey]);
    }

    return await vectorStore.addDocuments(documents, { ids: ids });

}

const deleteStores = async (ids = []) => {

    const vectorStore = await init();
    
    return await vectorStore.delete({ids: ids});

}

export { init, addStores, deleteStores }
