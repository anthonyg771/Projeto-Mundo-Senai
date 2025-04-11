const cenarios = [
  { texto: "Segunda, 18h. Céu nublado e úmido.", chanceReal: 70 },
  { texto: "Domingo, 15h. Solzão sem nuvem.", chanceReal: 10 },
  { texto: "Quarta, 7h. Céu encoberto, abafado.", chanceReal: 60 },
  { texto: "Sábado, 13h. Parcialmente nublado.", chanceReal: 30 },
  { texto: "Sexta, 21h. Vento e relâmpagos distantes.", chanceReal: 80 }
];

let jogador = "";
let pontuacao = 0;
let cenarioAtual = {};
let jogoAtivo = false;
let ranking = JSON.parse(localStorage.getItem("rankingChuva")) || [];

function iniciarJogo() {
  const nomeInput = document.getElementById("nomeInput").value.trim();
  if (!nomeInput) {
    alert("Digite um nome!");
    return;
  }
  if (ranking.find(j => j.nome.toLowerCase() === nomeInput.toLowerCase())) {
    alert("Esse nome já foi usado. Escolha outro!");
    return;
  }

  jogador = nomeInput;
  document.getElementById("jogadorNome").innerText = jogador;
  document.getElementById("login").style.display = "none";
  document.getElementById("jogo").style.display = "block";

  pontuacao = 0;
  jogoAtivo = true;
  atualizarPontuacao();
  carregarCenario();
  atualizarRankingUI();
}

function carregarCenario() {
  const aleatorio = Math.floor(Math.random() * cenarios.length);
  cenarioAtual = cenarios[aleatorio];
  document.getElementById("cenario").innerText = cenarioAtual.texto;
}

function verificarChute() {
  if (!jogoAtivo) return;

  const palpite = parseInt(document.getElementById("palpite").value);
  const chanceReal = cenarioAtual.chanceReal;

  if (isNaN(palpite) || palpite < 0 || palpite > 100) {
    document.getElementById("resultado").innerText = "Digite um número de 0 a 100.";
    return;
  }

  const margem = 10;
  const acertou = Math.abs(palpite - chanceReal) <= margem;

  if (acertou) {
    pontuacao += 10;
    atualizarPontuacao();
    document.getElementById("resultado").innerText = `✅ Boa! Chance real: ${chanceReal}%`;
    carregarCenario();
    document.getElementById("palpite").value = "";
    document.getElementById("btnProxima").style.display = "inline-block";  // Mostrar o botão de próxima pergunta
  } else {
    document.getElementById("resultado").innerText = `❌ Errou! Chance real era ${chanceReal}%. Fim de jogo.`;
    jogoAtivo = false;
    salvarPontuacao();
    atualizarRankingUI();
    document.getElementById("btnReiniciar").style.display = "inline-block";
  }
}

function atualizarPontuacao() {
  document.getElementById("pontuacao").innerText = pontuacao;
}

function salvarPontuacao() {
  ranking.push({ nome: jogador, pontos: pontuacao });
  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("rankingChuva", JSON.stringify(ranking));
}

function atualizarRankingUI() {
  const rankingEl = document.getElementById("ranking");
  rankingEl.innerHTML = "";
  
  ranking.slice(0, 10).forEach((entry, i) => {
    const item = `<li><strong>${i + 1}.</strong> ${entry.nome} — ${entry.pontos} pts</li>`;
    rankingEl.innerHTML += item;
  });
}

function reiniciarJogo() {
  location.reload();
}

function mostrarTodosJogadores() {
  alert("Jogadores que já participaram: " + ranking.map(entry => entry.nome).join(", "));
}

function resetarRanking() {
  const confirmacao = confirm("Tem certeza que deseja apagar todos os dados do ranking?");
  if (confirmacao) {
    localStorage.removeItem("rankingChuva");
    ranking = [];
    atualizarRankingUI();
    alert("Ranking apagado com sucesso!");
  }
}

function proximaPergunta() {
  carregarCenario();
  document.getElementById("btnProxima").style.display = "none";
}
