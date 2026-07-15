(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.CalculadoraCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const OFERTAS_RELAMPAGO = Object.freeze({
        "200": Object.freeze({ valorFixo: 8999, desc50: 4490, desc30: 5990, flat: 4990, esp1a7: 2990, esp50: 4490, esp30: 5990 }),
        "400": Object.freeze({ valorFixo: 9499, desc50: 4490, desc30: 6490, flat: 4990, esp1a7: 2990, esp50: 4490, esp30: 6490 }),
        "600": Object.freeze({ valorFixo: 9999, desc50: 4990, desc30: 6990, flat: 5990, esp1a7: 3490, esp50: 4990, esp30: 6990 }),
        "600hbo": Object.freeze({ valorFixo: 13499, desc50: 5990, desc30: 8990, flat: 6490, esp1a7: 4990, esp50: 6990, esp30: 9490 }),
        "1000": Object.freeze({ valorFixo: 13999, desc50: 6990, desc30: 9990, flat: 6990, esp1a7: 5990, esp50: 6990, esp30: 9490 })
    });

    function normalizarTexto(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLocaleLowerCase("pt-BR");
    }

    function paraCentavos(value, fieldName = "Valor") {
        const normalized = String(value ?? "").trim().replace(",", ".");
        if (!normalized) throw new Error(`${fieldName} é obrigatório.`);
        const number = Number(normalized);
        if (!Number.isFinite(number)) throw new Error(`${fieldName} é inválido.`);
        return Math.round(number * 100);
    }

    function formatarCentavos(cents) {
        if (!Number.isInteger(cents)) throw new Error("Valor monetário inválido.");
        return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function inteiroNoIntervalo(value, min, max, fieldName) {
        const number = Number(value);
        if (!Number.isInteger(number) || number < min || number > max) {
            throw new Error(`${fieldName} deve estar entre ${min} e ${max}.`);
        }
        return number;
    }

    function calcularEncerramento(input) {
        const mesesRestantes = inteiroNoIntervalo(input.mesesRestantes, 0, 24, "Meses restantes");
        const diasUso = inteiroNoIntervalo(input.diasUso, 0, 30, "Dias de uso");
        const plano = paraCentavos(input.plano, "Valor do plano");
        const atrasos = paraCentavos(input.atrasos, "Faturas em aberto");
        const multaMensal = paraCentavos(input.multaMensal, "Multa mensal");

        if (plano <= 0) throw new Error("O valor do plano deve ser maior que zero.");
        if (atrasos < 0) throw new Error("Faturas em aberto não podem ser negativas.");
        if (multaMensal < 0) throw new Error("A multa mensal não pode ser negativa.");

        const multa = input.temFidelidade ? mesesRestantes * multaMensal : 0;
        const proporcional = Math.round((plano * diasUso) / 30);
        return Object.freeze({
            mesesRestantes,
            diasUso,
            multa,
            proporcional,
            atrasos,
            total: multa + proporcional + atrasos
        });
    }

    function criarCronogramaRelampago(planoId, tipo, totalSva = 0) {
        const oferta = OFERTAS_RELAMPAGO[planoId];
        if (!oferta) throw new Error("Plano Relâmpago inválido.");
        if (!Number.isInteger(totalSva) || totalSva < 0) throw new Error("Valor de SVA inválido.");

        const gratisOuSva = totalSva;
        const noveOuSva = 999 + totalSva;
        const regular = oferta.valorFixo + totalSva;
        const schedules = {
            gratis_50_30: [
                { periodo: "1º ao 3º mês", valor: gratisOuSva },
                { periodo: "4º ao 6º mês", valor: oferta.desc50 + totalSva },
                { periodo: "7º ao 9º mês", valor: regular },
                { periodo: "10º ao 12º mês", valor: oferta.desc30 + totalSva }
            ],
            gratis_flat: [
                { periodo: "1º ao 3º mês", valor: gratisOuSva },
                { periodo: "4º ao 6º mês", valor: oferta.flat + totalSva },
                { periodo: "a partir do 7º mês", valor: regular }
            ],
            "999_50_30": [
                { periodo: "1º ao 3º mês", valor: noveOuSva },
                { periodo: "4º ao 6º mês", valor: oferta.desc50 + totalSva },
                { periodo: "7º ao 9º mês", valor: regular },
                { periodo: "10º ao 12º mês", valor: oferta.desc30 + totalSva }
            ],
            "999_flat": [
                { periodo: "1º ao 3º mês", valor: noveOuSva },
                { periodo: "4º ao 6º mês", valor: oferta.flat + totalSva },
                { periodo: "a partir do 7º mês", valor: regular }
            ],
            especial: [
                { periodo: "1º ao 7º mês", valor: oferta.esp1a7 + totalSva },
                { periodo: "8º ao 9º mês", valor: oferta.esp50 + totalSva },
                { periodo: "10º ao 12º mês", valor: oferta.esp30 + totalSva }
            ]
        };
        if (!schedules[tipo]) throw new Error("Tipo de oferta inválido.");
        return schedules[tipo].map(item => Object.freeze(item));
    }

    function validarOfertaPadrao(input) {
        const plano = paraCentavos(input.plano, "Plano atual");
        const desconto = paraCentavos(input.desconto, "Desconto");
        if (plano <= 0) throw new Error("O plano atual deve ser maior que zero.");
        if (desconto <= 0 || desconto >= plano) throw new Error("O desconto deve ser maior que zero e menor que o plano.");
        if (desconto === 6000 && !input.regionalCentral) throw new Error("O desconto de R$ 60,00 é exclusivo da regional Central.");
        return { plano, desconto, planoComDesconto: plano - desconto };
    }

    return Object.freeze({
        OFERTAS_RELAMPAGO,
        normalizarTexto,
        paraCentavos,
        formatarCentavos,
        calcularEncerramento,
        criarCronogramaRelampago,
        validarOfertaPadrao
    });
});
