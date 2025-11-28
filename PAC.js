//PONTOS POR DIFICULDADE
const pontosPorDificuldade = {
    facil: 50,
    medio: 200,
    dificil: 500
};

// MANTER MISSÕES NO SITE
let missoes = JSON.parse(localStorage.getItem("missoes")) || [];

//BOTÕES E ELEMENTOS
const objetivo = document.getElementById("objetivo");
const dificuldade = document.getElementById("dificuldade");
const dataLimite = document.getElementById("dataLimite");
const jogador = document.getElementById("jogador");
const criar = document.getElementById("criarmissao");

const filtro = document.getElementById("filtro");
const listaMissoes = document.getElementById("listaMissoes");
const listaRanking = document.getElementById("listaRanking");

//SALVAR MISSÕEs
function salvar() {
    localStorage.setItem("missoes", JSON.stringify(missoes));
}

//CRIAR MISSÃO
criar.addEventListener("click", () => {
    if (!objetivo.value || !jogador.value) {
        alert("Preencha o objetivo e o jogador!");
        return;
    }

    const missao = {
        id: Date.now(),
        objetivo: objetivo.value,
        dificuldade: dificuldade.value,
        data: dataLimite.value,
        jogador: jogador.value,
        pontos: pontosPorDificuldade[dificuldade.value],
        concluida: false
    };

    missoes.push(missao);
    salvar();
    renderizarMissoes();
    renderizarRanking();

    objetivo.value = "";
    jogador.value = "";
    dataLimite.value = "";
});

// MARCAR COMO CONCLUÍDA 
function concluirMissao(id) {
    const m = missoes.find(m => m.id === id);
    m.concluida = true;
    salvar();
    renderizarMissoes();
    renderizarRanking();
}

//REMOVER MISSÃO 
function removerMissao(id) {
    missoes = missoes.filter(m => m.id !== id);
    salvar();
    renderizarMissoes();
    renderizarRanking();
}

// FILTRO DE MISSÕES
filtro.addEventListener("change", renderizarMissoes);

// lISTA DE MISSÕES
function renderizarMissoes() {
    listaMissoes.innerHTML = "";

    const dificuldadeFiltro = filtro.value;

    missoes
        .filter(m => dificuldadeFiltro === "todas" || m.dificuldade === dificuldadeFiltro)
        .forEach(m => {
            const div = document.createElement("div");
            div.style.border = "1px solid #aaa";
            div.style.padding = "10px";
            div.style.margin = "5px";
            div.style.width = "90%";
            div.style.borderRadius = "5px";
            div.style.background = m.concluida ? "#ccffcc" : "#fff";

            div.innerHTML = `
                <strong>${m.objetivo}</strong><br>
                Jogador: ${m.jogador}<br>
                Dificuldade: ${m.dificuldade} (${m.pontos} XP)<br>
                Limite: ${m.data ? m.data : "Sem data"}<br>
                Status: <strong>${m.concluida ? "Concluída" : "Pendente"}</strong><br><br>
                ${m.concluida ? "" : `<button onclick="concluirMissao(${m.id})">Concluir</button>`}
                <button onclick="removerMissao(${m.id})" style="background: red; color: white;">Excluir</button>
            `;

            listaMissoes.appendChild(div);
        });
}

//RANKING
function renderizarRanking() {
    const ranking = {};

    missoes
        .filter(m => m.concluida)
        .forEach(m => {
            ranking[m.jogador] = (ranking[m.jogador] || 0) + m.pontos;
        });

    const ordenado = Object.entries(ranking)
        .sort((a, b) => b[1] - a[1]);

    listaRanking.innerHTML = "";

    ordenado.forEach(([jogador, pontos]) => {
        const li = document.createElement("li");
        li.textContent = `${jogador} — ${pontos} XP`;
        listaRanking.appendChild(li);
    });

    if (ordenado.length === 0) {
        listaRanking.innerHTML = "<li>Nenhuma missão concluída ainda.</li>";
    }
}

//INICIALIZAÇÕA
renderizarMissoes();
renderizarRanking();
