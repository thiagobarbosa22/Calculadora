"use strict";

const { normalizarTexto, paraCentavos, formatarCentavos, calcularEncerramento, criarCronogramaRelampago, validarOfertaPadrao } = window.CalculadoraCore;

const dadosRegionais = {
    "Central": {
        "SUMARÉ": ["Aguaí", "Americana", "Araras", "Artur Nogueira", "Casa Branca", "Conchal", "Cordeirópolis", "Cosmópolis", "Engenheiro Coelho", "Estiva Gerbi", "Iracemápolis", "Leme", "Limeira", "Mogi Guaçu", "Mogi Mirim", "Nova Odessa", "Paulínia", "Piracicaba", "Pirassununga", "Porto Ferreira", "Rio Claro", "Santa Bárbara d'Oeste", "Santa Cruz das Palmeiras", "Santa Gertrudes", "Santa Rita do Passa Quatro", "Sumaré"],
        "SOROCABA": ["Alumínio", "Angatuba", "Araçoiaba da Serra", "Bofete", "Boituva", "Campina do Monte Alegre", "Capela do Alto", "Capivari", "Cerquilho", "Cesário Lange", "Conchas", "Iperó", "Itapetininga", "Itu", "Jumirim", "Laranjal Paulista", "Monte Mor", "Pereiras", "Pilar do Sul", "Porangaba", "Quadra", "Rafard", "Rio das Pedras", "Saltinho", "Salto", "Salto de Pirapora", "Sarapuí", "Sorocaba", "Tatuí", "Tietê", "Votorantim"],
        "CAMPINAS": ["Amparo", "Campinas", "Holambra", "Hortolândia", "Jaguariúna", "Lindóia", "Monte Alegre do Sul", "Pedreira", "Santo Antônio de Posse", "Serra Negra"]
    },
    "Centro Oeste": {
        "ARARAQUARA": ["Américo Brasiliense", "Araraquara", "Boa Esperança do Sul", "Bocaina", "Borborema", "Cravinhos", "Descalvado", "Dobrada", "Dourado", "Gavião Peixoto", "Guariba", "Guatapará", "Ibaté", "Ibitinga", "Itaju", "Itápolis", "Matão", "Motuca", "Nova Europa", "Ribeirão Bonito", "Ribeirão Preto", "Rincão", "Santa Ernestina", "Santa Lúcia", "São Carlos", "Tabatinga", "Trabiju"],
        "BARRETOS": ["Bady Bassitt", "Barretos", "Bebedouro", "Cândido Rodrigues", "Colina", "Cristais Paulista", "Fernando Prestes", "Franca", "Guaíra", "Itajobi", "Itirapuã", "Jaborandi", "Jaboticabal", "Mirassol", "Monte Alto", "Olímpia", "Patrocínio Paulista", "Pindorama", "Pitangueiras", "Ribeirão Corrente", "Santa Adélia", "São José do Rio Preto"],
        "LENÇÓIS PAULISTA": ["Águas de Santa Bárbara", "Agudos", "Arandu", "Arealva", "Areiópolis", "Avaré", "Bariri", "Barra Bonita", "Bauru", "Borebi", "Botucatu", "Cerqueira César", "Dois Córregos", "Iaras", "Igaraçu do Tietê", "Itaí", "Itapuí", "Itatinga", "Jaú", "Lençóis Paulista", "Lins", "Macatuba", "Manduri", "Mineiros do Tietê", "Novo Horizonte", "Óleo", "Paranapanema", "Pardinho", "Pederneiras", "Piratininga", "Pratânia", "São Manuel"]
    },
    "Sudeste": {
        "JUNDIAÍ": ["Araçariguama", "Atibaia", "Bom Jesus dos Perdões", "Bragança Paulista", "Cabreúva", "Caieiras", "Campo Limpo Paulista", "Francisco Morato", "Franco da Rocha", "Indaiatuba", "Itupeva", "Jarinu", "Jundiaí", "Louveira", "Mairiporã", "Nazaré Paulista", "Piracaia", "Valinhos", "Várzea Paulista", "Vinhedo"],
        "PRAIA GRANDE": ["Cubatão", "Guarujá", "Itanhaém", "Mongaguá", "Peruíbe", "Praia Grande", "Santos", "São Bernardo do Campo", "São Vicente"],
        "SÃO JOSÉ DOS CAMPOS": ["Biritiba Mirim", "Caçapava", "Guararema", "Igaratá", "Jacareí", "Mogi das Cruzes", "Salesópolis", "Santa Branca", "São José dos Campos", "São Paulo", "Taubaté", "Tremembé"]
    }
};

const cidades = new Map();
for (const [regional, subs] of Object.entries(dadosRegionais)) {
    for (const [subterritorio, nomes] of Object.entries(subs)) {
        for (const nome of nomes) cidades.set(normalizarTexto(nome), { nome, regional, subterritorio });
    }
}

const $ = id => document.getElementById(id);
const chatHistory = [];
const CHAT_API_URL = window.location.hostname.endsWith("github.io")
    ? "https://calculadora-xggm.onrender.com/api/chat"
    : "/api/chat";

function exibirErro(targetId, error) {
    const target = $(targetId);
    target.replaceChildren();
    const strong = document.createElement("strong");
    strong.textContent = "Não foi possível concluir: ";
    target.append(strong, document.createTextNode(error.message || "Revise os campos e tente novamente."));
    target.classList.add("error");
    target.hidden = false;
}

function exibirTexto(targetId, text, italic = false) {
    const target = $(targetId);
    const content = italic ? document.createElement("i") : document.createElement("span");
    content.textContent = italic ? `“${text}”` : text;
    target.replaceChildren(content);
    target.classList.remove("error");
    target.hidden = false;
}

function selecionarAba(name) {
    document.querySelectorAll("[data-panel]").forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
    document.querySelectorAll("[role=tab]").forEach(button => {
        const active = button.dataset.tab === name;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
    });
}

function cidadeSelecionada(id) {
    return cidades.get(normalizarTexto($(id).value));
}

function verificarCidade() {
    const central = cidadeSelecionada("cid")?.regional === "Central";
    $("o60").disabled = !central;
    $("alerta-central").hidden = !central;
    if (!central && $("vD").value === "60") $("vD").value = "50";
}

function alternarRelampago() {
    const active = $("velocidadeRelampago").value !== "none";
    $("tipoRelampago").disabled = !active;
    $("regrasPadrao").classList.toggle("disabled-section", active);
    $("regrasPadrao").querySelectorAll("input, select").forEach(control => { control.disabled = active; });
    $("abord").disabled = active;
}

function totalSvas() {
    const selected = [...document.querySelectorAll(".sva-chk:checked")];
    return {
        total: selected.reduce((sum, checkbox) => sum + paraCentavos(checkbox.value, "SVA"), 0),
        nomes: selected.map(checkbox => checkbox.dataset.nome)
    };
}

function gerarOfertaRelampago(nome, planoId, total, nomes) {
    const tipo = $("tipoRelampago").value;
    const planoNome = $("velocidadeRelampago").selectedOptions[0].textContent;
    const cronograma = criarCronogramaRelampago(planoId, tipo, total);
    const sva = nomes.length ? ` com ${nomes.join(", ")}` : "";
    const valores = cronograma.map(item => `${item.periodo}: ${formatarCentavos(item.valor)}`).join("; ");
    return `Olá, ${nome}! Consegui uma condição especial para o plano ${planoNome}${sva}. O cronograma completo fica assim: ${valores}. Esses valores já consideram os aplicativos selecionados. Posso confirmar essa condição para você?`;
}

function gerarOfertaPadrao(nome, totalSva, nomes) {
    const regionalCentral = cidadeSelecionada("cid")?.regional === "Central";
    const values = validarOfertaPadrao({ plano: $("vA").value, desconto: $("vD").value, regionalCentral });
    const total = values.planoComDesconto + totalSva;
    const meses = Number($("prazo").value);
    const gratis = Number($("isencao").value);
    const abordagem = $("abord").value;
    const extra = nomes.length ? `, incluindo ${nomes.join(", ")}` : "";
    const isencao = gratis ? `, além de ${gratis} ${gratis === 1 ? "mês gratuito" : "meses gratuitos"}` : "";
    const condicao = `o valor total fica em ${formatarCentavos(total)} por ${meses} meses${extra}${isencao}`;
    const templates = {
        "1": `Olá, ${nome}! Consegui reduzir sua mensalidade: ${condicao}. O que acha dessa condição?`,
        "2": `Olá, ${nome}! Entendo que o valor atual pode pesar no orçamento. Para ajudar, ${condicao}. Faz sentido para você?`,
        "3": `Olá, ${nome}! Encontrei uma condição diferenciada para o seu atendimento: ${condicao}. Posso confirmar?`,
        "4": `Olá, ${nome}! Para resolvermos isso agora, consegui a seguinte condição: ${condicao}. Posso aplicá-la?`,
        "5": `Olá, ${nome}! Buscando um equilíbrio melhor entre serviço e investimento, ${condicao}. Podemos seguir assim?`,
        "6": `Olá, ${nome}! Revisei as alternativas disponíveis e cheguei à melhor condição autorizada: ${condicao}. Isso ajuda você a permanecer conosco?`,
        "7": `Olá, ${nome}! Entendo a frustração com a instabilidade. ${mensagemTecnica()} Como compensação, ${condicao}. Posso seguir com essa alternativa?`,
        "8": `Olá, ${nome}! Sinto muito pela falta de conexão. ${mensagemTecnica()} Além disso, ${condicao}. Essa solução atende você?`
    };
    return templates[abordagem];
}

function mensagemTecnica() {
    return $("acaoTecnicaConfirmada").checked
        ? "O atendimento técnico já foi confirmado no sistema."
        : "Posso solicitar atendimento técnico prioritário para verificar a conexão.";
}

function gerarOferta() {
    try {
        const nome = $("n").value.trim() || "cliente";
        const svas = totalSvas();
        const planoId = $("velocidadeRelampago").value;
        const message = planoId === "none"
            ? gerarOfertaPadrao(nome, svas.total, svas.nomes)
            : gerarOfertaRelampago(nome, planoId, svas.total, svas.nomes);
        exibirTexto("resO", message, true);
        $("copy-oferta").hidden = false;
        $("copy-oferta").dataset.copy = message;
    } catch (error) {
        exibirErro("resO", error);
        $("copy-oferta").hidden = true;
    }
}

function calcularMulta() {
    try {
        const result = calcularEncerramento({
            mesesRestantes: $("mR").value,
            diasUso: $("dC").value,
            plano: $("planoMulta").value,
            atrasos: $("vAtra").value,
            multaMensal: $("tabelaMulta").value,
            temFidelidade: $("fielInstal").value === "sim"
        });
        const nome = $("nomeMulta").value.trim() || "cliente";
        const parts = [];
        if (result.multa) parts.push(`multa contratual de ${formatarCentavos(result.multa)}`);
        if (result.proporcional) parts.push(`proporcional de uso de ${formatarCentavos(result.proporcional)}`);
        if (result.atrasos) parts.push(`faturas em aberto de ${formatarCentavos(result.atrasos)}`);
        const detail = parts.length ? parts.join(", ").replace(/, ([^,]*)$/, " e $1") : "nenhum valor adicional";
        const message = `Olá, ${nome}. A estimativa para encerramento hoje é ${formatarCentavos(result.total)}, composta por ${detail}. Antes de prosseguir, posso verificar alternativas para reduzir esse impacto?`;

        const box = $("resC");
        box.replaceChildren();
        const list = document.createElement("ul");
        for (const [label, value] of [["Multa", result.multa], ["Proporcional", result.proporcional], ["Faturas em aberto", result.atrasos], ["Total estimado", result.total]]) {
            const item = document.createElement("li");
            item.textContent = `${label}: ${formatarCentavos(value)}`;
            list.append(item);
        }
        const quote = document.createElement("i");
        quote.textContent = `“${message}”`;
        box.append(list, quote);
        box.classList.remove("error");
        box.hidden = false;
        $("copy-multa").hidden = false;
        $("copy-multa").dataset.copy = message;
    } catch (error) {
        exibirErro("resC", error);
        $("copy-multa").hidden = true;
    }
}

function gerarEncaixe() {
    try {
        const sa = $("eSA").value.trim();
        const cityName = $("eCid").value.trim();
        const date = $("eData").value;
        const reason = $("eRecl").value.trim();
        if (!sa || !cityName || !date || !reason) throw new Error("Preencha SA, cidade, data e motivo.");
        const city = cidadeSelecionada("eCid");
        if (!city) throw new Error("Selecione uma cidade válida da lista.");
        const formattedDate = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
        const text = [
            `SA: ${sa}`,
            `Regional: ${city.regional} | Sub: ${city.subterritorio}`,
            `Cidade: ${city.nome}`,
            `Data: ${formattedDate} (${$("ePer").value})`,
            `Restrição: ${$("eRest").value.trim() || "Sem restrição informada"}`,
            `Motivo: ${reason}`
        ].join("\n");
        exibirTexto("resE", text);
        $("copy-encaixe").hidden = false;
        $("copy-encaixe").dataset.copy = text;
    } catch (error) {
        exibirErro("resE", error);
        $("copy-encaixe").hidden = true;
    }
}

async function copiar(button) {
    try {
        await navigator.clipboard.writeText(button.dataset.copy || "");
        const original = button.textContent;
        button.textContent = "Copiado!";
        setTimeout(() => { button.textContent = original; }, 1500);
    } catch {
        alert("O navegador bloqueou a cópia. Selecione o texto e copie manualmente.");
    }
}

function adicionarMensagemChat(role, text) {
    const element = document.createElement("div");
    element.className = `ia-msg ia-${role}`;
    element.textContent = text;
    $("ia-chat").append(element);
    $("ia-chat").scrollTop = $("ia-chat").scrollHeight;
    return element;
}

async function perguntarIA() {
    const input = $("ia-input");
    const message = input.value.trim();
    if (!message || $("ia-send").disabled) return;
    const priorHistory = chatHistory.slice(-8);
    adicionarMensagemChat("user", message);
    chatHistory.push({ role: "user", content: message });
    input.value = "";
    $("ia-send").disabled = true;
    const pending = adicionarMensagemChat("bot", "Pensando…");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
        const response = await fetch(CHAT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ msg: message, history: priorHistory }),
            signal: controller.signal
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `Falha no atendimento (${response.status}).`);
        const text = String(data.text || "Não recebi uma resposta válida.");
        pending.textContent = text;
        chatHistory.push({ role: "assistant", content: text });
    } catch (error) {
        pending.className = "ia-msg ia-error";
        pending.textContent = error.name === "AbortError" ? "A resposta demorou demais. Tente novamente." : error.message;
    } finally {
        clearTimeout(timeout);
        $("ia-send").disabled = false;
        input.focus();
    }
}

function inicializar() {
    const datalist = $("cidades_geral");
    [...cidades.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).forEach(city => {
        const option = document.createElement("option");
        option.value = city.nome;
        datalist.append(option);
    });

    document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => selecionarAba(button.dataset.tab)));
    $("theme-toggle").addEventListener("click", () => document.body.classList.toggle("dark"));
    $("cid").addEventListener("input", verificarCidade);
    $("velocidadeRelampago").addEventListener("change", alternarRelampago);
    $("gerar-oferta").addEventListener("click", gerarOferta);
    $("calcular-multa").addEventListener("click", calcularMulta);
    $("gerar-encaixe").addEventListener("click", gerarEncaixe);
    document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", () => copiar(button)));
    $("ia-toggle").addEventListener("click", () => {
        const open = $("ia-window").hidden;
        $("ia-window").hidden = !open;
        $("ia-toggle").setAttribute("aria-expanded", String(open));
        if (open) $("ia-input").focus();
    });
    $("ia-close").addEventListener("click", () => $("ia-toggle").click());
    $("ia-send").addEventListener("click", perguntarIA);
    $("ia-input").addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            perguntarIA();
        }
    });
    selecionarAba("ret");
    alternarRelampago();
}

document.addEventListener("DOMContentLoaded", inicializar);
