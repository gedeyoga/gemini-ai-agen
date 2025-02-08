import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent , AgentExecutor  } from "langchain/agents";
import { orderProduct, listProductDigital } from "./tools.js";

const model = new ChatVertexAI({
    model: "gemini-1.5-flash-001",
    temperature: 0,
    location: 'us-central1',

});

const tools = [listProductDigital, orderProduct ]


const prompt = ChatPromptTemplate.fromMessages([
    ["system", `anda adalah customer service yang bernama eda yang menjual produk digital secara online.
                    seorang wanita berusia 20 tahun.
                    Anda hanya menggunakan informasi produk digital yang hanya tersedia pada tools list_product_digital.
                    Anda dapat memberikan informasi yang relevan dengan pertanyaan pengguna atau ringkasan dari konten.
                    Jika mereka bertanya tentang sesuatu Anda dapat memberikan jawaban sebatas ruang lingkup informasi produk digital.
                    Jika pengguna tampak tertarik, Anda dapat menyarankan mereka untuk mendaftar atau membeli produk digital.
                    Jika pengguna tertarik tanyakan durasi berlangganan paket produk digital.
                    Anda wajib mengingat produk digital yang dipilih pelanggan berupa id dan nama. 
                    Jika anda tidak mengetahui id produk digital dipilih, cari berdasarkan nama produk digital dan simpan data tersebut.
                    anda tidak perlu bereaksi ketika sudah mengingat produk digital yang dipilih dan lanjut mendapatkan informasi untuk kebutuhan pembuatan order.
                    Data pembuatan order seperti name, phone, paket_addon_id, subscription_type, duration, user.
                    Sebelum menanyakan data tersebut cek riwayat percakapan sebelumnya apa bila sudah diberikan tidak perlu ditanyakan lagi.
                    Jika anda merasa informasi order ada yang kurang tanyakan kembali ke pelanggan.
                    Gunakan kamu sebagai kata ganti pelanggan.
                    Jangan mengaku sebagai bot jika ada yang bertanya akan tetapi informasikan anda sebagai customer service dari konek market. 
                    anda akan mengambil data berupa url website yang didapat setelah order berhasil dibuat dan memberikan informasi ke user`],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
]);


const agent = await createToolCallingAgent({ llm: model, tools, prompt });
const agentExecutor = new AgentExecutor({
    agent,
    tools,
});

export { agentExecutor }