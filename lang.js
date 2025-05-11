
// Traduções
const traducoes = {
  pt: {
    voltar: "← Voltar ao mapa",
    descricao: "Descrição",
    proximo: "Próximo",
    anterior: "Anterior",
    ver_mais: "Ver mais",
    nao_disponivel: "Descrição não disponível."
  },
  en: {
    voltar: "← Back to map",
    descricao: "Description",
    proximo: "Next",
    anterior: "Previous",
    ver_mais: "See more",
    nao_disponivel: "Description not available."
  },
  fr: {
    voltar: "← Retour à la carte",
    descricao: "Description",
    proximo: "Suivant",
    anterior: "Précédent",
    ver_mais: "Voir plus",
    nao_disponivel: "Description non disponible."
  },
  de: {
    voltar: "← Zurück zur Karte",
    descricao: "Beschreibung",
    proximo: "Weiter",
    anterior: "Zurück",
    ver_mais: "Mehr anzeigen",
    nao_disponivel: "Beschreibung nicht verfügbar."
  },
  es: {
    voltar: "← Volver al mapa",
    descricao: "Descripción",
    proximo: "Siguiente",
    anterior: "Anterior",
    ver_mais: "Ver más",
    nao_disponivel: "Descripción no disponible."
  }
};

// Idioma atual
const idiomasSuportados = ["pt", "en", "fr", "de", "es"];
let lang = localStorage.getItem("lang") || navigator.language.slice(0, 2);
if (!idiomasSuportados.includes(lang)) lang = "pt";

// Aplica textos traduzidos nos botões (se existirem)
function aplicarTraducoes() {
  const anterior = document.getElementById("txtAnterior");
  const proximo = document.getElementById("txtProximo");

  if (anterior) anterior.textContent = traducoes[lang].anterior;
  if (proximo) proximo.textContent = traducoes[lang].proximo;
}

// Executa assim que o ficheiro for carregado
document.addEventListener("DOMContentLoaded", aplicarTraducoes);
