let jogarNovamente = true;
let tentativas = 6;
let listaDinamica = [];
let palavraSecretaCategoria;
let palavraSecretaSorteada;
let palavras = [];
let jogoAutomatico = true;

// Aguarda o HTML carregar completamente antes de iniciar a lógica do jogo
document.addEventListener("DOMContentLoaded", function () {
  carregaListaAutomatica();
  criarPalavraSecreta();
  montarPalavraNaTela();

  // Configura os botões que precisam de eventos após o DOM carregar
  let bntReiniciar = document.querySelector("#btnReiniciar");
  if (bntReiniciar) {
    bntReiniciar.addEventListener("click", function () {
      jogarNovamente = false;
      location.reload();
    });
  }

  const modal = document.getElementById("modal-alerta");
  const btnAbreModal = document.getElementById("abreModalAddPalavra");
  if (btnAbreModal && modal) {
    btnAbreModal.onclick = function () {
      modal.style.display = "block";
    };
  }

  const btnFechaModal = document.getElementById("fechaModal");
  if (btnFechaModal && modal) {
    btnFechaModal.onclick = function () {
      modal.style.display = "none";
      document.getElementById("addPalavra").value = "";
      document.getElementById("addCategoria").value = "";
    };
  }

  window.onclick = function (event) {
    if (modal && event.target == modal) {
      modal.style.display = "none";
      document.getElementById("addPalavra").value = "";
      document.getElementById("addCategoria").value = "";
    }
  };

  // ✅ Trata o evento de ocultar o modal ANTES do Bootstrap injetar 'aria-hidden'
  if (typeof $ !== "undefined") {
    $("#myModal").on("hide.bs.modal", function () {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }
});

function criarPalavraSecreta() {
  const indexPalavra = parseInt(Math.random() * palavras.length);

  palavraSecretaSorteada = palavras[indexPalavra].nome;
  palavraSecretaCategoria = palavras[indexPalavra].categoria;
}

function montarPalavraNaTela() {
  const categoria = document.getElementById("categoria");
  const palavraTela = document.getElementById("palavra-secreta");

  // Proteção para evitar erro de propriedade 'null' caso as divs não existam
  if (!categoria || !palavraTela) return;

  categoria.innerHTML = palavraSecretaCategoria;
  palavraTela.innerHTML = "";

  for (let i = 0; i < palavraSecretaSorteada.length; i++) {
    if (listaDinamica[i] == undefined) {
      if (palavraSecretaSorteada[i] == " ") {
        listaDinamica[i] = " ";
        palavraTela.innerHTML =
          palavraTela.innerHTML +
          "<div class='letrasEspaco'>" +
          listaDinamica[i] +
          "</div>";
      } else {
        listaDinamica[i] = "&nbsp;";
        palavraTela.innerHTML =
          palavraTela.innerHTML +
          "<div class='letras'>" +
          listaDinamica[i] +
          "</div>";
      }
    } else {
      if (palavraSecretaSorteada[i] == " ") {
        listaDinamica[i] = " ";
        palavraTela.innerHTML =
          palavraTela.innerHTML +
          "<div class='letrasEspaco'>" +
          listaDinamica[i] +
          "</div>";
      } else {
        palavraTela.innerHTML =
          palavraTela.innerHTML +
          "<div class='letras'>" +
          listaDinamica[i] +
          "</div>";
      }
    }
  }
}

function verificaLetraEscolhida(letra) {
  const teclaBtn = document.getElementById("tecla-" + letra);
  if (teclaBtn) teclaBtn.disabled = true;

  if (tentativas > 0) {
    mudarStyleLetra("tecla-" + letra, false);
    comparalistas(letra);
    montarPalavraNaTela();
  }
}

function mudarStyleLetra(tecla, condicao) {
  const el = document.getElementById(tecla);
  if (!el) return;

  if (condicao == false) {
    el.style.background = "#C71585";
    el.style.color = "#ffffff";
  } else {
    el.style.background = "#008000";
    el.style.color = "#ffffff";
  }
}

function comparalistas(letra) {
  const pos = palavraSecretaSorteada.indexOf(letra);
  if (pos < 0) {
    tentativas--;
    carregaImagemForca();

    if (tentativas == 0) {
      abreModal(
        "OPS!",
        "Não foi dessa vez ... A palavra secreta era <br>" +
          palavraSecretaSorteada,
      );
      piscarBotaoJogarNovamente(true);
    }
  } else {
    mudarStyleLetra("tecla-" + letra, true);
    for (let i = 0; i < palavraSecretaSorteada.length; i++) {
      if (palavraSecretaSorteada[i] == letra) {
        listaDinamica[i] = letra;
      }
    }
  }

  let vitoria = true;
  for (let i = 0; i < palavraSecretaSorteada.length; i++) {
    if (palavraSecretaSorteada[i] != listaDinamica[i]) {
      vitoria = false;
    }
  }

  if (vitoria == true) {
    abreModal("PARABÉNS!", "Você venceu...");
    tentativas = 0;
    piscarBotaoJogarNovamente(true);
  }
}

function carregaImagemForca() {
  const imgElement = document.getElementById("imagem");
  if (!imgElement) return;

  switch (tentativas) {
    case 5:
      imgElement.style.background = "url('./img/forca01.png')";
      break;
    case 4:
      imgElement.style.background = "url('./img/forca02.png')";
      break;
    case 3:
      imgElement.style.background = "url('./img/forca03.png')";
      break;
    case 2:
      imgElement.style.background = "url('./img/forca04.png')";
      break;
    case 1:
      imgElement.style.background = "url('./img/forca05.png')";
      break;
    case 0:
      imgElement.style.background = "url('./img/forca06.png')";
      break;
    default:
      imgElement.style.background = "url('./img/forca.png')";
      break;
  }
}

function abreModal(titulo, mensagem) {
  let modalTitulo = document.getElementById("exampleModalLabel");
  if (modalTitulo) modalTitulo.innerText = titulo;

  let modalBody = document.getElementById("modalBody");
  if (modalBody) modalBody.innerHTML = mensagem;

  if (typeof $ !== "undefined") {
    $("#myModal").modal({
      show: true,
    });
  }
}

function listaAutomatica() {
  if (jogoAutomatico == true) {
    document.getElementById("jogarAutomatico").innerHTML =
      "<i class='bx bx-play-circle'></i>";
    palavras = [];
    jogoAutomatico = false;

    document.getElementById("abreModalAddPalavra").style.display = "block";
    document.getElementById("status").innerHTML = "Modo Manual";
  } else if (jogoAutomatico == false) {
    document.getElementById("jogarAutomatico").innerHTML =
      "<i class='bx bx-pause-circle'></i>";
    jogoAutomatico = true;

    document.getElementById("abreModalAddPalavra").style.display = "none";
    document.getElementById("status").innerHTML = "Modo Automático";
  }
}

function carregaListaAutomatica() {
  palavras = [
    { nome: "IRLANDA", categoria: "LUGARES" },
    { nome: "EQUADOR", categoria: "LUGARES" },
    { nome: "CHILE", categoria: "LUGARES" },
    { nome: "INDONESIA", categoria: "LUGARES" },
    { nome: "MALDIVAS", categoria: "LUGARES" },
    { nome: "INGLATERRA", categoria: "LUGARES" },
    { nome: "GROELANDIA", categoria: "LUGARES" },
    { nome: "UZBEQUISTAO", categoria: "LUGARES" },
    { nome: "CREGUENHEM", categoria: "LUGARES" },
    { nome: "BICICLETA", categoria: "TRANSPORTE" },
    { nome: "LANCHA", categoria: "TRANSPORTE" },
    { nome: "NAVIO", categoria: "TRANSPORTE" },
    { nome: "TELEFERICO", categoria: "TRANSPORTE" },
    { nome: "MOTOCICLETA", categoria: "TRANSPORTE" },
    { nome: "BARCO", categoria: "TRANSPORTE" },
    { nome: "AERONAVE", categoria: "TRANSPORTE" },
    { nome: "TREM", categoria: "TRANSPORTE" },
    { nome: "CAIAQUE", categoria: "TRANSPORTE" },
    { nome: "CARRO", categoria: "TRANSPORTE" },
    { nome: "XICARA", categoria: "OBJETOS" },
    { nome: "MOEDA", categoria: "OBJETOS" },
    { nome: "ESPARADRAPO", categoria: "OBJETOS" },
    { nome: "SINO", categoria: "OBJETOS" },
    { nome: "CHUVEIRO", categoria: "OBJETOS" },
    { nome: "TAMBORETE", categoria: "OBJETOS" },
    { nome: "LAMPADA", categoria: "OBJETOS" },
    { nome: "BOCAL", categoria: "OBJETOS" },
    { nome: "CORTINA", categoria: "OBJETOS" },
    { nome: "LAPIS", categoria: "OBJETOS" },
    { nome: "MELANCIA", categoria: "ALIMENTOS" },
    { nome: "AMENDOIM", categoria: "ALIMENTOS" },
    { nome: "ESFIRRA", categoria: "ALIMENTOS" },
    { nome: "GOIABA", categoria: "ALIMENTOS" },
    { nome: "JACA", categoria: "ALIMENTOS" },
    { nome: "SORVETE", categoria: "ALIMENTOS" },
    { nome: "DAMASCO", categoria: "ALIMENTOS" },
    { nome: "MANTEIGA", categoria: "ALIMENTOS" },
    { nome: "PIZZA", categoria: "ALIMENTOS" },
    { nome: "DOCE", categoria: "ALIMENTOS" },
    { nome: "ABELHA", categoria: "ANIMAIS" },
    { nome: "GALINHA", categoria: "ANIMAIS" },
    { nome: "PACA", categoria: "ANIMAIS" },
    { nome: "CAMELO", categoria: "ANIMAIS" },
    { nome: "PERU", categoria: "ANIMAIS" },
    { nome: "ZEBRA", categoria: "ANIMAIS" },
    { nome: "LEOA", categoria: "ANIMAIS" },
    { nome: "CALANGO", categoria: "ANIMAIS" },
    { nome: "SAGUI", categoria: "ANIMAIS" },
    { nome: "LAGARTIXA", categoria: "ANIMAIS" },
    { nome: "ELEFANTE", categoria: "ANIMAIS" },
    { nome: "A ERA DO GELO", categoria: "TV E CINEMA" },
    { nome: "HOMEM ARANHA", categoria: "TV E CINEMA" },
    { nome: "CASA MONSTRO", categoria: "TV E CINEMA" },
    { nome: "TELA QUENTE", categoria: "TV E CINEMA" },
    { nome: "SHURATO", categoria: "TV E CINEMA" },
    { nome: "O REI DO GADO", categoria: "TV E CINEMA" },
    { nome: "MULHER MARAVILHA", categoria: "TV E CINEMA" },
    { nome: "O INCRIVEL HULK", categoria: "TV E CINEMA" },
    { nome: "BOB ESPONJA", categoria: "TV E CINEMA" },
    { nome: "HE MAN", categoria: "TV E CINEMA" },
  ];
}

function adicionarPalavra() {
  let addPalavra = document.getElementById("addPalavra").value.toUpperCase();
  let addCategoria = document
    .getElementById("addCategoria")
    .value.toUpperCase();

  if (
    isNullOrWhiteSpace(addPalavra) ||
    isNullOrWhiteSpace(addCategoria) ||
    addPalavra.length < 3 ||
    addCategoria.length < 3
  ) {
    abreModal("ATENÇÃO", " Palavra e/ou Categoria inválidos");
    return;
  }

  let palavra = {
    nome: addPalavra,
    categoria: addCategoria,
  };

  palavras.push(palavra);
  sortear();

  document.getElementById("addPalavra").value = "";
  document.getElementById("addCategoria").value = "";
}

function isNullOrWhiteSpace(input) {
  return !input || !input.trim();
}

function sortear() {
  if (jogoAutomatico == true) {
    location.reload();
  } else {
    if (palavras.length > 0) {
      listaDinamica = [];
      criarPalavraSecreta();
      montarPalavraNaTela();
      resetaTeclas();
      tentativas = 6;
      carregaImagemForca();
      piscarBotaoJogarNovamente(false);
    }
  }
}

function resetaTeclas() {
  let teclas = document.querySelectorAll(".teclas > button");
  teclas.forEach((x) => {
    x.style.background = "#FFFFFF";
    x.style.color = "#8B008B";
    x.disabled = false;
  });
}

function piscarBotaoJogarNovamente(querJogar) {
  const btn = document.getElementById("jogarNovamente");
  if (btn) {
    if (querJogar) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }
}
