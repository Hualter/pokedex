const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10;
let offset = 0;

//Função para carregar os Pokemons na tela
function convertPokemonToLi(pokemon) { 
    return `
        <li id="${pokemon.number}" class="pokemon ${pokemon.type}" data-pokemon='${JSON.stringify(pokemon)}'>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"
                alt="${pokemon.name}">
            </div>
        </li>
    `
}

//Função para carregar mais pokémons
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

// Seletor para o elemento de carregamento
const loadingSpinner = document.getElementById('loading-spinner');

//Função para carregar mais pokémons com scroll
window.addEventListener('scroll', () => {
    if (isSearching) {
        console.log("Skipping load due to ongoing search");
        return;
    }
    console.log("Evento de rolagem detectado");
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const totalHeight = document.documentElement.scrollHeight;
    const visibleHeight = window.innerHeight;
    const errorMargin = 100; // Margem de erro para ativar o carregamento
        // Verifica se o usuário rolou até o final da página
            if (scrollPosition + visibleHeight >= totalHeight - errorMargin) {
                // Exibe o ícone de carregamento
                console.log("Exibindo o ícone de carregamento");
                loadingSpinner.classList.remove('d-none');
                
                // Atualiza o offset e calcula a quantidade de itens na próxima página
                offset += limit;
                const qtdRecordsWithNexPage = offset + limit;

                // Define as funções de callback para sucesso e erro
                const successCallback = () => {
                    console.log("Carregamento concluído, ocultando o ícone de carregamento");
                    // Oculta o ícone de carregamento
                    loadingSpinner.classList.add('d-none');
                };

                const errorCallback = (error) => {
                    // Oculta o ícone de carregamento mesmo em caso de erro
                    console.error("Erro ao carregar os itens:", error);
                    loadingSpinner.classList.add('d-none');
                };

                if (qtdRecordsWithNexPage >= maxRecords)
                {
                    loadingSpinner.classList.add('d-none');
                }
                    // Carrega os itens com base em `qtdRecordsWithNexPage` e `maxRecords`
                    if (qtdRecordsWithNexPage >= maxRecords) {
                        const newLimit = maxRecords - offset;
                        console.log(`Carregando com offset ${offset} e newLimit ${newLimit}`);
                        loadPokemonItens(offset, newLimit)
                            .then(successCallback)
                            .catch(errorCallback);
                            loadingSpinner.classList.add('d-none');
                    } else {
                        console.log(`Carregando com offset ${offset} e limit ${limit}`);
                        loadPokemonItens(offset, limit)
                            .then(successCallback)
                            .catch(errorCallback);
                    }
                }
});

let currentPokemonIndex = 0;

//Função para mostrar detalhes do Pokémon atual com modal bootstrap
function showPokemonModal(pokemonData) {
    const modal = new bootstrap.Modal(document.getElementById('pokemonModal'), {
        backdrop: false, // Impede o fechamento ao clicar fora do modal
    });

    // Atualiza o currentPokemonIndex com o índice correto
    currentPokemonIndex = pokemonData.id - 1;

    // Preenche o conteúdo do modal com os detalhes do Pokémon
    const modalBody = document.getElementById('pokemonModalBody');
    modalBody.innerHTML = `
        <div class="row pokemon ${pokemonData.type}">
            <div class="modal-header" id="pokemonModalHeader">
                <h2 class="modal-title">${pokemonData.name} - #${pokemonData.number}</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="pokemonImgDetail">
                <img height="250" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png
                " alt="${pokemonData.name}">
            </div>
            <div class="moredetail">
                <table class="table table-bordered table-striped table-sm">
                    <thead>
                        <tr class="pokemonSobre">
                            <th colspan="3">Sobre</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tipo</td>
                            ${pokemonData.types.map((type) => `<td class="type ${type}">${type}</td>`).join('')}
                        </tr>
                        <tr>
                            <td colspan="1">Espécie</td>
                            <td colspan="2">${pokemonData.species}</td>
                        </tr>
                        <tr>
                            <td  colspan="1">Altura</td>
                            <td colspan="3">${pokemonData.height} ft</td>
                        </tr>
                        <tr>
                            <td colspan="1">Peso</td>
                            <td colspan="3">${pokemonData.weight} lb</td>
                        </tr>
                        <tr>
                            <td colspan="1">Habilidades</td>
                            <td colspan="3">${pokemonData.abilities}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="buttonContainer">
            <button id="previousPokemonButton" class="btn bi bi-arrow-left-square-fil"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
            <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
          </svg></button>
            <button id="nextPokemonButton" class="btn bi bi-arrow-right-square-fill"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
            <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1"/>
          </svg></button>
        </div>
        `;
    modal.show();

    //Atualiza visibilidade dos botões de navegação
    updateButtonVisibility();

    // Adiciona listeners de evento aos botões de navegação
    document.getElementById('previousPokemonButton').addEventListener('click', goToPreviousPokemon);
    document.getElementById('nextPokemonButton').addEventListener('click', goToNextPokemon);
    
    const previousButton = document.getElementById('previousPokemonButton');
    const nextButton = document.getElementById('nextPokemonButton');

    //Verificar se é possivel ir para pokémon anterior ou proximo e alterar a visibilidade do botão
    if(currentPokemonIndex === 0){
        previousButton.style.display = 'none';}
    if(currentPokemonIndex === pokemonList.children.length - 1){
        nextButton.style.display = 'none';
    }
        
    // Função para navegar para o Pokémon anterior
    function goToPreviousPokemon() {
        if (currentPokemonIndex > 0) {
            currentPokemonIndex--;
            const previousPokemonElement = pokemonList.children[currentPokemonIndex];
            const previousPokemonData = JSON.parse(previousPokemonElement.getAttribute('data-pokemon'));
            showPokemonModal(previousPokemonData); // Mostra o Pokémon anterior no modal
        } else {
            console.warn('Não é possível navegar para o Pokémon anterior. currentPokemonIndex está no início da lista.');
        }
    }

    // Função para navegar para o próximo Pokémon
    function goToNextPokemon() {
        if (currentPokemonIndex < pokemonList.children.length - 1) {
            currentPokemonIndex++;
            const nextPokemonElement = pokemonList.children[currentPokemonIndex];
            const nextPokemonData = JSON.parse(nextPokemonElement.getAttribute('data-pokemon'));
            showPokemonModal(nextPokemonData); // Mostra o próximo Pokémon no modal
        } else {
            console.warn('Não é possível navegar para o próximo Pokémon. currentPokemonIndex está no final da lista.');
        }
    }
    
    modalElement = document.getElementById('pokemonModal');
    modalElement.addEventListener('hidden.bs.modal', function () {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
    });
    
}

// Controlar a visibilidade dos botões com base no estado isSearching
function updateButtonVisibility() {
    const previousButton = document.getElementById('previousPokemonButton');
    const nextButton = document.getElementById('nextPokemonButton');

    if (isSearching) {
        previousButton.style.display = 'none';
        nextButton.style.display = 'none';
    } else {
        previousButton.style.display = 'block';
        nextButton.style.display = 'block';
    }
}

//Verificar se começou a pesquisa para alterar os botões navegação
function startSearch() {
    isSearching = true;
    updateButtonVisibility(); 
}

//Verificar se finalizou a pesquisa para alterar os botões navegação
function finishSearch() {
    isSearching = false;
    updateButtonVisibility(); 
}

//Função para chamar a função do modal quando clicar no pokémon
pokemonList.addEventListener('click', function(event) {
    const clickedPokemon = event.target.closest('.pokemon');
    if (clickedPokemon) {
        const pokemonData = JSON.parse(clickedPokemon.getAttribute('data-pokemon'));
        showPokemonModal(pokemonData);
    }
});

// Variável de controle para indicar se uma pesquisa está em andamento
let isSearching = false;

const searchButton = document.getElementById('pokemonSearchButton');
const searchInput = document.getElementById('pokemonSearchInput');

//Função para barra de pesquisa
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    searchPokemonByName(searchTerm);
});

// Função para pesquisar pokémons
function searchPokemonByName(searchTerm) {
    console.log("Starting search for term:", searchTerm);
    isSearching = true;
    console.log("isSearching set to true");
    // Se o termo de pesquisa estiver vazio, carregue todos os pokémons novamente
    if (searchTerm === '') {
        isSearching = false;
        loadAllPokemons();
        return;
    }
    
    // Limpe a lista atual de pokémons
    pokemonList.innerHTML = '';
    
    // Carregue todos os pokémons e filtre com base no termo de pesquisa
    pokeApi.getPokemons(0, maxRecords)
        .then((pokemons) => {
            // Filtra os pokémons com base no termo de pesquisa
            const filteredPokemons = pokemons.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm)
            );
            
            // Converta pokémons filtrados em HTML e adicione à lista
            const newHtml = filteredPokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML = newHtml;
            
        })
        .catch((error) => {
            console.error("Erro ao carregar os pokémons:", error);
            // Pesquisa concluída, mesmo em caso de erro
            isSearching = false;
        });
}

let allPokemons = [];

// Carregar todos os pokémons e armazená-los em uma variável global
function loadAllPokemons() {
    pokeApi.getPokemons(0, maxRecords).then((pokemons) => {
        allPokemons = pokemons;
        displayPokemons(allPokemons);
    });
}


// Filtrar a lista de Pokémon com base no termo de pesquisa
function filterPokemons(searchTerm) {
    const filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );
    // Exiba os Pokémon filtrados
    displayPokemons(filteredPokemons);

    // Se o termo de pesquisa estiver vazio, recarregue todos os Pokémon e redefina o offset
    if (searchTerm.trim() == '') {
        isSearching = false;
        displayPokemons(allPokemons);
        offset = 0;
    }
}

//Verificar mudanças na barra de pesquisa
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    filterPokemons(searchTerm);
});

//Recarregar lista de pokémons
function loadAllPokemons() {
    offset = 0;
    pokemonList.innerHTML = '';
    loadPokemonItens(offset, limit);
}

const btnHelp = document.getElementById('btnHelp');

//Função para botão de ajuda
btnHelp.addEventListener('click', (event)=>{
    const modal = new bootstrap.Modal(document.getElementById('helpModal'), {
        backdrop: false,
    });

    const modalBody = document.getElementById('helpModalBody');
    modalBody.innerHTML = `
    <div class="row help">
        <div class="modal-header" id="helpModalHeader">
            <h2 class="modal-title">Você Pediu Ajuda?</h2>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class"help">
            <p>Use o scroll do mouse para baixo para carregar mais pokémons;</p>
            <p>Você pode clicar em um pokémon para ver mais detalhes;</p>
            <p>Use a barra de pesquisa para pesquisar um pokémon pelo seu nome.</p>
        </div>
    </div>
    `;
    
    modal.show();
});