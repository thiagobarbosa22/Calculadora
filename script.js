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

// Dicionário de preços da nova campanha Relâmpago
const ofertasRelampago = {
    "200": { desc_50: 45.00, desc_30: 62.99, flat: 44.99, esp_1a7: 29.90, esp_50: 45.00, esp_30: 62.99 },
    "400": { desc_50: 47.50, desc_30: 66.49, flat: 49.99, esp_1a7: 29.90, esp_50: 47.50, esp_30: 66.49 },
    "600": { desc_50: 49.99, desc_30: 69.99, flat: 59.90, esp_1a7: 34.99, esp_50: 50.00, esp_30: 69.99 },
    "600hbo": { desc_50: 67.99, desc_30: 94.49, flat: 75.99, esp_1a7: 49.90, esp_50: 67.50, esp_30: 94.49 },
    "1000": { desc_50: 59.99, desc_30: 97.99, flat: 69.99, esp_1a7: 49.99, esp_50: 69.99, esp_30: 97.99 }
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

function toggleRelampago() {
    var isRel = document.getElementById('velocidadeRelampago').value !== "none";
    document.getElementById('tipoRelampago').disabled = !isRel;
    document.getElementById('vA').disabled = isRel;
    document.getElementById('vD').disabled = isRel;
    document.getElementById('prazo').disabled = isRel;
    document.getElementById('isencao').disabled = isRel;
    document.getElementById('abord').disabled = isRel;
    
    var padraoSec = document.getElementById('regrasPadrao');
    padraoSec.style.opacity = isRel ? '0.4' : '1';
    padraoSec.style.pointerEvents = isRel ? 'none' : 'auto';
}

function gerarOferta() {
    var nome = document.getElementById('n').value || "Cliente";
    var vRel = document.getElementById('velocidadeRelampago').value;
    
    var totalSva = 0;
    var svasSelecionados = [];
    
    document.querySelectorAll('.sva-chk:checked').forEach(function(chk) {
        var valorSvaLimpo = parseFloat(chk.value.replace(',', '.'));
        totalSva += valorSvaLimpo;
        svasSelecionados.push(chk.getAttribute('data-nome'));
    });

    var msg = "";

    // Lógica Exclusiva: Oferta Relâmpago
    if (vRel !== "none") {
        var tRel = document.getElementById('tipoRelampago').value;
        var planoNome = document.querySelector('#velocidadeRelampago option:checked').text.split(' (')[0];
        var dados = ofertasRelampago[vRel];
        
        var txtAps = totalSva > 0 ? ` (com o ${svasSelecionados.join(", ")} já incluso)` : "";
        var textoPrimeirosMesesGratis = totalSva > 0
            ? `pagará apenas ${f(totalSva)} nos 3 primeiros meses pelo(s) aplicativo(s)`
            : `terá a mensalidade TOTALMENTE GRÁTIS nos 3 primeiros meses`;

        if (tRel === "gratis_50_30") {
            msg = `Olá, ${nome}! Consegui uma condição relâmpago imperdível para o plano de ${planoNome}${txtAps}. Você ${textoPrimeirosMesesGratis}! Do 4º ao 9º mês, o pacote fica por ${f(dados.desc_50 + totalSva)} e do 10º ao 12º mês, ${f(dados.desc_30 + totalSva)}. O que acha?`;
        } else if (tRel === "gratis_flat") {
            msg = `Olá, ${nome}! Consegui uma condição relâmpago imperdível para o plano de ${planoNome}${txtAps}. Você ${textoPrimeirosMesesGratis}! E do 4º ao 12º mês, o valor fica fixado em apenas ${f(dados.flat + totalSva)}. O que acha de aproveitarmos?`;
        } else if (tRel === "999_50_30") {
            msg = `Olá, ${nome}! Consegui uma condição especial para o plano de ${planoNome}${txtAps}. Nos 3 primeiros meses você paga apenas ${f(9.99 + totalSva)}! Do 4º ao 9º mês, o valor vai para ${f(dados.desc_50 + totalSva)} e do 10º ao 12º mês fica em ${f(dados.desc_30 + totalSva)}. Podemos atualizar?`;
        } else if (tRel === "999_flat") {
            msg = `Olá, ${nome}! Consegui uma condição especial para o plano de ${planoNome}${txtAps}. Nos 3 primeiros meses você paga apenas ${f(9.99 + totalSva)}! E do 4º ao 12º mês, o valor fica congelado em apenas ${f(dados.flat + totalSva)}. Podemos fechar?`;
        } else if (tRel === "especial") {
            msg = `Olá, ${nome}! Liberei a Oferta Especial Retenção para o plano de ${planoNome}${txtAps}. Do 1º ao 7º mês você pagará somente ${f(dados.esp_1a7 + totalSva)}! No 8º e 9º mês fica ${f(dados.esp_50 + totalSva)}, e do 10º ao 12º mês, ${f(dados.esp_30 + totalSva)}. Ficou ótimo, né?`;
        }
    } else {
        // Lógica Tradicional (Retenção Padrão)
        var vAt = Number(document.getElementById('vA').value);
        var desc = Number(document.getElementById('vD').value);
        var meses = Number(document.getElementById('prazo').value);
        var ab = document.getElementById('abord').value;
        var isencao = document.getElementById('isencao').value;

        var planoComDesconto = vAt - desc;
        var novo = planoComDesconto + totalSva;

        var txtIsencao = "";
        if (isencao === "1") txtIsencao = " com mais 1 mês grátis";
        if (isencao === "2") txtIsencao = " com mais 2 meses grátis";

        if (totalSva > 0) {
            var svasTexto = svasSelecionados.join(", ");
            if (ab === "1") {
                msg = "Olá, " + nome + "! Consegui uma condição super bacana para você: reduzi seu plano para " + f(planoComDesconto) + " e ainda incluí o aplicativo " + svasTexto + " (que custa " + f(totalSva) + ") como um mimo. Tudo vai ficar por apenas " + f(novo) + " fixo por " + meses + " meses" + txtIsencao + ". O que achou?";
            } else if (ab === "2") {
                msg = "Oi, " + nome + "! Como você é um cliente muito especial para nós, preparamos algo para te agradar: seu plano cai para " + f(planoComDesconto) + " e adicionamos o " + svasTexto + " por " + f(totalSva) + " como um bônus. No fim, fica tudo por apenas " + f(novo) + " durante " + meses + " meses" + txtIsencao + ". Vamos continuar essa parceria?";
            } else if (ab === "3") {
                msg = "Preparei algo bem exclusivo para você hoje, " + nome + ": seu plano atualizado fica por " + f(planoComDesconto) + ", e você ainda leva o aplicativo " + svasTexto + " por " + f(totalSva) + " de bônus da nossa parte. No total, fica só " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Posso atualizar aqui para você?";
            } else if (ab === "4") {
                msg = "Olha, " + nome + ", para resolvermos isso agora e você sair ganhando: ajustei seu plano para " + f(planoComDesconto) + " e incluí o " + svasTexto + " por " + f(totalSva) + ", fechando o valor final em só " + f(novo) + " fixo por " + meses + " meses" + txtIsencao + ". Fica bom assim para você?";
            } else if (ab === "5") {
                msg = nome + ", pensando no que fica melhor para o seu bolso e para o seu dia a dia, consegui este pacote: " + f(planoComDesconto) + " do plano + " + f(totalSva) + " pelo " + svasTexto + ". O valor total fica em " + f(novo) + " por " + meses + " meses" + txtIsencao + ", entregando muito mais por menos. Podemos fechar?";
            } else if (ab === "6") {
                msg = "Olha, " + nome + ", fiz tudo o que estava ao meu alcance para te ajudar aqui: consegui o plano por " + f(planoComDesconto) + " e o " + svasTexto + " por " + f(totalSva) + " como uma oferta máxima. O valor final fechado fica em " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Conseguimos seguir juntos com essa proposta?";
            } else if (ab === "7") {
                msg = "Poxa, " + nome + ", entendo perfeitamente a sua frustração com o que aconteceu. Para resolver isso de vez, o técnico já está agendado e, como um pedido de desculpas pelo transtorno, mudei seu plano para " + f(planoComDesconto) + " com o " + svasTexto + " incluso por " + f(totalSva) + ", dando um total de " + f(novo) + " por " + meses + " meses. Tudo bem por você?";
            } else if (ab === "8") {
                msg = "Sinto muito mesmo por essa instabilidade na sua conexão, " + nome + ". Já acionei nossa equipe de suporte emergencial para priorizar seu caso e, para compensar esse incômodo, fixei seu plano em " + f(planoComDesconto) + " e adicionei o " + svasTexto + " por " + f(totalSva) + ", totalizando apenas " + f(novo) + " por " + meses + " meses. Ficaria mais tranquilo para você continuarmos assim?";
            }
        } else {
            if (ab === "1") {
                msg = "Olá, " + nome + "! Consegui uma ótima notícia para você: reduzi o valor do seu plano para apenas " + f(novo) + " fixo por " + meses + " meses" + txtIsencao + ". O que acha de aproveitarmos essa redução?";
            } else if (ab === "2") {
                msg = "Oi, " + nome + "! A gente valoriza muito o tempo que você está com a gente. Por isso, conseguimos reajustar seu plano para apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Vamos continuar essa parceria?";
            } else if (ab === "3") {
                msg = "Preparei uma condição especial só para você, " + nome + ": atualizei o valor do seu plano para apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Fica melhor assim para você? Posso confirmar no sistema?";
            } else if (ab === "4") {
                msg = "Para solucionarmos isso da melhor forma para você agora, " + nome + ": reduzi sua mensalidade para apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Posso aplicar esse desconto na sua tela?";
            } else if (ab === "5") {
                msg = nome + ", buscando a alternativa mais econômica para você, consegui deixar seu plano por apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Fica um valor super justo para você continuar navegando tranquilo. Podemos fechar?";
            } else if (ab === "6") {
                msg = "Olha, " + nome + ", fiz o máximo que o sistema me permite para te ajudar hoje: o valor final do seu plano ficou em apenas " + f(novo) + " por " + meses + " meses" + txtIsencao + ". Com essa condição, conseguimos seguir juntos?";
            } else if (ab === "7") {
                msg = "Eu entendo perfeitamente a sua situação, " + nome + ", e sei o quanto é ruim passar por isso. O técnico já está agendado para resolver o problema e, para amenizar esse transtorno, dei um desconto na sua mensalidade, ficando por " + f(novo) + " por " + meses + " meses. Posso confirmar?";
            } else if (ab === "8") {
                msg = "Peço sinceras desculpas por essa oscilação na sua internet, " + nome + ". Sei que você precisa da conexão, por isso já chamei o suporte emergencial para corrigir o sinal e, pelo incômodo, reduzi seu plano para " + f(novo) + " por " + meses + " meses. Tudo bem se seguirmos assim?";
            }
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
    var cidInput = (document.getElementById('eCid').value || "").trim();
    var regional = "-";
    var subterritorio = "-";
    
    if (cidInput) {
        var cidLower = cidInput.toLowerCase();
        var encontrado = false;
        for (var reg in dadosRegionais) {
            for (var sub in dadosRegionais[reg]) {
                if (dadosRegionais[reg][sub].some(c => c.toLowerCase() === cidLower)) {
                    regional = reg;
                    subterritorio = sub;
                    encontrado = true;
                    break;
                }
            }
            if (encontrado) break;
        }
    }

    var txt = "SA: " + document.getElementById('eSA').value + 
              "\nRegional: " + regional + " | Sub: " + subterritorio + 
              "\nCidade: " + cidInput + 
              "\nData: " + document.getElementById('eData').value + " (" + document.getElementById('ePer').value + ")" + 
              "\nRestrição: " + document.getElementById('eRest').value + 
              "\nMotivo: " + document.getElementById('eRecl').value;

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
