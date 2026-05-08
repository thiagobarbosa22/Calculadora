var dadosRegionais = { "Central": { "SUMARÉ": ["Aguaí", "Americana", "Araras", "Artur Nogueira", "Casa Branca", "Conchal", "Cordeirópolis", "Cosmópolis", "Engenheiro Coelho", "Estiva Gerbi", "Iracemápolis", "Leme", "Limeira", "Mogi Guaçu", "Mogi Mirim", "Nova Odessa", "Paulínia", "Piracicaba", "Pirassununga", "Porto Ferreira", "Rio Claro", "Santa Bárbara DOeste", "Santa Cruz das Palmeiras", "Santa Gertrudes", "Santa Rita do Passa Quatro", "Sumaré"], "SOROCABA": ["Alumínio", "Angatuba", "Aracoiaba da Serra", "Bofete", "Boituva", "Campina do Monte Alegre", "Capela do Alto", "Capivari", "Cerquilho", "Cesario Lange", "Conchas", "Ipero", "Itapetininga", "Itu", "Jumirim", "Laranjal Paulista", "Monte Mor", "Pereiras", "Pilar do Sul", "Porangaba", "Quadra", "RAFARD", "Rio das Pedras", "Saltinho", "Salto", "Salto de Pirapora", "Sarapui", "Sorocaba", "Tatui", "Tiete", "Votorantim"], "CAMPINAS": ["Amparo", "Campinas", "Holambra", "Hortolândia", "Jaguariúna", "Lindoia", "Monte Alegre do Sul", "Pedreira", "Santo Antônio de Posse", "Serra Negra"] }, "Centro Oeste": { "ARARAQUARA": ["Americo Brasiliense", "Araraquara", "Boa Esperança do Sul", "Bocaina", "Borborema", "Cravinhos", "Descalvado", "Dobrada", "Dourado", "Gaviao Peixoto", "Guariba", "Guatapará", "Ibate", "Ibitinga", "Itaju", "Itápolis", "Matao", "Motuca", "Nova Europa", "Ribeirão Bonito", "Ribeirão Preto", "Rincao", "Santa Ernestina", "Santa Lucia", "Sao Carlos", "Tabatinga", "Trabiju"], "BARRETOS": ["Bady Bassitt", "Barretos", "Bebedouro", "Cândido Rodrigues", "Colina", "Cristais Paulista", "Fernando Prestes", "Franca", "Guaíra", "Itajobi", "Itirapua", "Jaborandi", "Jaboticabal", "Mirassol", "Monte Alto", "Olímpia", "Patrocinio Paulista", "Pindorama", "Pitangueiras", "Ribeirao Corrente", "Santa Adélia", "São José do Rio Preto"], "LENÇÓIS PAULISTA": ["Águas de Santa Bárbara", "Agudos", "Arandu", "Arealva", "Areiópolis", "Avare", "Avaré", "Bariri", "Barra Bonita", "Bauru", "Borebi", "Botucatu", "Cerqueira César", "Dois Córregos", "Iaras", "Igaraçu do Tietê", "Itaí", "Itapuí", "Itatinga", "Jau", "Jaú", "Lençóis Paulista", "Lins", "Macatuba", "Manduri", "Mineiros do Tietê", "Novo Horizonte", "Óleo", "Paranapanema", "Pardinho", "Pederneiras", "Piratininga", "Pratânia", "São Manuel"] }, "Sudeste": { "JUNDIAÍ": ["Araçariguama", "Atibaia", "Bom Jesus dos Perdões", "Bragança Paulista", "Cabreúva", "Caieiras", "Campo Limpo Paulista", "Francisco Morato", "Franco da Rocha", "Indaiatuba", "Itupeva", "Jarinu", "Jundiaí", "Louveira", "Mairiporã", "Nazaré Paulista", "Piracaia", "Valinhos", "Várzea Paulista", "Vinhedo"], "PRAIA GRANDE": ["Cubatão", "Guarujá", "Itanhaém", "Mongaguá", "Peruíbe", "Praia Grande", "Santos", "São Bernardo do Campo", "São Vicente"], "SÃO JOSE DOS CAMPOS": ["Biritiba Mirim", "Caçapava", "Guararema", "Igaratá", "Jacareí", "Mogi das Cruzes", "Salesópolis", "Santa Branca", "São José dos Campos", "São Paulo", "Taubaté", "Tremembé"] } };
var mapCidadesInfo = {};

window.onload = function() {
    var datalistEnc = document.getElementById('listaCidadesEnc');
    var selOferta = document.getElementById('cid');
    var todasCidades = [];
    mapCidadesInfo = {};
    for (var reg in dadosRegionais) {
        for (var sub in dadosRegionais[reg]) {
            dadosRegionais[reg][sub].forEach(function(cid) {
                mapCidadesInfo[cid.toUpperCase()] = { regional: reg, subterritorio: sub };
                todasCidades.push(cid);
            });
        }
    }
    todasCidades.sort(function(a, b) { return a.localeCompare(b, 'pt-BR'); });
    var optsEnc = '';
    todasCidades.forEach(function(cid) {
        optsEnc += '<option value="' + cid.replace(/"/g, '&quot;') + '">';
    });
    datalistEnc.innerHTML = optsEnc;
    var htmlSel = '<option value="">— Selecione a cidade —</option>';
    todasCidades.forEach(function(cid) {
        var esc = cid.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        htmlSel += '<option value="' + esc + '">' + esc + '</option>';
    });
    selOferta.innerHTML = htmlSel;
    checkCid();
};

function tab(t) {
    document.getElementById('v-ret').classList.toggle('hide', t!=='ret');
    document.getElementById('v-calc').classList.toggle('hide', t!=='calc');
    document.getElementById('v-enc').classList.toggle('hide', t!=='enc');
    document.getElementById('t1').classList.toggle('active', t==='ret');
    document.getElementById('t2').classList.toggle('active', t==='calc');
    document.getElementById('t3').classList.toggle('active', t==='enc');
}

function checkCid() {
    var box = document.getElementById('concorrencia');
    var raw = (document.getElementById('cid').value || '').trim();
    var key = raw.toUpperCase();
    var info = mapCidadesInfo[key];
    var isCentral = !!(info && info.regional === 'Central');

    var o50 = document.getElementById('o50');
    var o60 = document.getElementById('o60');
    var sel = document.getElementById('vD');

    o50.disabled = false;

    if (info) {
        o60.disabled = !isCentral;
    } else {
        o60.disabled = true;
    }

    if (o60.disabled && sel.value === '60') {
        sel.value = '50';
    }

    if (info) {
        box.style.display = 'block';
        if (isCentral) {
            box.innerHTML = '🚀 <b>Regional Central:</b> Descontos de até <strong>R$ 60,00</strong> liberados para esta cidade.';
        } else {
            box.innerHTML = '✅ Desconto de <strong>R$ 50,00</strong> liberado para esta cidade (<b>' + info.regional + '</b>). <em>R$ 60,00 só na Regional Central.</em>';
        }
    } else {
        box.style.display = raw.length ? 'block' : 'none';
        box.innerHTML = '⚠️ Cidade não reconhecida na base. Confira o nome na lista — <strong>R$ 60,00</strong> bloqueado até bater com uma cidade cadastrada.';
    }
}

function toggleCalc() {
    var fInstal = document.getElementById('fielInstal').value === 'sim';
    document.getElementById('boxMeses').classList.toggle('hide', !fInstal);
}

function f(v) { return "R$ " + Number(v).toFixed(2).replace('.', ','); }

function gerarOferta() {
    var nome = document.getElementById('n').value || "Cliente";
    var vAt = Number(document.getElementById('vA').value);
    var desc = Number(document.getElementById('vD').value);
    var meses = Number(document.getElementById('prazo').value);
    var novo = vAt - desc;
    var econo = desc * meses;
    var ab = document.getElementById('abord').value;
    var isencao = document.getElementById('isencao').value;

    var txtIsencao = "";
    if (isencao === "1") txtIsencao = " E além disso, consegui a isenção total da sua fatura atual.";
    if (isencao === "2") txtIsencao = " E além disso, consegui a isenção total das suas próximas duas faturas.";

    var msg = "";
    if (ab === "1") {
        msg = "Olá, " + nome + "! Fui direto ao ponto com a minha supervisão e consegui uma redução excelente para o seu plano. A partir de agora, sua mensalidade cai para " + f(novo) + " durante os próximos " + meses + " meses." + txtIsencao + " Isso significa uma economia real de " + f(econo) + " no seu bolso ao final do período. Podemos confirmar a aplicação desse desconto agora mesmo?";
    } else if (ab === "2") {
        msg = nome + ", nós valorizamos muito o tempo que você está com a gente e não queremos de jeito nenhum que você tenha uma experiência desagradável ou pense em cancelar por conta de valores. Por isso, conversei com a diretoria e consegui liberar uma condição especial para mantermos nossa parceria: um desconto de " + f(desc) + " todo mês. Sua fatura passa a ser apenas " + f(novo) + " por " + meses + " meses." + txtIsencao + " O que acha de continuarmos juntos com esse novo valor?";
    } else if (ab === "3") {
        msg = "Como você é um cliente com um perfil excelente aqui na nossa base, " + nome + ", eu tenho acesso a uma oferta VIP que não fica disponível para todos. Consigo travar o valor da sua internet em apenas " + f(novo) + " por " + meses + " meses, garantindo a mesma qualidade de conexão com um custo bem menor." + txtIsencao + " É uma economia total de " + f(econo) + " para você. Vamos manter sua conexão ativa com essa condição exclusiva?";
    } else if (ab === "4") {
        msg = nome + ", essa é uma oportunidade de momento e eu realmente preciso da sua confirmação agora para conseguir segurar esse valor no sistema. Consigo fechar a sua mensalidade em " + f(novo) + " pelos próximos " + meses + " meses, mas essa oferta expira se encerrarmos o atendimento." + txtIsencao + " É a melhor condição que temos disponível hoje. Posso dar o \"ok\" aqui e já aplicar o desconto na sua próxima fatura?";
    } else if (ab === "5") {
        msg = nome + ", fazendo as contas aqui comigo, o custo-benefício de continuar com a gente com esse novo desconto é imbatível. Você vai pagar apenas " + f(novo) + " por mês durante " + meses + " meses." + txtIsencao + " Na ponta do lápis, é uma economia de " + f(econo) + " sem precisar passar pela dor de cabeça de trocar de operadora ou fazer nova instalação. Fica muito mais vantajoso. Vamos aproveitar esse novo valor?";
    } else if (ab === "6") {
        msg = "Olha, " + nome + ", eu realmente não quero que você encerre o seu contrato hoje. Fiz o máximo que o sistema permite e puxei a maior margem de negociação possível para o seu plano. O valor final, sem enrolação, fica em " + f(novo) + " mensais por " + meses + " meses." + txtIsencao + " É uma tentativa sincera de mostrar que queremos você como cliente satisfeito. Dá essa chance pra gente continuar te atendendo com esse novo valor?";
    } else if (ab === "7") {
        msg = nome + ", entendo que essa oscilação impacta sua rotina e isso não pode acontecer. Para resolver, vou priorizar um técnico especializado ainda hoje para corrigir sua fibra. Como pedido de desculpas pelo transtorno, apliquei um desconto e sua mensalidade cai para " + f(novo) + " por " + meses + " meses." + txtIsencao + " Vou acompanhar tudo pessoalmente até que sua navegação esteja perfeita. Combinado?";
    } else if (ab === "8") {
        msg = "Peço sinceras desculpas pela falta de conexão, " + nome + ". Sei o quanto você precisa da internet e já agendei um técnico em caráter de urgência para restabelecer seu sinal agora. Para compensar esse período sem o serviço, travei sua fatura em " + f(novo) + " pelos próximos " + meses + " meses." + txtIsencao + " Meu foco total é deixar você online novamente com a melhor condição possível. Podemos seguir assim?";
    }

    var res = document.getElementById('resO');
    res.innerHTML = '<i>"' + msg + '"</i>';
    res.style.display = "block";
    document.getElementById('cO').classList.remove('hide');
    window.lastMsg = msg;
}
function gerarEnc() {
    var cidBruto = (document.getElementById("eCid").value || "").trim();
    var cidKey = cidBruto.toUpperCase();
    var info = mapCidadesInfo[cidKey];

    var sa = (document.getElementById("eSA").value || "").trim();
    var regional = info ? info.regional : "-";
    var sub = info ? info.subterritorio : "-";

    var dataVal = document.getElementById("eData").value;
    var periodo = document.getElementById("ePer").value || "";
    var diaFormatado = "";
    if (dataVal && /^\d{4}-\d{2}-\d{2}$/.test(dataVal)) {
        var p = dataVal.split("-");
        diaFormatado = p[2] + "/" + p[1] + "/" + p[0];
        if (periodo) diaFormatado += " — " + periodo;
    } else {
        diaFormatado = (dataVal || "-") + (periodo ? " — " + periodo : "");
    }

    var restr = (document.getElementById("eRest").value || "").trim();
    var motivo = (document.getElementById("eRecl").value || "").trim();

    var txt =
        "SA:\n" + sa + "\n\n" +
        "REGIONAL:\n" + regional + "\n\n" +
        "SUB:\n" + sub + "\n\n" +
        "DIA:\n" + diaFormatado + "\n\n" +
        "RESTRIÇAO:\n" + restr + "\n\n" +
        "MOTIVO:\n" + motivo;

    document.getElementById("resE").innerText = txt;
    document.getElementById("resE").style.display = "block";
    document.getElementById("cE").classList.remove("hide");
    window.lastEnc = txt;
}

function gerarEnc() {
    var cidInput = document.getElementById('eCid').value.toUpperCase();
    var info = mapCidadesInfo[cidInput];
    var txt = "SA: " + document.getElementById('eSA').value + "\nRegional: " + (info ? info.regional : '-') + " | Sub: " + (info ? info.subterritorio : '-') + "\nCidade: " + document.getElementById('eCid').value + "\nData: " + document.getElementById('eData').value + " (" + document.getElementById('ePer').value + ")\nRestrição: " + document.getElementById('eRest').value + "\nMotivo: " + document.getElementById('eRecl').value;
    document.getElementById('resE').innerText = txt;
    document.getElementById('resE').style.display = "block";
    document.getElementById('cE').classList.remove('hide');
    window.lastEnc = txt;
}

function copy(t) {
    var texto = (t==='o' ? window.lastMsg : (t==='c' ? window.lastC : window.lastEnc));
    navigator.clipboard.writeText(texto);
    alert("Copiado!");
}
