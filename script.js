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

function tab(t) {
    document.getElementById('v-ret').classList.toggle('hide', t !== 'ret');
    document.getElementById('v-calc').classList.toggle('hide', t !== 'calc');
    document.getElementById('v-enc').classList.toggle('hide', t !== 'enc');
    document.getElementById('t1').classList.toggle('active', t === 'ret');
    document.getElementById('t2').classList.toggle('active', t === 'calc');
    document.getElementById('t3').classList.toggle('active', t === 'enc');
}

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

function f(v) { return "R$ " + Number(v).toFixed(2).replace('.', ','); }

// Motor de geração de scripts com separação de desconto apenas no Plano
function gerarOferta() {
    var nome = document.getElementById('n').value || "Cliente";
    var vAt = Number(document.getElementById('vA').value);
    var desc = Number(document.getElementById('vD').value);
    var meses = Number(document.getElementById('prazo').value);
    var ab = document.getElementById('abord').value;
    var isencao = document.getElementById('isencao').value;

    var totalSva = 0;
    var svasSelecionados = [];
    
    // Processamento e soma dos SVAs
    document.querySelectorAll('.sva-chk:checked').forEach(function(chk) {
        var valorSvaLimpo = parseFloat(chk.value.replace(',', '.'));
        totalSva += valorSvaLimpo;
        svasSelecionados.push(chk.getAttribute('data-nome'));
    });

    // Desconto aplicado EXCLUSIVAMENTE sobre o valor plano base
    var planoComDesconto = vAt - desc;
    var novo = planoComDesconto + totalSva;

    var txtIsencao = "";
    if (isencao === "1") txtIsencao = " com mais 1 mês grátis";
    if (isencao === "2") txtIsencao = " com mais 2 meses grátis";

    var msg = "";
    
    // Condicional: Se houver SVA ativo, apresenta a quebra (Plano com desconto + SVA como oferta)
    if (totalSva > 0) {
        var svasTexto = svasSelecionados.join(", ");
        if (ab === "1") {
            msg = "Olá, " + nome + "! Reduzi seu plano para " + f(planoComDesconto) + " e incluí o aplicativo " + svasTexto + " por " + f(totalSva) + " como uma oferta especial, ficando tudo por apenas " + f(novo) + " fixo por " + meses + " meses" + txtIsencao + ". Podemos fechar?";
        } else if (ab === "2") {
            msg = "Oi, " + nome + "! Conseguimos deixar seu plano por " + f(planoComDesconto) + " e adicionamos o aplicativo " + svasTexto + " por " + f(totalSva) + " como um benefício, totalizando apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + " valorizando seu tempo com a gente. Vamos continuar juntos?";
        } else if (ab === "3") {
            msg = "Oferta exclusiva para você, " + nome + ": seu plano fica por " + f(planoComDesconto) + " + o aplicativo " + svasTexto + " por " + f(totalSva) + " como cortesia, fechando tudo por apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Posso salvar no cadastro?";
        } else if (ab === "4") {
            msg = "Para fecharmos agora, " + nome + ": baixei seu plano para " + f(planoComDesconto) + " e adicionei o aplicativo " + svasTexto + " por " + f(totalSva) + ", dando apenas " + f(novo) + " fixo por " + meses + " meses" + txtIsencao + ". Posso aplicar?";
        } else if (ab === "5") {
            msg = nome + ", o melhor custo-benefício ficou assim: " + f(planoComDesconto) + " do plano + " + f(totalSva) + " do aplicativo " + svasTexto + " como oferta, totalizando " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Vale muito mais a pena manter. Vamos fechar?";
        } else if (ab === "6") {
            msg = "Olha, " + nome + ", cheguei no limite: o plano fica por " + f(planoComDesconto) + " e o aplicativo " + svasTexto + " por " + f(totalSva) + " como oferta especial, dando o valor final de " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Garante a sua continuidade?";
        } else if (ab === "7") {
            msg = "Entendo o ocorrido, " + nome + ". Já agendei o técnico e, pelo transtorno, deixei seu plano por " + f(planoComDesconto) + " com o aplicativo " + svasTexto + " por " + f(totalSva) + " como oferta incluso, totalizando " + f(novo) + " por " + meses + " meses. Confirmado?";
        } else if (ab === "8") {
            msg = "Desculpe pela instabilidade, " + nome + ". Acionei o suporte emergencial e fixei seu plano em " + f(planoComDesconto) + " + " + f(totalSva) + " do aplicativo " + svasTexto + " como benefício, totalizando " + f(novo) + " por " + meses + " meses. Podemos seguir?";
        }
    } else {
        // Fluxo padrão sem nenhum SVA selecionado
        if (ab === "1") {
            msg = "Olá, " + nome + "! Reduzi seu plano para apenas " + f(novo) + " fixo por " + meses + " meses" + txtIsencao + ". Podemos fechar?";
        } else if (ab === "2") {
            msg = "Oi, " + nome + "! Conseguimos manter seu plano por apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + " valorizando seu tempo com a gente. Vamos continuar juntos?";
        } else if (ab === "3") {
            msg = "Oferta exclusiva para você, " + nome + ": seu plano foi atualizado para " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Posso salvar no cadastro?";
        } else if (ab === "4") {
            msg = "Para fecharmos agora, " + nome + ": reduzi sua mensalidade para apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Posso aplicar o desconto?";
        } else if (ab === "5") {
            msg = nome + ", seu melhor custo-benefício ficou assim: " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Vale muito mais a pena manter. Vamos fechar?";
        } else if (ab === "6") {
            msg = "Olha, " + nome + ", cheguei no limite do sistema: o valor final fica em " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Garante a sua continuidade?";
        } else if (ab === "7") {
            msg = "Entendo o ocorrido, " + nome + ". Já agendei o técnico e, pelo transtorno, reduzi sua fatura para " + f(novo) + " por " + meses + " meses. Confirmado?";
        } else if (ab === "8") {
            msg = "Desculpe pela instabilidade, " + nome + ". Acionei o suporte emergencial e reduzi seu plano para " + f(novo) + " por " + meses + " meses. Podemos seguir?";
        }
    }

    var res = document.getElementById('resO');
    res.innerHTML = '<i>"' + msg + '"</i>';
    res.style.display = "block";
    document.getElementById('cO').classList.remove('hide');
    window.lastMsg = msg;
}

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
    if (multaTotal > 0) componentes.push("multa contratual (" + mR + " meses restantes)");
    if (prop > 0) componentes.push("proporcional de uso");
    if (atrasos > 0) componentes.push("faturas em aberto");

    var explicacao = componentes.length > 0 ? " (referente a " + componentes.join(", ").replace(/, ([^,]*)$/, ' e $1') + ")" : "";
    var scriptFinal = "Olha " + nome + ", se cancelarmos hoje o valor total para encerramento é de " + f(total) + explicacao + ".";

    document.getElementById('resC').innerHTML = 
        '<b>Detalhamento:</b><br>' +
        'Meses Restantes: ' + mR + ' meses<br>' +
        (multaTotal > 0 ? 'Multas: ' + f(multaTotal) + '<br>' : '') +
        (prop > 0 ? 'Proporcional: ' + f(prop) + '<br>' : '') +
        (atrasos > 0 ? 'Atrasos: ' + f(atrasos) + '<br>' : '') +
        '<hr><i>"' + scriptFinal + '"</i>';

    document.getElementById('resC').style.display = "block";
    document.getElementById('cC').classList.remove('hide');
    window.lastC = scriptFinal;
}

function gerarEnc() {
    var txt = "SA: " + document.getElementById('eSA').value + "\nCidade: " + document.getElementById('eCid').value + "\nData: " + document.getElementById('eData').value + " (" + document.getElementById('ePer').value + ")\nRestrição: " + document.getElementById('eRest').value + "\nMotivo: " + document.getElementById('eRecl').value;
    document.getElementById('resE').innerText = txt;
    document.getElementById('resE').style.display = "block";
    document.getElementById('cE').classList.remove('hide');
    window.lastEnc = txt;
}

function copy(t) {
    var texto = (t === 'o' ? window.lastMsg : (t === 'c' ? window.lastC : window.lastEnc));
    navigator.clipboard.writeText(texto);
    alert("Copiado com sucesso!");
}

window.toggleIA = function () {
    const win = document.getElementById('ia-window');
    win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
};

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

document.getElementById('ia-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') window.askGemini();
});
