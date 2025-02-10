
import { agentExecutor } from '../aiAgen.js';
import  db  from "../services/mysql.js";
import { removeTrailingNewlines } from '../helpers/stringHelper.js';

const askAgen = async (session_id, content) => {
    const mysql = await db;
    const agen = await agentExecutor();

    try {
        await mysql.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'user', '"+content+"');");
        const [chat_history] = await mysql.execute("SELECT role, content FROM `chat_agen` WHERE session_id = '"+session_id+"'");

        const response = await agen.invoke({ 
            chat_history: chat_history,
            input: content
        });

        let output = removeTrailingNewlines(response.output);

        await mysql.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'assistant', '"+output+"');");

        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export { askAgen };