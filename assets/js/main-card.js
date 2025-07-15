document.addEventListener('DOMContentLoaded', () => {    
    const pokemonList = document.getElementById('pokemonList');
    const about = document.getElementById('about');
    const baseStats = document.getElementById('baseStats');
    const loadMoreButton = document.getElementById('loadMoreButton');
    const buttonAbout = document.getElementById('buttonAbout');
    const buttonBaseStatus = document.getElementById('buttonBaseStatus');
    const buttonEvolution = document.getElementById('buttonEvolution');
    const buttonMoves = document.getElementById('buttonMoves');

    // Recupera o ID do Pokémon salvo no localStorage
    const pokemonId = localStorage.getItem('selectedPokemonId');

    if (!pokemonId) {
        alert("Nenhum Pokémon selecionado.");
        window.location.href = "index.html";
    }

    // Buscar os dados do Pokémon e exibir o card
    pokeApi.getPokemonById(pokemonId).then((pokemon) => {
        displayPokemonCard(pokemon);
        setupTabs(pokemon);
    });

    // Função para renderizar o card principal
    function displayPokemonCard(pokemon) {
        const html = `
            <li class="pokemon ${pokemon.type}">
                <div class="buttons-header">
                    <img class="button-header" src="./assets/images/de-volta.png" alt="voltar" onclick="window.history.back()">
                    <img class="button-header" src="./assets/images/favorito.png" alt="favorito">
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
        `;
        pokemonList.innerHTML = html;
    }

    // Esconde todas as seções
    function hideAllSelections() {
        about.style.display = 'none';
        baseStats.style.display = 'none';
        document.getElementById('evolution').style.display = 'none';
        document.getElementById('moves').style.display = 'none';
    }

    // Configura os botões "About", "Base Stats" etc.
    function setupTabs(pokemon) {
        const buttons = [
            buttonAbout,
            buttonBaseStatus,
            buttonEvolution,
            buttonMoves
        ];
        function setActive(button) {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }

        buttonAbout.addEventListener('click', () => {
            hideAllSelections();
            loadPokemonAbout(pokemon);
            about.style.display = 'block';
            setActive(buttonAbout);
        });

        buttonBaseStatus.addEventListener('click', () => {
            hideAllSelections();
            loadPokemonBaseStats(pokemon);
            baseStats.style.display = 'block';
            setActive(buttonBaseStatus);
        });

            buttonEvolution.addEventListener('click', () => {
            hideAllSelections();
            // Aqui vai a lógica de carregamento da aba "evolution"
            document.getElementById('evolution').style.display = 'block';
            setActive(buttonEvolution);
        });

        buttonMoves.addEventListener('click', () => {
            hideAllSelections();
            // Aqui vai a lógica de carregamento da aba "moves"
            document.getElementById('moves').style.display = 'block';
            setActive(buttonMoves);
        });

        // Ativa a aba padrão ao carregar (ex: About)
        setActive(buttonAbout);
    }

    // Carrega aba "About"
    function loadPokemonAbout(pokemon) {
        pokeApi.getPokemonSpecies(pokemon).then(({ speciesName, genderRate, egg_group, eggCycle }) => {
            let genderText = 'Genderless';
            if (genderRate !== -1) {
                const percentFemale = (genderRate / 8) * 100;
                const percentMale = 100 - percentFemale;
                genderText = `♂ ${percentMale.toFixed(1)}% / ♀ ${percentFemale.toFixed(1)}%`;
            }

            const html = `
                <div class="about">
                    <br>
                    <p><b>About</b></p>
                    <p>Species: ${speciesName}</p>
                    <p>Height: ${pokemon.height}</p>
                    <p>Weight: ${pokemon.weight}</p>
                    <p>Ability: ${pokemon.abilities.join(', ')}</p>

                    <h3>Breeding</h3>
                    <p>Gender: ${genderText}</p>
                    <p>Egg Group: ${egg_group.join(', ')}</p>
                    <p>Egg Cycle: ${eggCycle} x 255 = ${eggCycle * 255}</p>
                </div>
            `;
            about.innerHTML = html;
        });
    }

    // Carrega aba "Base Stats"
    function loadPokemonBaseStats(pokemon) {
        const total = pokemon.hp + pokemon.attack + pokemon.defense +
                    pokemon.specialAttack + pokemon.specialDefense + pokemon.speed;

        const html = `
            <div class="baseStats">
                <br>
                <p><b>Base Stats</b></p>
                <p>HP: ${pokemon.hp}</p>
                <p>Attack: ${pokemon.attack}</p>
                <p>Defense: ${pokemon.defense}</p>
                <p>Sp. Attack: ${pokemon.specialAttack}</p>
                <p>Sp. Defense: ${pokemon.specialDefense}</p>
                <p>Speed: ${pokemon.speed}</p>
                <p>Total: ${total}</p>
            </div>
        `;
        baseStats.innerHTML = html;
    }
});