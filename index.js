import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const upload = multer(); // Menangani upload file

// Inisialisasi API dengan Key dari .env
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Menggunakan model Gemini 2.5 Flash
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

// 1. ENDPOINT TEKS
app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;
    try {
        const result = await ai.getGenerativeModel({ model: GEMINI_MODEL }).generateContent(prompt);
        res.json({ output: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 2. ENDPOINT GAMBAR (Key: "image")
app.post('/generate-from-image', upload.single("image"), async (req, res) => {
    try {
        const { prompt } = req.body;
        const base64Image = req.file.buffer.toString("base64");
        
        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
        const result = await model.generateContent([
            prompt || "Jelaskan gambar ini",
            { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
        ]);

        res.json({ output: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 3. ENDPOINT DOKUMEN/PDF (Key: "document")
app.post('/generate-from-document', upload.single("document"), async (req, res) => {
    try {
        const { prompt } = req.body;
        const base64Doc = req.file.buffer.toString("base64");

        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
        const result = await model.generateContent([
            prompt || "Buat ringkasan dari dokumen ini",
            { inlineData: { data: base64Doc, mimeType: req.file.mimetype } }
        ]);

        res.json({ output: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 4. ENDPOINT AUDIO (Key: "audio")
app.post('/generate-from-audio', upload.single("audio"), async (req, res) => {
    try {
        const { prompt } = req.body;
        const base64Audio = req.file.buffer.toString("base64");

        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
        const result = await model.generateContent([
            prompt || "Buatkan transkrip dari rekaman ini",
            { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
        ]);

        res.json({ output: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Menjalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));