const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(".")); // serve frontend

const DB = "./contas.json";

// cria arquivo se não existir
if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");

function lerDB() {
    return JSON.parse(fs.readFileSync(DB));
}

function salvarDB(dados) {
    fs.writeFileSync(DB, JSON.stringify(dados, null, 2));
}

app.get("/clientes", (req, res) => {
    res.json(lerDB());
});

app.post("/cadastrar", (req, res) => {
    const db = lerDB();
    db.push({
        nome: req.body.nome,
        vencimento: req.body.vencimento,
        valor_total: req.body.valor_total,
        valor_pago: 0
    });
    salvarDB(db);
    res.json({ ok: true });
});

app.post("/pagar/:id", (req, res) => {
    const db = lerDB();
    const cli = db[req.params.id];

    cli.valor_pago += req.body.valor;
    if (cli.valor_pago > cli.valor_total) cli.valor_pago = cli.valor_total;

    salvarDB(db);
    res.json({ ok: true });
});

app.delete("/remover/:id", (req, res) => {
    const db = lerDB();
    db.splice(req.params.id, 1);
    salvarDB(db);
    res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
