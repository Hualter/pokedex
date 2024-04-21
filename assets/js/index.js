//Função para animação ao clicar para mudar de tela
document.getElementById('btnPokedex').addEventListener('click', function(event) {
    event.preventDefault();
    document.body.classList.remove('fade-in');
    document.body.classList.add('fade-out');
    
    setTimeout(function() {
        window.location.href = 'pokedex.html'; 
    }, 1000);
});

//Função para animação ao carregar a tela
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('fade-in');
});
