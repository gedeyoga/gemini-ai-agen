import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { askAgen } from '../repositories/agenRepository';
import { sendWhatsapp } from '../services/fonnteClient';

const router = Router();

const checkValidation = [
    body('session_id').notEmpty().isString().withMessage('Session is required'),
    body('chat').notEmpty().isString().withMessage('Chat is required'),
];

const checkValidationFonnte = [
    body('sender').notEmpty().isString().withMessage('Sender is required'),
    body('message').notEmpty().isString().withMessage('Message is required'),
];

router.post('/webhook-fonnte' , checkValidationFonnte, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { sender, message } = req.body; 

    //create agen
    const response = await askAgen(sender, message);

    //Balas pesan user
    const responseNotif = await sendWhatsapp(sender, response.output);

    console.log('Fonnte :' , responseNotif.data);



    res.status(201).json({ 
        role: "assistant", 
        content: response.output
    });
  
}); 

// Menambahkan produk baru
router.post('/chat' , checkValidation, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { session_id, chat } = req.body;
    const response = await askAgen(session_id, chat);
    
    res.status(201).json({ 
        role: "assistant", 
        content: response.output
    });
  
});

export default router;