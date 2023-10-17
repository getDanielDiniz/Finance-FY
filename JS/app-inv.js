const formularioPerfil = document.querySelector('#formPerfilInv');
const detailsPerfil = document.querySelector('summary');

formularioPerfil.addEventListener('submit' , (evento) => {
    evento.preventDefault();
    perfilInvestidor()
})

function perfilInvestidor () {
    var marcadas = [];
    var numResInv = 0;
    marcadas = (document.querySelectorAll('.multiplaEsc:checked'));
    
    if (marcadas.length < 5) {
        alert('Favor preencher todas as perguntas')
    }
    else{
        for (var i = 0 ; i < marcadas.length ; i++){
            numResInv += parseInt(marcadas[i].value);
        }
        detailsPerfil.innerHTML = classificaInvestidor(numResInv);
        alert(`Seu perfil de investidor é: ${classificaInvestidor(numResInv)}. \nPesquise sobre o seu perfil e conheça as formas de investir que combine com você!`)
    }

}

function classificaInvestidor(total) {
    var perfil = ""
   
        if (total <= 7){ 
            perfil = "Conservador";
        }
        else if (total > 7 && total <= 11){
            perfil = "Moderado"
        }
        else if ( total > 11 && total <= 15) {
            perfil = "Arrojado";
        }
        else if ( total > 15  ) {
            perfil = "Agressivo";
        }
    
    return(perfil);
}