import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { agentExecutor } from '../aiAgen.js';
import  db  from "../services/mysql.js";

const router = Router();

const checkValidation = [
    body('session_id').notEmpty().isString().withMessage('Session is required'),
    body('chat').notEmpty().isString().withMessage('Chat is required'),
];

// Menambahkan produk baru
router.post('/chat' , checkValidation, async (req, res) => {

    const errors = validationResult(req);
    const mysql = await db;
    const agen = await agentExecutor();

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { session_id, chat } = req.body;
    let output = null;

    
    mysql.connect();

    try {
        await mysql.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'user', '"+chat+"');");
        const [chat_history] = await mysql.execute("SELECT role, content FROM `chat_agen` WHERE session_id = '"+session_id+"'");
        

        const response = await agen.invoke({ 
            chat_history: chat_history,
            input: chat
        });

        await mysql.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'assistant', '"+response.output+"');");

        output = response.output;
    } catch (error) {
        mysql.end();
        console.log(error);
    }
    
    res.status(201).json({ 
        role: "assistant", 
        content: output
    });
  
});

export default router;