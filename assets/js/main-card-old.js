const pokemonList = document.getElementById('pokemonList')
const about = document.getElementById('about')
const baseStats = document.getElementById('baseStats')
const loadMoreButton = document.getElementById('loadMoreButton')
const buttonAbout = document.getElementById('buttonAbout')
const buttonBaseStatus = document.getElementById('buttonBaseStatus')
const buttonEvolution = document.getElementById('buttonEvolution')
const buttonMoves = document.getElementById('buttonMoves')

const maxRecords = 151;
const limit = 1;
let offset = 0;

// 1. Recupera o ID salvo no localStorage
const pokemonId = localStorage.getItem('selectedPokemonId');

// 2. Se não houver ID, redireciona de volta para index.html
if (!pokemonId) {
    alert("Nenhum Pokémon selecionado.");
    window.location.href = "index.html";
}

// 3. Chama a função para buscar os dados e exibir o card
pokeApi.getPokemonById(pokemonId).then((pokemon) => {
    displayPokemonCard(pokemon);
    setupTabs(pokemon);
});

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <div class="buttons-header">
                <img class="button-header" src="./assets/images/de-volta.png" alt="voltar"></img>
                <img class="button-header" src="./assets/images/favorito.png" alt="favorito"></img>
            </div>
            <div class="description-header">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                </div>
            </div>
            <div class="pokemon-image">
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

// Esconde todas as seções
function hideAllSelections() {
    document.getElementById('about').style.display = 'none';
    document.getElementById('baseStats').style.display = 'none';
    document.getElementById('evolution').style.display = 'none';
    document.getElementById('moves').style.display = 'none';
}

// Código do desafio 2º passo

function convertPokemonToabout(pokemon) { //  Define a função que converte um objeto pokemon (com os dados e espécie) em um bloco de HTML.
    return `

            <br><br>
            <p><b>About</b></p>
            <p>Species: ${pokemon.species}</p>
            <p>Height: ${pokemon.height}</p>
            <p>Weight: ${pokemon.weight}</p>
            <p>Ability: ${pokemon.abilities.map((ability) => `${ability}`).join(', ')}</p>

            <h3>Breeding</h3>
            <p>Gender: ${pokemon.gender}</p>
            <p>Egg Group: ${pokemon.egg_group.map((egg_group) => `${egg_group}`).join(', ')}</p>
            <p>Egg Cycle: ${pokemon.eggCycle} x 255 = ${pokemon.eggCycle*255}</p>

    `     
}

// Código do desafio 3º passo 

function loadPokemonAbout(offset, limit) { // Define a função que vai carregar os detalhes dos Pokémon, incluindo a espécie traduzida.
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => { // Chama a função getPokemons para obter uma lista de Pokémon, a partir de um offset e limit. O resultado é um array chamado pokemons.
        about.innerHTML = '' // limpa o antigo

        const promises = pokemons.map(pokemon => // Mapeia cada Pokémon da lista para um processo assíncrono que obterá o nome da espécie.
            pokeApi.getPokemonSpecies(pokemon).then(({ speciesName, genderRate, egg_group, eggCycle}) => {  // Para cada Pokémon, chama getPokemonSpecies e espera o nome da espécie.
                let genderText = 'Genderless'

                if (genderRate === -1) {
                    genderText = 'Genderless'
                } else {
                    const percentFemale = (genderRate / 8) * 100
                    const percentMale = 100 - percentFemale
                    genderText = `♂ ${percentMale.toFixed(1)}% / ♀ ${percentFemale.toFixed(1)}%`
                }
                return { // Cria um novo objeto com todas as informações do Pokémon e a espécie traduzida (speciesName) e o retorna.
                    species: speciesName,
                    height: pokemon.height,
                    weight: pokemon.weight,
                    abilities: pokemon.abilities,
                    gender: genderText,
                    egg_group: egg_group,
                    eggCycle: eggCycle  
                } // Finaliza o .map() gerando uma lista de promessas (promises) — cada uma obtendo os dados de um Pokémon com a espécie.
            })
        )

        Promise.all(promises).then((pokemonsWithSpecies) => { // Aguarda todas as promessas (requisições de espécie) terminarem. O resultado é um array pokemonsWithSpecies com os Pokémon e o nome da espécie incluído.
            const html = pokemonsWithSpecies.map(convertPokemonToabout).join('') // Transforma cada Pokémon em HTML usando a função convertPokemonToabout, e junta todos os blocos HTML em uma única string.
            about.innerHTML = html // Insere o HTML resultante dentro da div#about, exibindo os dados na tela.
        })
    })
}

function convertPokemonToBaseStats(pokemon) { //  Define a função que converte um objeto pokemon (com os dados e espécie) em um bloco de HTML.
    return `

            <br><br>
            <p><b>Base Stats</b></p>
            <p>HP: ${pokemon.hp}</p>
            <p>Attack: ${pokemon.attack}</p>
            <p>Defense: ${pokemon.defense}</p>
            <p>Sp. Attack: ${pokemon.specialAttack}</p>
            <p>Sp. Defense: ${pokemon.specialDefense}</p>
            <p>Speed: ${pokemon.speed}</p>
            <p>Total: ${pokemon.hp + pokemon.attack + pokemon.defense + pokemon.specialAttack + pokemon.specialDefense + pokemon.speed}</p>

            <p><b>Type Defenses</b></p>


    `     
}

function loadPokemonBaseStats(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToBaseStats).join('')
        baseStats.innerHTML = newHtml
    })
}


loadPokemonItens(offset, limit)


// loadMoreButton.addEventListener('click', () => {
//     offset += limit
//     const qtdRecordsWithNexPage = offset + limit

//     if (qtdRecordsWithNexPage >= maxRecords) {
//         const newLimit = maxRecords - offset
//         loadPokemonItens(offset, newLimit)

//         loadMoreButton.parentElement.removeChild(loadMoreButton)
//     } else {
//         loadPokemonItens(offset, limit)
//     }
// })



buttonAbout.addEventListener('click', () => {
    hideAllSelections();
    loadPokemonAbout(offset, limit);
    document.getElementById('about').style.display = 'block';
})

buttonBaseStatus.addEventListener('click', () => {
    hideAllSelections();
    loadPokemonBaseStats(offset, limit);
    document.getElementById('baseStats').style.display = 'block';
})

buttonEvolution.addEventListener('click', () => {
    hideAllSelections();
    document.getElementById('evolution').style.display = 'block';
})

buttonMoves.addEventListener('click', () => {
    hideAllSelections();
    document.getElementById('moves').style.display = 'block';
})

