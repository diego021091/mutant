const Validations = require('./validations');
const Dao = require('./dao');

class Service {
    constructor() {
        this.dao = new Dao();
        this.validations = new Validations();
    }

    /**
     * Metodo que identifica si una cadena de ADN le pertenece a un mutante o a un humano
     * @param {*} event request
     * @returns retorna true o false
     */
    async isMutant(event) {
        try {
            const body = JSON.parse(event.body);
            // Se valida que el campo dna sea un arreglo
            if (!body.dna || !Array.isArray(body.dna)) {
                throw 'Por favor envíe un array de la forma "dni": ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]';
            }
            let dna = body.dna;
            // Se valida que la matriz sea de tamaño nxn y que los caracteres de la secuencia sean A,T,C,G
            this.validations.validateArrayWithDNA(dna);
            // Se construye la matriz a un arreglo bidimensional
            let isMutant = false;
            let matrizDNA = this.matrizDNA(dna);
            let n = matrizDNA.length;
            // se valida horizontalmente que sea mutante
            for (let i = 0; i < n; i++) {
                let count = 1;
                for (let e = 0; e < n - 1; e++) {
                    count = matrizDNA[i][e] === matrizDNA[i][e + 1] ? count + 1 : 1;
                    if (count === 4) {
                        isMutant = true;
                        break;
                    }
                }
                if (isMutant) break;
            }
            // si no es mutante horizontal, se valida vertical
            if (!isMutant) {
                for (let i = 0; i < n; i++) {
                    let count = 1;
                    for (let e = 0; e < n - 1; e++) {
                        count = matrizDNA[e][i] === matrizDNA[e + 1][i] ? count + 1 : 1;
                        if (count === 4) {
                            isMutant = true;
                            break;
                        }
                    }
                    if (isMutant) break;
                }
            }
            // si no es mutante horizontal, ni vertical se valida de forma oblicua ascendente
            if (!isMutant) {
                //primera parte diagonal superior ascendente
                for (let i = 0; i < n; i++) {
                    let letra = null;
                    let count = 1;
                    for (let j = 0; j <= i; j++) {
                        if (letra === matrizDNA[i - j][j]) count + 1;
                        count = letra === matrizDNA[i - j][j] ? count + 1 : 1;
                        letra = matrizDNA[i - j][j];
                        if (count === 4) {
                            isMutant = true;
                            break;
                        }
                    }
                    if (isMutant) break;
                }
            }

            if (!isMutant) {
                //segunda parte diagonal inferior ascendente
                for (let i = 0; i < n; i++) {
                    let letra = null;
                    let count = 1;
                    for (let j = 0; j < n - i - 1; j++) {
                        count = letra === matrizDNA[n - j - 1][j + i + 1] ? count + 1 : 1;
                        letra = matrizDNA[n - j - 1][j + i + 1];
                        if (count === 4) {
                            isMutant = true;
                            break;
                        }
                    }
                    if (isMutant) break;
                }
            }

            // si no es mutante horizontal, ni vertical, ni oblicua ascendente se valida de forma oblicua descendente
            if (!isMutant) {
                //primera parte diagonal superior descendente
                for (let i = n - 1; i >= 0; i--) {
                    let letra = null;
                    let count = 1;
                    for (let j = 0; j <= n - i - 1; j++) {
                        if (letra === matrizDNA[j][i + j]) count + 1;
                        count = letra === matrizDNA[j][i + j] ? count + 1 : 1;
                        letra = matrizDNA[j][i + j];
                        if (count === 4) {
                            isMutant = true;
                            break;
                        }
                    }
                    if (isMutant) break;
                }
            }

            if (!isMutant) {
                //segunda parte diagonal inferior descendente
                for (let i = 1; i < n; i++) {
                    let letra = null;
                    let count = 1;
                    for (let j = 0; j < n - i; j++) {
                        if (letra === matrizDNA[i + j][j]) count + 1;
                        count = letra === matrizDNA[i + j][j] ? count + 1 : 1;
                        letra = matrizDNA[i + j][j];
                        if (count === 4) {
                            isMutant = true;
                            break;
                        }
                    }
                    if (isMutant) break;
                }
            }
            // Se guarda la cadena de adn y si es o no mutante en base de datos
            let ResultSave = await this.dao.saveDnaAndResult({ dna: dna.toString(), isMutant: isMutant });

            if (!isMutant) {
                throw 'No es mutante';
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    isMutant: isMutant,
                    message: "Es Mutante"
                }),
            };
        } catch (error) {
            let message = typeof error === 'string' ? error : error.message;
            return {
                statusCode: 403,
                body: JSON.stringify({
                    message: message,
                }),
            };
        }
    }

    /**
     * Se arma una matriz bidimensional a partir de una matriz de strings
     * @param {*} dna matriz de strings
     * @returns devuelve una matriz bidimensional de tamaño NXN
     */
    matrizDNA(dna) {
        let matrizDNA = [];
        dna.forEach((element) => {
            let rowMatriz = Array.from(element);
            matrizDNA.push(rowMatriz);
        });
        return matrizDNA;
    }

    /**
     * Metodo para restornar estadisticas de los mutantes consultados
     * @returns devuelve un json con la cantidad de mutantes, de humanos y el ratio entre ellos
     */
    async stats() {
        let numberMutants = 0;
        let numberHumans = 0;

        let results = await this.dao.scanAllDna();
        results.Items.forEach((element) => {
            if (element.isMutant) {
                numberMutants++;
            } else {
                numberHumans++;
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                count_mutant_dna: numberMutants,
                count_human_dna: numberHumans,
                ratio: numberMutants / numberHumans,
            }),
        };
    }
}

module.exports = Service;
