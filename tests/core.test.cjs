const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../core.js");

test("normaliza cidades com e sem acento", () => {
    assert.equal(core.normalizarTexto("  São José  "), "sao jose");
});

test("calcula multa e proporcional usando centavos", () => {
    assert.deepEqual(core.calcularEncerramento({
        mesesRestantes: 6,
        diasUso: 15,
        plano: "109.99",
        atrasos: "10",
        multaMensal: "40",
        temFidelidade: true
    }), {
        mesesRestantes: 6,
        diasUso: 15,
        multa: 24000,
        proporcional: 5500,
        atrasos: 1000,
        total: 30500
    });
});

test("rejeita dias, meses e dinheiro inválidos", () => {
    assert.throws(() => core.calcularEncerramento({ mesesRestantes: -1, diasUso: 0, plano: 100, atrasos: 0, multaMensal: 40, temFidelidade: true }), /Meses restantes/);
    assert.throws(() => core.calcularEncerramento({ mesesRestantes: 1, diasUso: 31, plano: 100, atrasos: 0, multaMensal: 40, temFidelidade: true }), /Dias de uso/);
    assert.throws(() => core.calcularEncerramento({ mesesRestantes: 1, diasUso: 1, plano: -100, atrasos: 0, multaMensal: 40, temFidelidade: true }), /maior que zero/);
});

test("cronograma escalonado cobre todos os meses do primeiro ano", () => {
    const schedule = core.criarCronogramaRelampago("200", "gratis_50_30", 0);
    assert.deepEqual(schedule.map(item => item.periodo), ["1º ao 3º mês", "4º ao 6º mês", "7º ao 9º mês", "10º ao 12º mês"]);
    assert.deepEqual(schedule.map(item => item.valor), [0, 4490, 8999, 5990]);
});

test("cronograma inclui SVA também durante gratuidade", () => {
    const schedule = core.criarCronogramaRelampago("600", "gratis_flat", 1999);
    assert.deepEqual(schedule.map(item => item.valor), [1999, 7989, 11998]);
});

test("desconto de 60 reais exige regional Central", () => {
    assert.throws(() => core.validarOfertaPadrao({ plano: 109.99, desconto: 60, regionalCentral: false }), /regional Central/);
    assert.equal(core.validarOfertaPadrao({ plano: 109.99, desconto: 60, regionalCentral: true }).planoComDesconto, 4999);
});
