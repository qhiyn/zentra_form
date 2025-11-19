const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const RESP_FILE = path.join(__dirname, "responses.json");

// ensure responses.json exists
if (!fs.existsSync(RESP_FILE)) {
    fs.writeFileSync(RESP_FILE, "[]", "utf8");
}

// === QUESTIONS ===
const QUESTIONS = [
    {
        id: 1,
        text: "Seberapa sering kamu pakai Zentra?",
        options: ["Setiap hari", "Beberapa kali seminggu", "Seminggu sekali", "Jarang"]
    },
    {
        id: 2,
        text: "Bagian mana yang paling sering kamu gunakan di Zentra?",
        options: ["Catat pengeluaran", "Catat pemasukan", "Budgeting", "Laporan/grafik", "Tracking aset"]
    },
    {
        id: 3,
        text: "Seberapa mudah memakai Zentra?",
        options: ["Sangat mudah", "Cukup mudah", "Biasa aja", "Lumayan ribet", "Ribet banget"]
    },
    {
        id: 4,
        text: "Kamu merasa Zentra membantu mengatur keuangan kamu?",
        options: ["Sangat membantu", "Lumayan membantu", "Biasa aja", "Kurang membantu", "Tidak membantu"]
    },
    {
        id: 5,
        text: "Bagian mana dari Zentra yang menurutmu paling perlu ditingkatkan?",
        options: ["Tampilan (UI)", "Kecepatan/performansi", "Kategori pengeluaran", "Laporan & grafik", "Fitur aset", "Tidak ada yang perlu"]
    },
    {
        id: 6,
        text: "Apa fitur yang paling kamu inginkan berikutnya?",
        options: ["Auto-sync mutasi bank", "Reminder tagihan otomatis", "Export ke Excel", "Shared wallet", "Analisa AI (insight cashflow)", "Tidak butuh fitur tambahan"]
    },
    {
        id: 7,
        text: "Apakah kamu mengalami kendala saat menggunakan Zentra?",
        options: ["Tidak pernah", "Kadang ada bug kecil", "Sering error", "Fitur kurang sesuai kebutuhan"]
    },
    {
        id: 8,
        text: "Seberapa puas kamu dengan Zentra secara keseluruhan?",
        options: ["Sangat puas", "Puas", "Biasa saja", "Kurang puas", "Tidak puas"]
    },
    {
        id: 9,
        text: "Kamu masih mau lanjut pakai Zentra ke depannya?",
        options: ["Ya", "Mungkin", "Tidak"]
    },
    {
        id: 10,
        text: "Apakah kamu tertarik upgrade ke fitur premium kalau ada?",
        options: ["Ya", "Mungkin", "Tidak"]
    }
];

// === API ROUTES ===

// GET QUESTIONS
app.get("/api/questions", (req, res) => {
    res.json(QUESTIONS);
});

// SUBMIT ANSWERS
app.post("/api/submit", (req, res) => {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length !== QUESTIONS.length) {
        return res.status(400).json({ ok: false, error: "All questions required" });
    }

    // Validasi isi jawabannya
    for (let a of answers) {
        const q = QUESTIONS.find(q => q.id === a.id);
        if (!q) return res.status(400).json({ ok: false, error: "Invalid question id" });
        if (!q.options.includes(a.answer)) {
            return res.status(400).json({ ok: false, error: `Invalid answer for q${a.id}` });
        }
    }

    const existing = JSON.parse(fs.readFileSync(RESP_FILE, "utf8"));
    existing.push({
        id: existing.length + 1,
        answers,
        created_at: new Date().toISOString()
    });

    fs.writeFileSync(RESP_FILE, JSON.stringify(existing, null, 2));

    res.json({ ok: true });
});

// GET RESPONSES (dashboard)
app.get("/api/responses", (req, res) => {
    const data = JSON.parse(fs.readFileSync(RESP_FILE, "utf8"));
    res.json(data);
});

// DASHBOARD PAGE
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// ROOT redirect ke survey
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log("Server running on port " + PORT));
