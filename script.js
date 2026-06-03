// Banco de dados geográfico das regionais Desktop
var dadosRegionais = { 
    "Central": { 
        "SUMARÉ": ["Aguaí", "Americana", "Araras", "Artur Nogueira", "Casa Branca", "Conchal", "Cordeirópolis", "Cosmópolis", "Engenheiro Coelho", "Estiva Gerbi", "Iracemápolis", "Leme", "Limeira", "Mogi Guaçu", "Mogi Mirim", "Nova Odessa", "Paulínia", "Piracicaba", "Pirassununga", "Porto Ferreira", "Rio Claro", "Santa Bárbara DOeste", "Santa Cruz das Palmeiras", "Santa Gertrudes", "Santa Rita do Passa Quatro", "Sumaré"], 
        "SOROCABA": ["Alumínio", "Angatuba", "Aracoiaba da Serra", "Bofete", "Boituva", "Campina do Monte Alegre", "Capela do Alto", "Capivari", "Cerquilho", "Cesario Lange", "Conchas", "Ipero", "Itapetininga", "Itu", "Jumirim", "Laranjal Paulista", "Monte Mor", "Pereiras", "Pilar do Sul", "Porangaba", "Quadra", "RAFARD", "Rio das Pedras", "Saltinho", "Salto", "Salto de Pirapora", "Sarapui", "Sorocaba", "Tatui", "Tiete", "Votorantim"], 
        "CAMPINAS": ["Amparo", "Campinas", "Holambra", "Hortolândia", "Jaguariúna", "Lindoia", "Monte Alegre do Sul", "Pedreira", "Santo Antônio de Posse", "Serra Negra"] 
    }, 
    "Centro Oeste": { 
        "ARARAQUARA": ["Americo Brasiliense", "Araraquara", "Boa Esperança do Sul", "Bocaina", "Borborema", "Cravinhos", "Descalvado", "Dobrada", "Dourado", "Gaviao Peixoto", "Guariba", "Guatapará", "Ibate", "Ibitinga", "Itaju", "Itápolis", "Matao", "Motuca", "Nova Europa", "Ribeirão Bonito", "Ribeirão Preto", "Rincao", "Santa Ernestina", "Santa Lucia", "Sao Carlos", "Tabatinga", "Trabiju"], 
        "BARRETOS": ["Bady Bassitt", "Barretos", "Bebedouro", "Cândido Rodrigues", "Colina", "Cristais Paulista", "Fernando Prestes", "Franca", "Guaíra", "Itajobi", "Itirapua", "Jaborandi", "Jaboticabal", "Mirassol", "Monte Alto", "Olímpia", "Patrocinio Paulista", "Pindorama", "Pitangueiras", "Ribeirao Corrente", "Santa Adélia", "São José do Rio Preto"], 
        "LENÇÓIS PAULISTA": ["Águas de Santa Bárbara", "Agudos", "Arandu", "Arealva", "Areiópolis", "Avare", "Avaré", "Bariri", "Barra Bonita", "Bauru", "Borebi", "Botucatu", "Cerqueira César", "Dois Córregos", "Iaras", "Igaraçu do Tietê", "Itaí", "Itapuí", "Itatinga", "Jau", "Jaú", "Lençóis Paulista", "Lins", "Macatuba", "Manduri", "Mineiros do Tietê", "Novo Horizonte", "Óleo", "Paranapanema", "Pardinho", "Pederneiras", "Piratininga", "Pratânia", "São Manuel"] 
    }, 
    "Sudeste": { 
        "JUNDIAÍ": ["Araçariguama", "Atibaia", "Bom Jesus dos Perdões", "Bragança Paulista", "Cabreúva", "Caieiras", "Campo Limpo Paulista", "Francisco Morato", "Franco da Rocha", "Indaiatuba", "Itupeva", "Jarinu", "Jundiaí", "Louveira", "Mairiporã", "Nazaré Paulista", "Piracaia", "Valinhos", "Várzea Paulista", "Vinhedo"], 
        "PRAIA GRANDE": ["Cubatão", "Guarujá", "Itanhaém", "Mongaguá", "Peruíbe", "Praia Grande", "Santos", "São Bernardo do Campo", "São Vicente"], 
        "SÃO JOSE DOS CAMPOS": ["Biritiba Mirim", "Caçapava", "Guararema", "Igaratá", "Jacareí", "Mogi das Cruzes", "Salesópolis", "Santa Branca", "São José dos Campos", "São Paulo", "Taubaté", "Tremembé"] 
    } 
};

// Alimenta o datalist com todas as cidades mapeadas
window.onload = function() {
    var datalist = document.getElementById('cidades_geral');
    var options = '';
    for (var reg in dadosRegionais) {
        for (var sub in dadosRegionais[reg]) {
            dadosRegionais[reg][sub].forEach(function(cid) {
                options += '<option value="' + cid + '">';
            });
        }
    }
    datalist.innerHTML = options;
};

// Alternância entre abas da ferramenta
function tab(t) {
    document.getElementById('v-ret').classList.toggle('hide', t !== 'ret');
    document.getElementById('v-calc').classList.toggle('hide', t !== 'calc');
    document.getElementById('v-enc').classList.toggle('hide', t !== 'enc');
    document.getElementById('t1').classList.toggle('active', t === 'ret');
    document.getElementById('t2').classList.toggle('active', t === 'calc');
    document.getElementById('t3').classList.toggle('active', t === 'enc');
}

// Libera desconto de 60 se pertencer à regional Central
function checkCid() {
    var cidDigitada = document.getElementById('cid').value.trim();
    var opt60 = document.getElementById('o60');
    var alerta = document.getElementById('conconrrencia');
    var eCentral = false;

    for (var sub in dadosRegionais["Central"]) {
        if (dadosRegionais["Central"][sub].some(c => c.toLowerCase() === cidDigitada.toLowerCase())) {
            eCentral = true;
            break;
        }
    }

    if (eCentral) {
        opt60.disabled = false;
        alerta.style.display = 'block';
    } else {
        opt60.disabled = true;
        if (document.getElementById('vD').value === "60") {
            document.getElementById('vD').value = "50";
        }
        alerta.style.display = 'none';
    }
}

// Formatação monetária PT-BR
function f(v) { return "R$ " + Number(v).toFixed(2).replace('.', ','); }

// Motor de geração de scripts de retenção reduzidos com SVAs dinâmicos
function gerarOferta() {
    var nome = document.getElementById('n').value || "Cliente";
    var vAt = Number(document.getElementById('vA').value);
    var desc = Number(document.getElementById('vD').value);
    var meses = Number(document.getElementById('prazo').value);
    var ab = document.getElementById('abord').value;
    var isencao = document.getElementById('isencao').value;

    var totalSva = 0;
    var svasSelecionados = [];
    document.querySelectorAll('.sva-chk:checked').forEach(function(chk) {
        totalSva += Number(chk.value);
        svasSelecionados.push(chk.getAttribute('data-nome'));
    });

    var novo = (vAt - desc) + totalSva;
    var econo = desc * meses;

    var txtIsencao = "";
    if (isencao === "1") txtIsencao = " + 1 mês grátis.";
    if (isencao === "2") txtIsencao = " + 2 meses grátis.";

    var txtSva = "";
    if (svasSelecionados.length > 0) {
        txtSva = " c/ " + svasSelecionados.join(", ");
    }

    var msg = "";
    if (ab === "1") {
        msg = "Olá, " + nome + "! Reduzi seu plano para " + f(novo) + " por " + meses + " meses" + txtSva + "." + txtIsencao + " Economia de " + f(econo) + ". Podemos fechar?";
    } else if (ab === "2") {
        msg = nome + ", valorizamos sua parceria. Liberamos um desconto fixo e seu plano fica apenas " + f(novo) + " por " + meses + " meses" + txtSva + "." + txtIsencao + " Vamos continuar juntos?";
    } else if (ab === "3") {
        msg = "Oferta VIP para você, " + nome + ": plano fixado em " + f(novo) + " por " + meses + " meses" + txtSva + "." + txtIsencao + " Atualizamos seu cadastro?";
    } else if (ab === "4") {
        msg = nome + ", para fecharmos agora: reduzi sua mensalidade para " + f(novo) + " por " + meses + " meses" + txtSva + "." + txtIsencao + " Posso lançar o desconto na próxima fatura?";
    } else if (ab === "5") {
        msg = nome + ", o custo-benefício ficou excelente: " + f(novo) + " durante " + meses + " meses" + txtSva + "." + txtIsencao + " Bem melhor que a dor de cabeça de trocar de operadora. Vamos manter?";
    } else if (ab === "6") {
        msg = "Olha, " + nome + ", cheguei no limite do sistema: o valor final fica em " + f(novo) + " por " + meses + " meses" + txtSva + "." + txtIsencao + " Aceita essa condição para continuar conosco?";
    } else if (ab === "7") {
        msg = "Entendo a instabilidade, " + nome + ". Agendei um técnico especializado e, pelo transtorno, reduzi sua fatura para " + f(novo) + " por " + meses + " meses" + txtSva + "." + txtIsencao + " Confirmado?";
    } else if (ab === "8") {
        msg = "Desculpe pelo período sem conexão, " + nome + ". Já acionei a equipe técnica emergencial e reduzi sua mensalidade para " + f(novo) + " por " + meses + " meses" + txtSva + "." + txtIsencao + " Podemos seguir?";
    }

    var res = document.getElementById('resO');
    res.innerHTML = '<i>"' + msg + '"</i>';
    res.style.display = "block";
    document.getElementById('cO').classList.remove('hide');
    window.lastMsg = msg;
}

// Cálculo tradicional de multas com meses restantes visíveis
function calc() {
    var nome = document.getElementById('n').value || "cliente";
    var mR = Number(document.getElementById('mR').value);
    var plano = Number(document.getElementById('vA').value);
    var dias = Number(document.getElementById('dC').value);
    var atrasos = Number(document.getElementById('vAtra').value);
    var fInstal = document.getElementById('fielInstal').value === 'sim';
    var valorBaseMulta = Number(document.getElementById('tabelaMulta').value);

    var multaTotal = fInstal ? (mR * valorBaseMulta) : 0;
    var prop = (plano / 30) * dias;
    var total = multaTotal + prop + atrasos;

    var componentes = [];
    if (multaTotal > 0) componentes.push("multa contratual (" + mR + " meses)");
    if (prop > 0) componentes.push("proporcional de uso");
    if (atrasos > 0) componentes.push("faturas em aberto");

    var explicacao = componentes.length > 0 ? " (referente a " + componentes.join(", ").replace(/, ([^,]*)$/, ' e $1') + ")" : "";
    var scriptFinal = "Olha " + nome + ", se cancelarmos hoje o valor total para encerramento é de " + f(total) + explicacao + ".";

    document.getElementById('resC').innerHTML = 
        '<b>Detalhamento:</b><br>' +
        (multaTotal > 0 ? 'Multa Fidelidade: ' + f(multaTotal) + '<br>' : '') +
        (prop > 0 ? 'Proporcional: ' + f(prop) + '<br>' : '') +
        (atrasos > 0 ? 'Atrasos: ' + f(atrasos) + '<br>' : '') +
        '<hr><i>"' + scriptFinal + '"</i>';

    document.getElementById('resC').style.display = "block";
    document.getElementById('cC').classList.remove('hide');
    window.lastC = scriptFinal;
}

// Geração do espelho de encaixe de visita técnica
function gerarEnc() {
    var txt = "SA: " + document.getElementById('eSA').value + "\nCidade: " + document.getElementById('eCid').value + "\nData: " + document.getElementById('eData').value + " (" + document.getElementById('ePer').value + ")\nRestrição: " + document.getElementById('eRest').value + "\nMotivo: " + document.getElementById('eRecl').value;
    document.getElementById('resE').innerText = txt;
    document.getElementById('resE').style.display = "block";
    document.getElementById('cE').classList.remove('hide');
    window.lastEnc = txt;
}

// Manipulação do Clipboard para cópia rápida
function copy(t) {
    var texto = (t === 'o' ? window.lastMsg : (t === 'c' ? window.lastC : window.lastEnc));
    navigator.clipboard.writeText(texto);
    alert("Copiado com sucesso!");
}

// Controle de Visibilidade da Janela do Assistente Dolly
window.toggleIA = function () {
    const win = document.getElementById('ia-window');
    win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
};

// Requisição e envio de mensagens para o endpoint do Render da IA
window.askGemini = async function () {
    const input = document.getElementById('ia-input');
    const chat = document.getElementById('ia-chat');
    const msg = input.value.trim();
    if (!msg) return;

    chat.innerHTML += `<div class="ia-msg ia-user">${msg}</div>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    try {
        const response = await fetch("https://calculadora-xggm.onrender.com/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ msg })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${data.error || "Falha no backend"}`);
        }

        const text = data.text || "Sem resposta da IA.";
        chat.innerHTML += `<div class="ia-msg ia-bot">${text.replace(/\n/g, "<br>")}</div>`;
    } catch (e) {
        chat.innerHTML += `<div class="ia-msg ia-error"><b>⚠️ Falha na IA:</b><br>${e.message}</div>`;
        console.error("Erro técnico encontrado:", e);
    }

    chat.scrollTop = chat.scrollHeight;
};

// Monitora pressionamento da tecla Enter no input da IA
document.getElementById('ia-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') window.askGemini();
});
