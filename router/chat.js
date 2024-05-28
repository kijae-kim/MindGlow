import express from 'express';
import * as authController from '../controller/auth.js';
import path, {dirname} from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/messages', async (req, res) => {
    res.sendFile(path.join(__dirname, "../project/3_채팅.html"))
});



export default router;