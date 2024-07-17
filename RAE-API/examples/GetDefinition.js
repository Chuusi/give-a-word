const RAE = require('../src/RAE');

const debug = false;
const rae = new RAE(debug);

async function definir(palabra){
	const search = await rae.searchWord(palabra);
	const first_result = search.results[0];

	const wordId = first_result.id;
	const result = await rae.fetchWord(wordId);
	const definitions = result.definitions;

	/* let i = 1;
	console.log(`Definición de ${first_result.header}`);
	for (const definition of definitions) {
		console.log(`${i}. Tipo: ${definition.type}\n`);
		console.log(`    Definición: ${definition.content}\n\n`);
		i++;
	} */
	const data = {
        word: first_result.header,
        type: definitions[0].type,
        def: definitions[0].content,
    };
	await Promise.all([search, result]);
	return data;
}



module.exports = definir;
