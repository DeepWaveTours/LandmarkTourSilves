let mapa;
let marcadores = [];
let infoWindows = [];
let locais = [];
let indiceAtual = 0;


function mudarIdioma(novoIdioma) {
  localStorage.setItem("lang", novoIdioma);
  location.reload(); // recarrega a página com a nova língua
}

function gerarIcone(numero, corFundo = "#e68a00", corTexto = "#ffffff", raio = 16) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${raio * 2}" height="${raio * 2}">
      <circle cx="${raio}" cy="${raio}" r="${raio}" fill="${corFundo}" />
      <text x="50%" y="55%" text-anchor="middle" font-size="14" font-weight="bold" fill="${corTexto}" font-family="Arial" dy=".3em">${numero}</text>
    </svg>
  `;
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(raio * 2, raio * 2),
    labelOrigin: new google.maps.Point(raio, raio / 1.5)
  };
}

async function initMap() {
  mapa = new google.maps.Map(document.getElementById("map"), {
    mapTypeId: 'satellite'
  });

  // Torna visível o mapa só depois de carregado
    document.getElementById("map-container").style.visibility = "visible";

    const idiomasSuportados = ["pt", "en", "fr", "de", "es"];
    let lang = localStorage.getItem("lang") || navigator.language.slice(0, 2);
    if (!idiomasSuportados.includes(lang)) lang = "pt";

    document.getElementById("lang-select").value = lang;

    try {
    const resposta = await fetch('dados/pontos.json');
    locais = await resposta.json();

    const lista = document.getElementById("lista-pontos");
    const bounds = new google.maps.LatLngBounds();

    locais.forEach((local, i) => {
      // Adiciona item à lista lateral
      const item = document.createElement("li");
      item.innerHTML = `
  <span class="circulo-numero" data-index="${i}">${i + 1}</span>
  ${local.nome}
  `;

      item.addEventListener("click", () => {
        focarNoLocal(i);
        indiceAtual = i;
      });
      lista.appendChild(item);

      // Marcador
      const pos = { lat: local.latitude, lng: local.longitude };
      const marcador = new google.maps.Marker({
        position: pos,
        map: mapa,
        icon: gerarIcone(i + 1),
        title: local.nome
      });

      bounds.extend(pos);

      // InfoWindow
      let conteudo = `
    <div style="position: relative;">
    <a href="local.html?id=${i}" style="
      position: absolute;
      top: 0;
      right: 12px;
      background: #4B0082;
      color: white;
      padding: 4px 8px;
      text-decoration: none;
      border-radius: 4px;
      font-size: 13px;
    ">Ver mais</a>
    <h3>${local.nome}</h3>
    <p>${local.descricao[lang] || local.descricao["pt"]}</p>
    </div>
  `;
      

      if (local.imagem) {
        conteudo += `<img src="${local.imagem}" style="max-width:100%;margin-top:5px;">`;
      }
      if (local.video) {
        conteudo += `<div style="margin-top:5px;"><iframe width="100%" height="200" src="${local.video}" frameborder="0" allowfullscreen></iframe></div>`;
      }
      if (local.audio) {
        conteudo += `<audio controls style="width:100%;margin-top:5px;"><source src="${local.audio}" type="audio/mpeg">O teu navegador não suporta áudio.</audio>`;
      }

      const info = new google.maps.InfoWindow({ content: conteudo });

      marcador.addListener("click", () => {
        fecharInfoWindows();
        info.open(mapa, marcador);
        atualizarIcones(i);
        indiceAtual = i;
      });

      marcadores.push(marcador);
      infoWindows.push(info);
    });

    // Ajustar o mapa para mostrar todos os pontos
    google.maps.event.addListenerOnce(mapa, 'idle', () => {
      mapa.fitBounds(bounds);

      // Aguarda 300ms antes de focar o primeiro ponto
      // setTimeout(() => {
        // focarNoLocal(indiceAtual);
      // }, 300);
    });

    // Botões
    document.getElementById("btnAnterior").addEventListener("click", () => {
      if (indiceAtual > 0) {
        indiceAtual--;
        focarNoLocal(indiceAtual);
      }
    });

    document.getElementById("btnProximo").addEventListener("click", () => {
      if (indiceAtual < locais.length - 1) {
        indiceAtual++;
        focarNoLocal(indiceAtual);
      }
    });

  } catch (erro) {
    console.error("Erro a carregar os dados:", erro);
  }
}

function fecharInfoWindows() {
  infoWindows.forEach(info => info.close());
}

function atualizarIcones(indiceAtivo) {
  marcadores.forEach((m, i) => {
    const cor = i === indiceAtivo ? "#4B0082" : "#e68a00";
    m.setIcon(gerarIcone(i + 1, cor));
  });
}

function destacarItemLista(indiceAtivo) {
  const itens = document.querySelectorAll("#lista-pontos li");
  itens.forEach((li, i) => {
    if (i === indiceAtivo) {
      li.classList.add("item-ativo");
    } else {
      li.classList.remove("item-ativo");
    }
  });
}


function focarNoLocal(indice) {
  fecharInfoWindows();
  atualizarIcones(indice);
  destacarItemLista(indice); // <--- chamada aqui!

  const local = locais[indice];
  const marcador = marcadores[indice];
  
  mapa.panTo({ lat: local.latitude, lng: local.longitude });
  mapa.setZoom(17);
  infoWindows[indice].open(mapa, marcador);
}

window.initMap = initMap;