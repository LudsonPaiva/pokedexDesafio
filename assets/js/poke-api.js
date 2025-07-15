
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.species = pokeDetail.species.url
    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight

    const abilities = pokeDetail.abilities.map((ability) => ability.ability.name)
    const [ability] = abilities
    pokemon.abilities = abilities
    pokemon.ability = ability

    const hp = pokeDetail.stats.find(base_stat => base_stat.stat.name === 'hp')
    const specieHp = hp ? hp.base_stat : 'Hp unknowm'
    pokemon.hp = specieHp

    const attack = pokeDetail.stats.find(base_stat => base_stat.stat.name === 'attack')
    const specieAttack = attack ? attack.base_stat : 'Attack unknowm'
    pokemon.attack = specieAttack

    const defense = pokeDetail.stats.find(base_stat => base_stat.stat.name === 'defense')
    const specieDefense = defense ? defense.base_stat : 'defense unknowm'
    pokemon.defense = specieDefense

    const specialAttack = pokeDetail.stats.find(base_stat => base_stat.stat.name === 'special-attack')
    const speciespecialAttack = specialAttack ? specialAttack.base_stat : 'special-attack unknowm'
    pokemon.specialAttack = speciespecialAttack

    const specialDefense = pokeDetail.stats.find(base_stat => base_stat.stat.name === 'special-defense')
    const speciespecialDefense = specialDefense ? specialDefense.base_stat : 'special-defense unknowm'
    pokemon.specialDefense = speciespecialDefense

    const speed = pokeDetail.stats.find(base_stat => base_stat.stat.name === 'speed')
    const specieSpeed = speed ? speed.base_stat : 'speed unknowm'
    pokemon.speed = specieSpeed

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon) // passa a resposta para a função convertPokeApiDetailToPokemon
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // passa a resposta para a função getPokemonDetail
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
} // retorna toda a manipulação do nosso fetch

// código do desafio 1º passo

// Cria uma função dentro do objeto pokeApi chamada getPokemonSpecies, que recebe como parâmetro um pokemon (objeto com as informações do Pokémon).
pokeApi.getPokemonSpecies = (pokemon) => {  
    return fetch(pokemon.species) //Faz uma requisição HTTP (fetch) usando a URL da espécie do Pokémon, que está armazenada em pokemon.species.
        .then((response) => response.json()) // Quando a resposta da API chega, ela é convertida para JSON (objeto JavaScript).
        .then((jsonBody) => { // Esse jsonBody agora é um objeto com todos os dados da espécie.
            const en = jsonBody.genera.find(genus => genus.language.name === 'en') // procura, dentro do array genera, um objeto cujo idioma (language.name) seja "en" (inglês). A função find() retorna o primeiro elemento que satisfaz a condição.
            const speciesName = en ? en.genus : 'Specie unknowm' // Se encontrou um gênero em (en), retorna o valor da propriedade genus (ex: "Pokémon Semente"). Se não encontrou, retorna "Specie unknowm".
            const genderRate = jsonBody.gender_rate
            const egg_groups = jsonBody.egg_groups.map((egg_group) => egg_group.name)
            const eggCycle = jsonBody.hatch_counter

            return {
                speciesName, 
                genderRate, 
                egg_group: egg_groups,
                eggCycle
            }
        })
}

pokeApi.getPokemonById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return fetch(url)
        .then(response => response.json())
        .then(convertPokeApiDetailToPokemon);
};
