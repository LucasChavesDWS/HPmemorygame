let tablero = document.getElementById("cartas");
let aver = document.getElementsByTagName("cartita");
let reloj = document.getElementById("timer");
let int = document.getElementById("contador");
let allPersonajes = [];
let Cartas = [];
let contador = 0;
let intentos = 0;
let coincidencia = 0;
let temporizador=false;
let timer = 305;
let tiemporegresivo = null;
let selecciones=[];


//Descarga las cartas desde la API
function traerCartas() {
    fetch('https://hp-api.onrender.com/api/characters')
        .then((res) => res.json())
        .then((personajes) => {
            allPersonajes = personajes;
          });
}

traerCartas();
//Carga el mazo y lo muestra en el DOM
//inicializa el contador y el numero de intentos
function cargarMazo(){
    allPersonajes.forEach((personaje) => {
        if(personaje.image!=""){
            Cartas.push(personaje);
            Cartas.push(personaje);
            Cartas = Cartas.sort(function() {return Math.random() - 0.5});
        }});

        for(let index=0; index<50; index++){
            const a = document.createElement("cartita");
            a.innerHTML = `<div class="AreaCarta" >
                                <div class="carta" id="${index}" name="${Cartas[index].name}" onclick=seleccionCarta(id)>
                                    <div class="cara fondo"></div>
                                    <div class="cara frente" style="background-image: url(${Cartas[index].image})"></div>
                                </div>
                            </div>`;
            if (contador % 5 == 0) {
                tablero.innerHTML += "<br>";
            }
            contador++;
            tablero.appendChild(a);
        };
        document.getElementById("comenzar").disabled = true;
        if(temporizador == false){
            contarTiempo();
            temporizador = true;
        }
    }
        



//Elige una carta y envia su id
function seleccionCarta(indice){
    let cartai = document.getElementById(indice);
    console.log(indice);
    if(cartai.style.transform != "rotateY(180deg)"){
        cartai.style.transform ="rotateY(180deg)";
        selecciones.push(indice);
    }
    if(selecciones.length == 2){
        deseleccionar(selecciones);
        
        intentos ++;
        selecciones=[];
    }
}
//Deselecciona las cartas si no tuvieron coincidencia
//O las bloquea si coincidieron 
function deseleccionar(selecciones){
    setTimeout(()=>{
        let comp1 = document.getElementById(selecciones[0]).attributes.name;
        let comp2 = document.getElementById(selecciones[1]).attributes.name;
        console.log(comp1); console.log(comp2); 
        if(comp1.textContent  != comp2.textContent ){
            let comp1 = document.getElementById(selecciones[0]);
            let comp2 = document.getElementById(selecciones[1]);
            comp1.style.transform="rotateY(0deg)";
            comp2.style.transform="rotateY(0deg)";

        }else{
            coincidencia ++;
            console.log("coincidencia");
            document.getElementById(selecciones[0]).setAttribute('disabled', true);
            document.getElementById(selecciones[0]).style.opacity = 0.5;
            document.getElementById(selecciones[0]).style.cursor = `no-drop`;
            document.getElementById(selecciones[1]).setAttribute('disabled', true);
            document.getElementById(selecciones[1]).style.opacity = 0.5;
            document.getElementById(selecciones[1]).style.cursor =`no-drop`;
            document.getElementById(selecciones[0]).style.transform="rotateY(180deg)";
            document.getElementById(selecciones[1]).style.transform="rotateY(180deg)";
        }
    },2000);
}   


//Cuenta y checkea cada 1 segundo si se gano o perdio
function contarTiempo(){
    tiemporegresivo =  setInterval(()=>{
        timer--;
        reloj.innerHTML = `Time: ${timer} seconds`;
        int.innerHTML = `Attempts: ${intentos}`;
        if(timer == 0){
            clearInterval(tiemporegresivo);
            tablero.innerHTML = `Time Out \n Do you want to play again?
            <button onclick=location.reload()>Si</button>`;
        }else if(coincidencia == 25){
            clearInterval(tiemporegresivo);
            int.innerHTML="";
            reloj.innerHTML=`<h1>Congratulations, YOU WON!</h1>\n <h2>Your number of attempts was: ${intentos}</h2><br>
            <br>Your time was: ${timer} seconds.<br><br>Do you want to play again?
            <button onclick=location.reload()>Yes</button>`;
            tablero.innerHTML = ``;
        }
    },1000)
}

