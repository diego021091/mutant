const AWSMock = require('aws-sdk-mock');
const chai = require('chai');
const expect = chai.expect;
const index = require('../index');
const eventDnaMutantHorizontal = {
    body: '{"dna":["ATGCGA","CTGTAC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}',
};
const eventDnaMutantVertical = {
    body: '{"dna":["ATGCGA","CTGTAC","TTGTGT","AGGAGG","GCACTG","TCACTG"]}',
};
const eventDnaMutantObliqueAsc1 = {
    body: '{"dna":["ATGCGA","CAGAGC","TTATTT","AAACGG","ACGTCA","TCACTG"]}',
};
const eventDnaMutantObliqueAsc2 = {
    body: '{"dna":["ATGCGA","CAGTGC","TTATTA","AGACAG","GCGACA","TCACTG"]}',
};
const eventDnaMutantObliqueDesc1 = {
    body: '{"dna":["ATGCGA","CATTGC","TTATTT","AGACTG","GCGTCA","TCACTG"]}',
};
const eventDnaMutantObliqueDesc2 = {
    body: '{"dna":["ATGCGA","CAGTGC","TTATTT","ATACGG","GCTTCA","TCATTG"]}',
};
const eventDnaHuman = {
    body: '{"dna":["ATGCGA","CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTG"]}',
};
const eventDnaIsNotNXN = {
    body: '{"dna":["ATGCGA","CTGTAC","TTATGT","AGAAGG","CCCCTA","TCACTGG"]}',
};
const eventDnaIsNotMatriz = {
    body: '{"dna":"String"}',
};
const eventNitrogenBaseInvalid = {
    body: '{"dna":["ATGCGA","CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTZ"]}',
};

describe('Tests that verify that it is mutant', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
            callback(null, true);
        });
        AWSMock.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
            callback(null, { Items: [{ isMutant: false }, { isMutant: false }, { isMutant: true }] });
        });
    });
    it('Validation mutant horizontal return true', async () => {
        const result = await index.isMutant(eventDnaMutantHorizontal, {});
        expect(JSON.parse(result.body).isMutant).to.equal(true);
    });
    it('Validation mutant vertical return true', async () => {
        const result = await index.isMutant(eventDnaMutantVertical, {});
        expect(JSON.parse(result.body).isMutant).to.equal(true);
    });
    it('Validation mutant oblique asc1 return true', async () => {
        const result = await index.isMutant(eventDnaMutantObliqueAsc1, {});
        expect(JSON.parse(result.body).isMutant).to.equal(true);
    });
    it('Validation mutant oblique asc2 return true', async () => {
        const result = await index.isMutant(eventDnaMutantObliqueAsc2, {});
        expect(JSON.parse(result.body).isMutant).to.equal(true);
    });
    it('Validation mutant oblique desc1 return true', async () => {
        const result = await index.isMutant(eventDnaMutantObliqueDesc1, {});
        expect(JSON.parse(result.body).isMutant).to.equal(true);
    });
    it('Validation mutant oblique desc2 return true', async () => {
        const result = await index.isMutant(eventDnaMutantObliqueDesc2, {});
        expect(JSON.parse(result.body).isMutant).to.equal(true);
    });
    it('returns statistics of mutant queries', async () => {
        const result = await index.stats({}, {});
        expect(JSON.parse(result.body).count_mutant_dna).to.equal(1);
        expect(JSON.parse(result.body).ratio).to.equal(0.5);
    });
    after(function () {
        AWSMock.restore();
    });
});

describe('tests that verify that it is not mutant', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
            callback(null, true);
        });
    });
    it('Validation mutant return false', async () => {
        const result = await index.isMutant(eventDnaHuman, {});
        expect(JSON.parse(result.body).message).to.equal('No es mutante');
    });

    it('Dna is ​​not NXN', async () => {
        const result = await index.isMutant(eventDnaIsNotNXN, {});
        expect(JSON.parse(result.body).message).to.equal('La matriz de ADN no es de tamaño nxn');
    });

    it('Dna is not matriz', async () => {
        const result = await index.isMutant(eventDnaIsNotMatriz, {});
        expect(JSON.parse(result.body).message).to.equal('Por favor envíe un array de la forma "dni": ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]');
    });

    it('Nitrogen Base Invalid', async () => {
        const result = await index.isMutant(eventNitrogenBaseInvalid, {});
        expect(JSON.parse(result.body).message).to.equal('Secuencia de ADN invalido, solo debe contener caracteres de la base nitrogenada ATCG');
    });

    after(function () {
        AWSMock.restore();
    });
});
