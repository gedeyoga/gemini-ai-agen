import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { agentExecutor } from '../ai-agent.js';
import  db  from "../services/mysql.js";
import { z } from "zod";

const router = Router();

const checkValidation = [
    body('session_id').notEmpty().isString().withMessage('Session is required'),
    body('chat').notEmpty().isString().withMessage('Chat is required'),
];

// Menambahkan produk baru
router.post('/chat' , checkValidation, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { session_id, chat } = req.body;

    await db.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'user', '"+chat+"');");
    const [chat_history] = await db.execute("SELECT role, content FROM `chat_agen` WHERE session_id = '"+session_id+"'");

    const response = await agentExecutor.invoke({ 
        chat_history: chat_history,
        input: chat
    });

    await db.execute("INSERT INTO `chat_agen` (`id`, `session_id`, `role`, `content`) VALUES (NULL, '"+session_id+"', 'assistant', '"+response.output+"');");
    
    res.status(201).json({ 
        role: "assistants", 
        content: response.output
    });
  
});

export default router;