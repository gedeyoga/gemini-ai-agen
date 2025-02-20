import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { init } from "./services/pinecone";
import { model } from "./aiAgen";

const getInformasiProductKonek =  async (prompting) => {
    
    try {
        const vectorStore = await init();
        const prompt = ChatPromptTemplate.fromTemplate(`
            Jawab pertanyaan hanya berdasarkan pada context yang disediakan.
    
            Context: {context}
    
            Question: {question}
        `);
    
        const ragChain = RunnableSequence.from([
            {
                context: vectorStore.asRetriever(),
                question: new RunnablePassthrough(),
            },
            prompt,
            model,
            new StringOutputParser(),
        ]);
    
        const data = await ragChain.invoke(prompting);
    
        return data;
    } catch (error) {
        return 'Error'
    }

}

export { getInformasiProductKonek }