	var peticion=[];			
	var i=0;
	var total=0;
	var chartData=[];
	var arre=[];
	var x = 0;
	var posicion_actual = 0.1;
	var posicion_arreglo = 0;


	function cambiar(){
		if(limite.value==='calculado'){
			$("#manual").hide(500);
			$("#conDatos").show(500);
		}else if(limite.value==='manual'){
			$("#conDatos").hide(500);
			$("#manual").show(500);
		}
		
	}

	function capturarLimite(){
		var valor=0;
		if(limite.value==='calculado'){
			plato = txtPlatos.value;
			cilindros = txtCilindros.value;
			sectores = txtSectXPista.value;

			valor=((plato*2*cilindros*sectores)-1)
		}else if(limite.value==='manual'){
			valor = txtLimite.value;
		}
		return valor;
	}


	function capturar(){		
		var txt=$("#txtValor").val();

		valorX = capturarLimite();


		if(txt.length>0 && txt.length<=valorX.length && parseInt(txt) > -1&& parseInt(txt) <=valorX &&$("#txtResultado").val()!="" && $("#txtResultado").val()>-1){
			var label=document.createElement("label");
			var text=document.createTextNode(txt);
			var button=document.createElement("button")
			var span=document.createElement("span")			
			label.setAttribute("class","box");
			label.setAttribute("id","label"+i);
			var txt=$("#txtValor").val();

			if(txt.length==2){
				button.setAttribute("class","sinbordes2");
			}else{
				if(txt.length==3){
					button.setAttribute("class","sinbordes1");
				}
				else button.setAttribute("class","sinbordes3");
			}
			button.setAttribute("onclick","borrar("+i+");");
			span.setAttribute("class","fa fa-close");
			button.appendChild(span);
			label.appendChild(text);		
			label.appendChild(button);			
			document.getElementById("caja").appendChild(label);
			$("#txtValor").text("");	
			peticion[i]=txt;
			i++;
			algoritmo();
			$("#txtValor").val("");
			detener();
		}else{
			toastr.info('No puede introducir una petición menor o mayor al límite', {timeOut: 4000});
		}
		

	}//end capturar

	function validar(){
		x = capturarLimite();
		if(txtResultado.value===''){
			toastr.error('Debe establecer un sector inicial','Error', {timeOut: 4000});
		}else if((txtResultado.value)>x){
			toastr.error('El sector inicial no puede superar el límite','Error', {timeOut: 4000});
		}else if(limite.value===''){
			toastr.error('Debe elegir una forma de establecer el límite superior','Error', {timeOut: 4000});
		}else if(limite.value==='calculado'){
			if(txtPlatos.value==='' || txtPlatos.value==='0'){
				toastr.warning('Debe ingresar el numero de platos', {timeOut: 4000});
			}else if(txtCilindros.value==='' || txtCilindros.value==='0'){
				toastr.warning('Debe ingresar los cilindros', {timeOut: 4000});
			}else if(txtSectXPista.value==='' || txtSectXPista.value==='0'){
				toastr.warning('Debe ingresar los sectores por pista', {timeOut: 4000});
			}else{
				capturar();
			}
			
		}else if(limite.value==='manual'){
			if(txtLimite.value==='' || txtLimite.value==='0'){
				toastr.warning('Debe ingresar el límite de sectores', {timeOut: 4000});
			}else{
				capturar();
			}
			}//end else

		}


		function borrar(id){				
			$("#label"+id).remove();
			peticion[id]=-1;				
			algoritmo();

		}
		function algoritmo(){
			var arrayPet=[];
			var contador=0;
			var val=0;

			$("#idTbody").remove();
			var tbody=document.createElement("tbody");
			tbody.setAttribute("id","idTbody");
			document.getElementById("idTable").appendChild(tbody);
			for(c=0;c<i;c++){
				if(peticion[c]>-1){
					arrayPet[contador]=peticion[c];
					contador++;					
				}
			}
			var myselect = document.getElementById("selectOpt");
			var opcion=myselect.options[myselect.selectedIndex].value;

			switch(opcion){
				case "FCFS": arreglo=arrayPet;
				cont=contador;

				break;
				case "SSTF": arreglo= ordenamientoSstf(arrayPet);
				cont=contador;
				break;
				case "SCAN": arreglo=ordenamientoSL(arrayPet,1);
				cont=contador+2;
				break;
				case "C-SCAN":arreglo=ordenamientoScan(arrayPet);
				cont=contador+2;

				break;
				default :arreglo=ordenamientoSL(arrayPet,2);
				cont=contador;
				break
			}
			arre =arreglo;
			var chartData=[];
			for(m=0;m<arreglo.length;m++){
				if(m==0){
					var pet={};
					pet= new Object();
					pet={"peticion": "inicio", "expenses": $("#txtResultado").val()};			
					chartData=chartData.concat([pet])
				}
				var pet={};
				pet= new Object();
				pet={"peticion": m, "expenses": arreglo[m]};			
				chartData=chartData.concat([pet])
			}
			var chart = AmCharts.makeChart("chartdiv", {
				"type": "serial",
				"theme": "light",


				"handDrawn": true,
				"handDrawScatter": 3,
				"legend": {
					"useGraphSettings": true,
					"markerSize": 12,
					"valueWidth": 0,
					"verticalGap": 0
				},
				"dataProvider": chartData,
				"valueAxes": [{
					"minorGridAlpha": 0.08,
					"minorGridEnabled": true,
					"position": "top",
					"axisAlpha": 0
				}],
				"startDuration": 1,
				"graphs": [{
					"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
					"bullet": "round",
					"bulletBorderAlpha": 1,
					"bulletColor": "#FFFFFF",
					"useLineColorForBulletBorder": true,
					"fillAlphas": 0,
					"lineThickness": 2,
					"lineAlpha": 1,
					"bulletSize": 7,
					"title": "Peticion",
					"valueField": "expenses"
				}],
				"rotate": true,
				"categoryField": "peticion",
				"categoryAxis": {
					"gridPosition": "start"
				}
			});
			operarPeticiones(arreglo,cont);

		}
		function operarPeticiones(peticiones,conta){
			var arrayPet=peticiones;
			var val=0;
			var txtValor=$("#txtResultado").val();
			var contador=conta;
			total=0;
			for(c=0;c<contador;c++){			
				if(c==0){
					val=arrayPet[c]-parseInt(txtValor);
					total=total+Math.abs(val);
					agregar(arrayPet[c],Math.abs(val))

					if(c!=(contador-1)){
						val=arrayPet[c]-arrayPet[c+1];
						total=total+Math.abs(val);
						agregar(arrayPet[c+1],Math.abs(val));
					}
				}
				else{
					if(c!=(contador-1)){
						val=arrayPet[c]-arrayPet[c+1];
						total=total+Math.abs(val);
						agregar(arrayPet[c+1],Math.abs(val));
					}
				}
			}

			var tr=document.createElement("tr");
			var td1=document.createElement("td");
			var td2=document.createElement("td");
			td1.appendChild(document.createTextNode("Total"));
			td2.appendChild(document.createTextNode(total));
			tr.appendChild(td1);
			tr.appendChild(td2);
			document.getElementById("idTbody").appendChild(tr);

		}
		function agregar(algoritmo,valor){
			var tr=document.createElement("tr");
			var td1=document.createElement("td");
			var td2=document.createElement("td");
			td1.appendChild(document.createTextNode(algoritmo));
			td2.appendChild(document.createTextNode(valor));
			tr.appendChild(td1);
			tr.appendChild(td2);
			document.getElementById("idTbody").appendChild(tr);
		}
		function selectAlgoritmo(){
			var myselect = $("#selectOpt").val();
			$("#span").remove();
			var span=document.createElement("span");	
			span.setAttribute("class","widget-subtitle");
			span.setAttribute("id","span");
			span.appendChild(document.createTextNode(myselect));
			document.getElementById("agregarSpan").appendChild(span);
			cambiarAlgorit();
			algoritmo();
		}
		function ordenamientoSstf(peticiones){	
			var arreglo1 =peticiones;
			var aux=[];
			var txtVa=$("#txtResultado").val();
			var txtValor=parseInt(txtVa)
			var valor;
			var contador=0;
			var valorActual;
			var s=0;
			aux[0]=arreglo1[0];
			valor= Math.abs(aux[0]-txtValor);
			for(var c=0; c<arreglo1.length;c++){
				for(var k=0;k<arreglo1.length;k++){
					if(arreglo1[k]!=-1){
						if (valor>=Math.abs(arreglo1[k]-txtValor)){
							aux[c]=arreglo1[k];
							valor=Math.abs(arreglo1[k]-txtValor);
							s=k;
						}
					}
				}
				txtValor =aux[c];
				arreglo1[s]=-1;
				for(i=0;i<arreglo1.length;i++){
					if(arreglo1[i]!=-1){
						contador++;
						if(contador==1){
							valorActual=arreglo1[i];
						}
					}
				}
				contador=0;
				valor= Math.abs(valorActual-txtValor);
			}
			return aux;
		}
		function ordenamientoScan(peticiones){
			var numero=$("#txtResultado").val();
			var rango=capturarLimite();
			var arreglo1 =peticiones;
			var newArreglo=[];
			var c=-1;
			arreglo1[arreglo1.length]=0;
			arreglo1[arreglo1.length]=rango;
			var k=arreglo1.length;

			for(m=0;m<arreglo1.length;m++){
				for(n=0;n<arreglo1.length;n++){

					if(parseInt(arreglo1[n])>parseInt(arreglo1[n+1])){
						var num=arreglo1[n];						
						arreglo1[n]=arreglo1[n+1];
						arreglo1[n+1]=num;
					}
				}
			}


			for(m=0;m<arreglo1.length;m++){
				if(arreglo1[m]<=parseInt(numero)){					
					c++;
				}
				else{
					m=arreglo1.length;
				}
			}
			for(m=0;m<arreglo1.length;m++){
				if(c>-1){
					newArreglo[m]=arreglo1[c]
					c--;
				}
				else{
					k--;
					newArreglo[m]=arreglo1[k]
				}

			}
			return newArreglo;
		}
		function ordenamientoSL(peticiones,nume){
			var numero=$("#txtResultado").val();
			var rango=capturarLimite();
			var arreglo1 =peticiones;	
			var newArreglo=[];
			var nuevo=nume;
			var c=-1;
			if(nuevo==1){
				arreglo1[arreglo1.length]=0;
				arreglo1[arreglo1.length]=rango;
			}
			for(m=0;m<arreglo1.length;m++){
				for(n=0;n<arreglo1.length;n++){

					if(parseInt(arreglo1[n])>parseInt(arreglo1[n+1])){
						var num=arreglo1[n];						
						arreglo1[n]=arreglo1[n+1];
						arreglo1[n+1]=num;
					}
				}
			}
			for(m=0;m<arreglo1.length;m++){
				if(arreglo1[m]<=parseInt(numero)){					
					c++;
				}
				else{
					m=arreglo1.length;
				}
			}
			for(m=0;m<arreglo1.length;m++){
				if(c>-1){
					newArreglo[m]=arreglo1[c]
					c--;
				}
				else{
					newArreglo[m]=arreglo1[m]
				}

			}
			return newArreglo;
		}

		var canva = document.getElementById('disco');
		var canva_disco = document.getElementById('disco_disco');
		var canva_aguja = document.getElementById('disco_aguja');

		var girando_disco = false;
		var moviendo_cabeza = false;
		posicion_actual = 0.11570796326794897;
		posicion_arreglo = 0;
		x = 0;
		var timerDi=0;
		var timerCa=0;
		var mayor = false;
		var mm=0.3926990816987243;
		console.log("x i ="+x);
		console.log("arre i="+arre.length);

		var contexto = canva.getContext("2d");
		var contexto_disco = canva_disco.getContext("2d");
		var contexto_aguja = canva_aguja.getContext("2d");
		var n=0;
		var disco_base = new Image();
		disco_base.src="plugins/img_canvas/base.png";

		var disco_disco = new Image();
		disco_disco.src="plugins/img_canvas/disco.png";
		disco_disco.width=250;
		disco_disco.height=250;
		disco_disco.id="disco_imagen";
		var disco_aguja = new Image();
		disco_aguja.src="plugins/img_canvas/aguja.png";
		disco_aguja.width=150;
		disco_aguja.height=150;

		contexto_disco.translate(disco.width/2-55,disco_disco.height/2+7);
		contexto_aguja.translate(75, 50);
		contexto_aguja.save(); 
		window.onload = function () {
			cargar_imagenes();
	//girar_disco();
}

cargar_imagenes();
function cargar_imagenes() {
	contexto.drawImage(disco_base, 0,0);
	contexto_disco.drawImage(disco_disco, -disco_disco.width/2,-disco_disco.height/2, disco_disco.width,disco_disco.height);
	contexto_aguja.drawImage(disco_aguja, 0,0,disco_aguja.width,disco_aguja.height);
	//-disco_aguja.width/2,-disco_disco.height/2,disco_aguja.width,disco_aguja.height
}

function mover() {	
	if(n==1){
		detener();
	}
	console.log("actual "+posicion_actual);
	$("#btnPause").attr("disabled",false);
	$("#btnPlay").attr("disabled",true);
	$("#btnGo").attr("disabled",true);
	clearInterval(timerDi);
	clearInterval(timerCa);	
	girando_disco = true;
	moviendo_cabeza = true;	
	girar_disco();
	posicion_arreglo = 0;
	var limiteFx = capturarLimite();
	x = parseInt(arre[posicion_arreglo])*mm/limiteFx;
	console.log("x s="+x);
	console.log("arres="+arre[posicion_arreglo]);
	posicion_arreglo += 1;
	if(x<posicion_actual){
		mayor=false;
	}else{
		mayor=true;
	}
}

function pausa(){
	clearInterval(timerDi);
	clearInterval(timerCa);	
	$("#btnPlay").attr("disabled",false);
	console.log("pausa")
	$("#btnPause").attr("disabled",true);
}
function detener(){
	n=0;
	$("#btnPause").attr("disabled",true);
	$("#btnPlay").attr("disabled",false);
	$("#btnGo").attr("disabled",false);
	girando_disco=false;
	clearInterval(timerCa);	
	posicion_arreglo = 0;
	mm=0.4;
}
function cambiarAlgorit(){
	n=0;
	$("#btnPause").attr("disabled",true);
	$("#btnPlay").attr("disabled",false);
	$("#btnGo").attr("disabled",false);
	girando_disco=false;
	clearInterval(timerCa);
	posicion_actual = 0.1;
	posicion_arreglo = 0;
	x = 0;
	contexto_aguja.clearRect(-canva_aguja.width/2,-canva_aguja.height/2,canva_aguja.width+200,canva_aguja.height+200);		
	contexto_aguja.restore(); 
	contexto_aguja.drawImage(disco_aguja,0,0,disco_aguja.width,disco_aguja.height);	
	contexto_aguja.save(); 
	console.log("Aqui");
	mm=0.4;
}


function girar_disco() {
	timerDi=setInterval(movimiento,10);
	timerCa=setInterval(girar_cabeza,100);
}

function movimiento() {
	if (girando_disco==true) {
		contexto_disco.clearRect(-canva_disco.width/2,-canva_disco.height/2,canva_disco.width,canva_disco.height);
		contexto_disco.rotate(Math.PI/20);
		contexto_disco.drawImage(disco_disco,-disco_disco.width/2,-disco_disco.height/2,disco_disco.width,disco_disco.height);
	}
}

function girar_cabeza(){
	if (moviendo_cabeza==true) {
		if (x<posicion_actual) {
			girar_cabezaR(-Math.PI/200);
			posicion_actual = posicion_actual - Math.PI/200;
		}
		else{
			girar_cabezaR(Math.PI/200);
			posicion_actual = posicion_actual + Math.PI/200;
		}
		var limiteFx2 = capturarLimite();
		console.log(posicion_actual);
		console.log("x="+x);
		console.log("tamaño="+arre[0]*mm/limiteFx2);
		
		console.log("ac"+posicion_actual);
	}
	else{
		$("#btnPlay").attr("disabled",false);
		$("#btnGo").attr("disabled",false);
		$("#btnPause").attr("disabled",true);
		
		
	}
}

function girar_cabezaR(valor) {	
	var tamanio_arreglo = arre.length;
	var limiteFx3 = capturarLimite();
	if(posicion_arreglo<=tamanio_arreglo){
		contexto_aguja.clearRect(-canva_aguja.width/2,-canva_aguja.height/2,canva_aguja.width+200,canva_aguja.height+200);
		contexto_aguja.rotate(valor);
		contexto_aguja.drawImage(disco_aguja,0,0,disco_aguja.width,disco_aguja.height);	
	}else{
		moviendo_cabeza = false;
		girando_disco = false;	
		n=1;
		
	}
	if(mayor==false){
		if(x>posicion_actual){
			posicion_actual = x;
			x = parseInt(arre[posicion_arreglo])*mm/limiteFx3;
			posicion_arreglo += 1;
			if(x<posicion_actual){
				mayor=false;
			}else{
				mayor=true;
			}
		}
	}else{
		if(x<posicion_actual){
			posicion_actual = x;
			x = parseInt(arre[posicion_arreglo])*mm/limiteFx3;
			posicion_arreglo += 1;
			if(x<posicion_actual){
				mayor=false;
			}else{
				mayor=true;
			}
		}
	}
}












