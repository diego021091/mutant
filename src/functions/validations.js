const nitrogenBase = 'ATCG';

class Validations {
    /**
     *
     * @param {*} dna
     * @returns valida si es la cadena dna es de tamaño nxn y que sus secuencias solo contengan caracteres de la base nitrogenada
     */
    validateArrayWithDNA(dna) {
        let sizeArray = dna.length;
        dna.forEach((elem) => {
            let sizeRow = elem.length;
            if (sizeArray !== sizeRow) {
                throw 'La matriz de ADN no es de tamaño nxn';
            }
            for (let i = 0; i < elem.length; i++) {
                if (nitrogenBase.indexOf(elem[i]) === -1) {
                    throw 'Secuencia de ADN invalido, solo debe contener caracteres de la base nitrogenada ATCG';
                }
            }
        });
    }
}

module.exports = Validations;
