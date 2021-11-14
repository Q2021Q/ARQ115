//Variables Globales
var velocidadRot=0;
var difCilindros=0, tiempoBusq, sectoresRecorridos, sectXPista;
var tiempoRot;
var cil1, cab1, sec1;
var cil2, cab2, sec2;

function convertVelRotacional(){ //Funcion que convierte de RPH y RPM a RPS.
	var velRot = document.getElementById("txtVelRot").value;
	var myselect = document.getElementById("selectVelRot").value;
	
	switch(myselect){		
		case "RPS": velocidadRot =velRot;
		break;
		case "RPM": velocidadRot=velRot/60;
		break;
		case "RPH": velocidadRot=velRot/3600;
		break;
		default : alert("No hay problem :v")
		break;
	}
	//alert("La velocidad Rotacional es: "+velocidadRot+" RPS");
	document.getElementById("tiempoRotacional4").innerHTML = 'La velocidad Rotacional es: '+velocidadRot+' RPS';
}

function ubicacionesDisco(){ //Funcion que establece los Cilindros, Cabezas y Sectores en la "Tabla de Datos"
convertVelRotacional();
var res1, res2;
var platos=document.getElementById("txtPlatos").value;
var cilindros=document.getElementById("txtCilindros").value;
sectXPista=document.getElementById("txtSectXPista").value;
tiempoBusq=document.getElementById("txtTiempoBusq").value;
var pet1 =document.getElementById("txtPet1").value;
var pet2 =document.getElementById("txtPet2").value;

tiempoRot = ((1/velocidadRot)/sectXPista)*(Math.pow(10,3));
tiempoRot = tiempoRot.toFixed(2);
//alert("El tiempo Rotacional es: "+tiempoRot);
document.getElementById("tiempoRotacional").innerHTML = 'El tiempo rotacional es: '+tiempoRot+' ms';

	//Operaciones para la Primera Peticion
	res1 = pet1%(sectXPista*platos*2);
	cil1 = (pet1-res1)/(sectXPista*platos*2);
	sec1 = res1%sectXPista;
	cab1 = (res1-sec1)/sectXPista;
	
	//Operaciones para la Segunda Peticion
	res2 = pet2%(sectXPista*platos*2);
	cil2 = (pet2-res2)/(sectXPista*platos*2);
	sec2 = res2%sectXPista;
	cab2 = (res2-sec2)/sectXPista;
	
	//alert("cilindro: "+cil1+" Cabeza: "+cab1+" Sector: "+sec1);	
	//Primera fila de la "Tabla de Datos"
	document.getElementById("celda1").innerHTML = pet1;
	document.getElementById("celda2").innerHTML = cil1;
	document.getElementById("celda3").innerHTML = cab1;
	document.getElementById("celda4").innerHTML = sec1;
	
	//alert("cilindro: "+cil2+" Cabeza: "+cab2+" Sector: "+sec2);
	//Segunda fila de la "Tabla de Datos"
	document.getElementById("celda5").innerHTML = pet2;
	document.getElementById("celda6").innerHTML = cil2;
	document.getElementById("celda7").innerHTML = cab2;
	document.getElementById("celda8").innerHTML = sec2;
}

function tiempoTotalBusq(){
	if(txtPlatos.value==='' || txtPlatos.value==='0'){
		toastr.warning('Debe ingresar el numero de platos', {timeOut: 4000});
	}else if(txtCilindros.value==='' || txtCilindros.value==='0'){
		toastr.warning('Debe ingresar los cilindros', {timeOut: 4000});
	}else if(txtSectXPista.value==='' || txtSectXPista.value==='0'){
		toastr.warning('Debe ingresar los sectores por pista', {timeOut: 4000});
	}else if(txtTiempoBusq.value==='' || txtTiempoBusq.value==='0'){
		toastr.warning('Debe ingresar el tiempo de búsqueda', {timeOut: 4000});
	}else if(txtVelRot.value==='' || txtVelRot.value==='0'){
		toastr.warning('Debe ingresar la velocidad rotacional', {timeOut: 4000});
	}else if(selectVelRot.value==='' || selectVelRot.value==='0'){
		toastr.warning('Escoja el tipo de revoluciones', {timeOut: 4000});
	}else if(txtPet1.value==='' || txtPet1.value==='0'){
		toastr.warning('Debe ingresar la primera petición', {timeOut: 4000});
	}else if(txtPet2.value==='' || txtPet2.value==='0'){
		toastr.warning('Debe ingresar la segunda petición', {timeOut: 4000});
	}else if(txtPet1.value===txtPet2.value){
		toastr.warning('Las peticiones deben ser diferentes', {timeOut: 4000});
	}else{
		ubicacionesDisco();
		difCilindros=Math.abs(cil1-cil2);
		var tiempoDeCil = difCilindros * tiempoBusq;
		tiempoDeCil = tiempoDeCil.toFixed(2);
		//alert("Tiempo de Cilindros: "+tiempoDeCil);
		document.getElementById("tiempoRotacional2").innerHTML = 'El tiempo de cilindros: '+tiempoDeCil+' ms';
		sectoresRecorridos = tiempoDeCil/(tiempoRot);
		sectoresRecorridos = sectoresRecorridos.toFixed();

		//alert("Sectores Recorridos: "+sectoresRecorridos);
		document.getElementById("tiempoRotacional3").innerHTML = 'La cantidad de sectores recorridos es: '+sectoresRecorridos+' sectores';
		var desp=recursividad(sectoresRecorridos);

		if(((sec1+desp)< sectXPista)&&((sec1+desp)>sec2)){
			var tiempoDeSec = ((sectXPista - (sec1+desp))+sec2) * tiempoRot;
			
		}
		if((sec1+desp)< sec2){
			var tiempoDeSec = (sec2 - (sec1+desp)) * tiempoRot;
			
		}

		//alert("Tiempo de Sectores: "+tiempoDeSec);
		document.getElementById("tiempoRotacional4").innerHTML = 'Tiempo de sectores es: '+tiempoDeSec+' ms';
		var tiempoTotBusq = (tiempoDeSec + (difCilindros * tiempoBusq));
		//alert("Tiempo Total: "+tiempoTotBusq);
		document.getElementById("tiempoRotacional5").innerHTML = '<h3>Tiempo total de búsqueda: '+tiempoTotBusq+' ms</h3>';
	}//fin else
}

function recursividad(sectRec){
	var secR;
	if(sectRec<sectXPista){
		return secR=sectRec;
	}
	else{
		secR=recursividad(sectRec-sectXPista);
	}
	return secR;
}

function limpiarCls(){
	document.getElementById("txtPlatos").value = "";
	document.getElementById("txtCilindros").value = "";
	document.getElementById("txtSectXPista").value = "";
	document.getElementById("txtTiempoBusq").value = "";
	document.getElementById("txtVelRot").value = "";
	document.getElementById("selectVelRot").value = "";
	document.getElementById("txtPet1").value = "";
	document.getElementById("txtPet2").value = "";
	document.getElementById("tiempoRotacional").innerHTML = '';
	document.getElementById("tiempoRotacional2").innerHTML = '';
	document.getElementById("tiempoRotacional3").innerHTML = '';
	document.getElementById("tiempoRotacional4").innerHTML = '';
	document.getElementById("tiempoRotacional5").innerHTML = '';
}

