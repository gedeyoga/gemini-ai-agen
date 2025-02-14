
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
             kamu adalah ai assistant dengan pengetahuan ketat terbatas, semua pengetahuan tentan produk dapat diakses menggunakan tools list_product_digital. 
             Kamu menyimpulkan respon berdasarkan query berikut "${content}"
             gunakan data berikut jika seorang user melakukan order paket :
             - nomor telepon ${session_id}
             
             jika seorang user membahas atau bertanya diluar konteks konek market maka kamu dapat merespon penolakan dan hanya mengetahui tentang konek market saja.
             jika seorang user bertanya tentang produk yang tidak ada pada tools list_product_digital maka respon dengan penolakan dan berikan saran paket yang tersedia di konek market menggunakan tools list_product_digital.
            `;

        const response = await agen.invoke({ 
            chat_history: chat_history,
            input: prompt,
        });

        let output = removeTrailingNewlines(response.output);

        await mysql.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'assistant', '"+output+"');");

        return response;
    } catch (error) {

        console.log(error);
        throw new Error(error);
    }
}

export { askAgen };