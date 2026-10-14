
const alunos = [
  { nome: "Pedro",     notas: [1.3, 9.0, 8.0, 5.2] },
  { nome: "João",      notas: [3.0, 7.4, 4.0, 9.5] },
  { nome: "Carla",     notas: [6.9, 0.9, 5.3, 5.9] },
  { nome: "Ana",       notas: [0.5, 0.9, 7.7, 3.2] },
  { nome: "Lucas",     notas: [7.5, 8.0, 6.5, 9.0] },
  { nome: "Mariana",   notas: [9.0, 8.5, 9.5, 10.0] },
  { nome: "Rafael",    notas: [4.0, 5.5, 3.5, 6.0] },
  { nome: "Juliana",   notas: [6.0, 7.0, 6.5, 7.5] },
  { nome: "Fernando",  notas: [2.5, 3.0, 4.5, 3.5] },
  { nome: "Beatriz",   notas: [8.0, 7.5, 8.5, 9.0] },
  { nome: "Gabriel",   notas: [5.0, 4.5, 6.0, 5.5] },
  { nome: "Camila",    notas: [7.0, 6.5, 7.5, 8.0] },
  { nome: "Thiago",    notas: [3.5, 4.0, 2.5, 5.0] },
  { nome: "Larissa",   notas: [9.5, 9.0, 8.5, 9.5] },
  { nome: "Bruno",     notas: [6.5, 5.0, 7.0, 6.0] },
  { nome: "Patrícia",  notas: [1.5, 2.0, 3.0, 2.5] },
  { nome: "Rodrigo",   notas: [8.5, 7.0, 7.5, 8.0] },
  { nome: "Aline",     notas: [5.5, 6.0, 4.5, 7.0] },
  { nome: "Diego",     notas: [4.5, 3.5, 5.0, 4.0] },
  { nome: "Fernanda",  notas: [7.5, 8.5, 9.0, 8.0] },
  { nome: "Marcos",    notas: [0.0, 5.0, 6.5, 7.0] },
  { nome: "Vanessa",   notas: [6.0, 6.0, 6.0, 6.0] },
  { nome: "Eduardo",   notas: [3.0, 2.0, 4.0, 1.5] },
  { nome: "Tatiane",   notas: [8.0, 9.5, 7.0, 8.5] }
];

const MEDIA_MINIMA = 5.0;

// Calcula média e conceito de cada aluno
alunos.forEach(a => {
  const soma = a.notas.reduce((t, n) => t + n, 0);
  a.media = Math.round((soma / a.notas.length) * 10) / 10;
  a.conceito = a.media >= MEDIA_MINIMA ? "Aprovado" : "Reprovado";
});

// Formata número no padrão brasileiro (vírgula)
const fmt = n => n.toFixed(1).replace(".", ",");


$(function () {
  const linhas = alunos.map(a => [a.nome, ...a.notas, a.media, a.conceito]);

  // Coluna numérica: exibe com vírgula, ordena pelo número
  const colunaNota = {
    render: (valor, tipo) => tipo === "display" ? fmt(valor) : valor,
    className: "dt-center"
  };

  $("#tabela").DataTable({
    data: linhas,
    pageLength: 10,
    columnDefs: [
      { targets: [1, 2, 3, 4, 5], ...colunaNota },
      {
        targets: 6,
        className: "dt-center",
        render: (valor, tipo) =>
          tipo === "display"
            ? `<span class="${valor.toLowerCase()}">${valor}</span>`
            : valor
      }
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/pt-BR.json"
    }
  });
});


// 2.1 Barras: média de cada aluno
new Chart(document.getElementById("graficoBarras"), {
  type: "bar",
  data: {
    labels: alunos.map(a => a.nome),
    datasets: [{
      label: "Média",
      data: alunos.map(a => a.media),
      backgroundColor: alunos.map(a =>
        a.media >= MEDIA_MINIMA ? "rgba(46,160,67,.75)" : "rgba(220,53,69,.75)"
      )
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, max: 10 } },
    plugins: { legend: { display: false } }
  }
});

// 2.2 Linhas: notas por bimestre dos 4 primeiros alunos
const cores = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];

new Chart(document.getElementById("graficoLinhas"), {
  type: "line",
  data: {
    labels: ["1 Bim", "2 Bim", "3 Bim", "4 Bim"],
    datasets: alunos.slice(0, 4).map((a, i) => ({
      label: a.nome,
      data: a.notas,
      borderColor: cores[i],
      backgroundColor: cores[i],
      tension: 0.25
    }))
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, max: 10 } }
  }
});

// 2.3 Pizza: aprovados x reprovados
const qtdAprovados  = alunos.filter(a => a.conceito === "Aprovado").length;
const qtdReprovados = alunos.length - qtdAprovados;

new Chart(document.getElementById("graficoPizza"), {
  type: "pie",
  data: {
    labels: ["Aprovados", "Reprovados"],
    datasets: [{
      data: [qtdAprovados, qtdReprovados],
      backgroundColor: ["#2ea043", "#dc3545"]
    }]
  },
  options: { responsive: true, maintainAspectRatio: false }
});


const mapa = L.map("mapa").setView([-23.6677, -46.4613], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; Contribuidores do OpenStreetMap"
}).addTo(mapa);

// Pontos (coordenadas aproximadas - ajuste se necessário)
const pontos = [
  { nome: "Etec Mauá",                       lat: -23.6693, lng: -46.4586 },
  { nome: "Fatec Mauá",                      lat: -23.6585, lng: -46.4690 },
  { nome: "Prefeitura do Município de Mauá", lat: -23.6679, lng: -46.4611 }
];

pontos.forEach(p => {
  L.marker([p.lat, p.lng]).addTo(mapa).bindPopup(`<b>${p.nome}</b>`);
});

// Camada com os limites do município (malha do IBGE - código 3529401 = Mauá)
const urlLimite =
  "https://servicodados.ibge.gov.br/api/v3/malhas/municipios/3529401" +
  "?formato=application/vnd.geo+json&qualidade=intermediaria";

fetch(urlLimite)
  .then(r => r.json())
  .then(geojson => {
    const limite = L.geoJSON(geojson, {
      style: { color: "#d62728", weight: 3, fillColor: "#d62728", fillOpacity: 0.08 }
    }).addTo(mapa);
    limite.bindTooltip("Limite do município de Mauá");
    mapa.fitBounds(limite.getBounds());
  })
  .catch(erro => console.error("Erro ao carregar o limite do município:", erro));
