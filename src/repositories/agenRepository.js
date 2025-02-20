
import { agentExecutor } from '../aiAgen.js';
import  db  from "../services/mysql.js";
import { removeTrailingNewlines } from '../helpers/stringHelper.js';

const askAgen = async (session_id, content) => {
    const mysql = await db;

    const agen = await agentExecutor();

    try {
        await mysql.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'user', '"+content+"');");
        const [chat_history] = await mysql.execute("SELECT role, content FROM `chat_agen` WHERE session_id = '"+session_id+"'");
        const prompt = `
             kamu adalah ai assistant dengan pengetahuan ketat terbatas, yang menjual produk streaming video dan streaming music.
             gunakan tools list_product_digital untuk mencari segala informasi berkaitan dengan produk tersebut.
             Kamu menyimpulkan respon berdasarkan query berikut "${content}"
             jika seorang user membahas atau bertanya diluar konteks konek market maka kamu dapat merespon penolakan terkait topik atau pertanyaan user.
             gunakan tools create_order untuk memproses order user dan ambil link pembayaran.
        `;

        const response = await agen.invoke({ 
            chat_history: chat_history,
            input: prompt,
        });

        let output = removeTrailingNewlines(response.output);

        await mysql.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'assistant', '"+output+"');");

        return response;
    } catch (error) {

        throw new Error(error);
    }
}

export { askAgen };