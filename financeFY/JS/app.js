const formulario = document.querySelector('#formularioCad');
const botaoPrincipal = document.querySelector('#botaoPrincipal');
const listaDespesa = document.querySelector('#despesas');
const listaReceita = document.querySelector('#receitas');
const listaEconomia = document.querySelector('#economia');
const listaMes = document.querySelector('#listaMes');
const totalRemanescente = document.querySelector('#totalRemanescente');
const mostraDespesa = document.querySelector('#totalDespesa');
const mostraReceita = document.querySelector('#totalReceita');
const mostraEconomia = document.querySelector('#totalEconomia');

//Variáveis que guardam os campos preenchiveis
var valor;
var nome;

var mesVig = "";
var totalDespesa = 0;
var totalReceita = 0;
var totalEconomia = 0;
var economiaMen = 0;
var totalRem = 0;
var despesaRem = 0;

const storage = JSON.parse(localStorage.getItem('item')) || [];
const totalStorage = JSON.parse(localStorage.getItem('total')) || [];
const economiaStorage = JSON.parse(localStorage.getItem('economia')) || [];

listaMes.addEventListener('click' , (evento) => {
    mesVig = evento.target.value;

    listaDespesa.innerHTML = "";
    listaReceita.innerHTML = "";
    listaEconomia.innerHTML = "";
    calculaTotal("clickMudaMes")

    storage.forEach((element) =>{

        if(element.mes === mesVig){
            criaItem(element);
        }
    })
})

formulario.addEventListener('submit' , (evento) => {
    evento.preventDefault();
    valor = evento.target['valor'];
    nome = evento.target['nome'];
    const tipo = evento.target['tipo'];
    const valorFloat = parseFloat(valor.value)
    //construindo e adicionando o item
    const item = {
        "nome" : (nome.value).toUpperCase() ,
        "valor" : valorFloat.toFixed(2),
        "tipo" : tipo.value,
        "mes" : mesVig
    }
    
    const procuraExistente = storage.find(element => element.nome === item.nome && element.mes === item.mes && element.tipo === item.tipo);
   
    if (item.mes === ""){
        alert("Favor selecionar um mês!");
    }
    else {
        if (procuraExistente){
            item.id = procuraExistente.id;
            atualizaItem(item);
        }
        else {
            item.id = storage[storage.length -1] ? (storage[storage.length -1]).id + 1 : 0; 
            
            criaItem(item);
            storage.push(item);
            calculaTotal();   
            
            valor.value = "";
            nome.value = "";
        }
    }
    

    // **LocalStorage**
    const json = JSON.stringify(storage);
    localStorage.setItem("item" , json);
    
})

function criaItem(item) {

    //Essa função é responsável por criar o Elemento
        const novoItem = document.createElement('li');
        const divValor = document.createElement('div');

        divValor.dataset.id = item.id;
        
        novoItem.classList.add("itemCadastrado");
        divValor.classList.add("reais");
        divValor.innerHTML = item.valor;
        novoItem.innerHTML += item.nome;
        novoItem.appendChild(divValor);
        novoItem.appendChild(botaoDelet(item.id));
        
        if (item.mes === mesVig){
            if(item.tipo === 'despesa' || item.tipo === 'resgate'){
                listaDespesa.appendChild(novoItem);
                
            }
            else if (item.tipo === 'receita'){
                listaReceita.appendChild(novoItem);
            }
            else {
                listaEconomia.appendChild(novoItem)
            }
        }
    }

    
function calculaTotal(quemChamou) {

    totalDespesa = 0;
    despesaRem = 0;
    totalReceita = 0;
    totalEconomia = 0;
    economiaMen = 0;
    totalRemanescente.innerHTML =  "";
    mostraDespesa.innerHTML = "";
    mostraEconomia.innerHTML = "";
    
    storage.forEach((element) => {
        
        const valorFloat = parseFloat(element.valor);
        if (element.mes === mesVig){
            if(element.tipo === 'despesa'){
                totalDespesa += valorFloat;
                despesaRem += valorFloat;
            }
            else if(element.tipo === 'receita') {
                totalReceita += valorFloat;
            }
            else if (element.tipo === 'economiaMen') {
                economiaMen += valorFloat;
            }
            else if (element.tipo === 'resgate') {
                totalDespesa += valorFloat;
                economiaMen -= valorFloat;
                
            }
            
        }

        //Para controlar o total no "banco" não pode seguir a condicional por mês
        if (element.tipo === 'economiaPrev' || element.tipo === 'economiaMen' ) {
            totalEconomia += valorFloat;
        }
        else if (element.tipo === 'resgate') {
            totalEconomia -= valorFloat;
        }
    })

        totalReceita = totalReceita.toFixed(2);
        totalDespesa = totalDespesa.toFixed(2);
        totalEconomia = totalEconomia.toFixed(2);
        totalRem = (totalReceita - despesaRem).toFixed(2);
        economiaMen = economiaMen.toFixed(2);

        mostraReceita.innerHTML = totalReceita;
        mostraDespesa.innerHTML = totalDespesa;
        mostraEconomia.innerHTML = totalEconomia;
        totalRemanescente.innerHTML =  totalRem;

    const existeMes = totalStorage.findIndex(element => element.mes === mesVig)

    var itemTotal = {
        "totalReceita":totalReceita,
        "totalDespesa": totalDespesa,
        "totalRem": totalRem,
        "economiaMen" : economiaMen,
        "mes": mesVig
    }

    if (quemChamou !== "clickMudaMes"){
        if (existeMes >= 0) {
            totalStorage[existeMes] = itemTotal;
            localStorage.setItem("total" , JSON.stringify(totalStorage));
        }
        else {
            totalStorage.push(itemTotal);
            localStorage.setItem("total" , JSON.stringify(totalStorage));
        }
    }
}

function atualizaItem(item) {
    document.querySelector("[data-id='"+item.id+"']").innerHTML = item.valor;

    storage[storage.findIndex(elemento => elemento.id === item.id )] = item;
    const json = JSON.stringify(storage);
    localStorage.setItem("item" , json);

    calculaTotal();
    
    valor.value = "";
    nome.value = "";
}

function botaoDelet(id) {
    const botao = document.createElement('button');
    botao.classList.add('botaoDelet');
    botao.innerHTML = "Excluir";

    botao.addEventListener('click' , function() {
        deletaItem(this.parentNode , id);
    })

    return(botao)
}

function deletaItem(item, id) {
    item.remove();

    storage.splice(storage.findIndex(elemento => elemento.id === id) , 1);
    
    calculaTotal();
    
    const json = JSON.stringify(storage);
    localStorage.setItem("item" , json);
}
