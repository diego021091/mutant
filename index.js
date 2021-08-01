const Service = require('./src/functions/service')

/**
 * Funcion para identificar si una cadena de ADN pertenece a un humano o a un mutante
 * @param {*} event 
 * @param {*} context 
 */
async function isMutant(event, context) {
    const service = new Service();
    let isMutant = await service.isMutant(event);
    return isMutant;
}

/**
 * Funcion para devolver las estadisticas de consultas de ADN anteriores
 * @param {*} event 
 * @param {*} context 
 */
async function stats(event, context) {
    const service = new Service();
    let stats = await service.stats();
    return stats;
}

module.exports.isMutant = isMutant;
module.exports.stats = stats;
