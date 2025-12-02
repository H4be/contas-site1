async function carregarClientes() {
    const res = await fetch("/clientes");
    const clientes = await res.json();

    const lista = document.getElementById("listaClientes");
    lista.innerHTML = "";

    clientes.forEach((c, i) => {
        const restante = c.valor_total - c.valor_pago;

        lista.innerHTML += `
            <div class="card">
                <b>${c.nome}</b><br>
                Vencimento: ${c.vencimento}<br>
                Total: R$ ${c.valor_total.toFixed(2)}<br>
                Pago: R$ ${c.valor_pago.toFixed(2)}<br>
                Restante: R$ ${restante.toFixed(2)}<br><br>

                <button onclick="pagar(${i})">Registrar Pagamento</button>
                <button class="remove" onclick="remover(${i})">Remover Cliente</button>
            </div>
        `;
    });
}

async function pagar(id) {
    const valor = Number(prompt("Valor a pagar:"));
    if (!valor) return;

    await fetch("/pagar/" + id, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ valor })
    });

    carregarClientes();
}

async function remover(id) {
    if (!confirm("Tem certeza que deseja remover?")) return;

    await fetch("/remover/" + id, { method: "DELETE" });
    carregarClientes();
}

document.getElementById("formCadastro").onsubmit = async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target));
    dados.valor_total = Number(dados.valor_total);

    await fetch("/cadastrar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
    });

    e.target.reset();
    carregarClientes();
};

carregarClientes();
