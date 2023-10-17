const despesaRecorrentes = [];
const totalStorage_Simu = JSON.parse(localStorage.getItem('total'));
const itemStorage_Simu = JSON.parse(localStorage.getItem('item'));
const formCadSimu = document.querySelector('#listaCadSimu'); 
const listaRelSimu = document.querySelector('#listaRelSimu'); 

var despesaSimu = 0;
var economiaSimu = 0;
var remanescenteSimu = 0;

formCadSimu.addEventListener('submit' , (evento) => {
    evento.preventDefault()
    listaRelSimu.innerHTML = ""
    
    
    despesaRecorrentes.forEach(element => {        
        var valorFloat = parseFloat(evento.target[element.nome].value);
        valorFloat = valorFloat.toFixed(2);
        
        const index = itemStorage_Simu.findIndex(elementoIndex => element.id === elementoIndex.id);
        
        if (valorFloat >= 0) {
            itemStorage_Simu[index].valor = valorFloat; 
            
            evento.target[element.nome].setAttribute('placeHolder' , "Valor Atual: R$ " + valorFloat);
            evento.target[element.nome].value = "";
        }

    })

    totalStorage_Simu.forEach(element => {
        var valorFloatEco = parseFloat(evento.target[element.nome].value);
        valorFloatEco = valorFloatEco.toFixed(2);
        
        const indexSubstitui = totalStorage_Simu.findIndex(item => item.mes === element.mes);
        
        if (element.mes === mesAtual && valorFloatEco >= 0){    
            totalStorage_Simu[indexSubstitui].economiaMen = valorFloatEco;
            
            evento.target[element.nome].setAttribute('placeHolder' , "Valor Atual: R$ " + valorFloatEco);
            evento.target[element.nome].value = "";
        }
    })

    rel_Simu();
})

//função chamada em app-relatorio.js
function criaCad_Simu() {
    itemStorage.forEach(element => {
        var contador = 0;

        
        for (var i = 0; i < itemStorage.length ; i++) {

            if (element.nome === itemStorage[i].nome && element.tipo === "despesa") {
                contador += 1;
            }
        }

        if (contador > 1 && element.mes === mesAtual){
            const itemSimu = {
                "nome" : element.nome,
                "valor" : element.valor,
                "id": element.id
            }

            despesaRecorrentes.push(itemSimu);
            constroiItem_Simu(itemSimu, listaCadSimu);
            
        }
    })

    criaEconomia();
    botaoSimular();
}

function constroiItem_Simu (itemSimu , lista) {
    const divAgrupa = document.createElement('div')
    const listItem = document.createElement('label');
    const campoCad = document.createElement('input');
    
    campoCad.classList.add('campoCadastro');
    campoCad.classList.add('itemContainer');
    campoCad.setAttribute('id' , itemSimu.id);
    campoCad.setAttribute ('placeHolder' , "Valor Atual: R$ " + itemSimu.valor);
    campoCad.type="number";
    campoCad.name=itemSimu.nome;
    listItem.setAttribute('for' , itemSimu.nome);
    divAgrupa.classList.add('itemRelatorio');
    divAgrupa.classList.add('itemContainer');
    
    listItem.innerHTML = itemSimu.nome;
    divAgrupa.appendChild(listItem);
    divAgrupa.appendChild(campoCad);
    lista.appendChild(divAgrupa);
}

function rel_Simu() {
    despesaSimu = 0;
    economiaSimu = 0;
    remanescenteSimu = 0;

    itemStorage_Simu.forEach(element => {
        if(element.mes === mesAtual){
            if (element.tipo === 'despesa' || element.tipo === 'resgate'){
            despesaSimu += parseFloat(element.valor);
            }
            else if (element.tipo === 'receita') {
                remanescenteSimu += parseFloat(element.valor);
            }
        }    
    })

    totalStorage_Simu.forEach(element => {
        if (element.mes === mesAtual){
            economiaSimu += parseFloat(element.economiaMen);
        } 
    })

    remanescenteSimu -= (despesaSimu + economiaSimu);
    
    despesaSimu = despesaSimu.toFixed(2);
    economiaSimu = economiaSimu.toFixed(2);
    remanescenteSimu = remanescenteSimu.toFixed(2);

    constroiItem(despesaSimu , "Despesas:" , listaRelSimu);
    constroiItem(economiaSimu , "Economia:", listaRelSimu);
    constroiItem(remanescenteSimu , "Remanescente:", listaRelSimu);
}


function criaEconomia () {

    totalStorage_Simu.forEach(element => {
        if (element.mes === mesAtual){    
            const economiaObjeto = {
                "nome" : "Economia:",
                "valor" : element.economiaMen,
                "mes" : element.mes
            }

            constroiItem_Simu(economiaObjeto , listaCadSimu);
        }
    })

}

function botaoSimular() {
    
    //<button type="submit" class="botao itemContainer" id="submitSimu">Simular</button>
    const botao = document.createElement('button');
    botao.type="submit";
    botao.classList.add('botao');
    botao.classList.add('itemContainer');
    botao.setAttribute('id' , "submitSimu");
    botao.innerHTML = "Simular"
    
    listaCadSimu.appendChild(botao);
}