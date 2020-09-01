var pureObject; // Load JSON file from API URL
var dataObject; // Fetch only relevant fields

pureObject = [];
dataObject = [];

var sumTotalDisease = 0;
var sumTotalDisease7Days = 0;

function addLeadingZeroesToDate(dateTxt){

	dateFragments = dateTxt.split("/");
	day = dateFragments[0];
	month = dateFragments[1];
	year = dateFragments[2];

	if (day.length < 2){
		day = "0" + day;
	}

	if (month.length < 2){
		month = "0" + month;
	}

	newDateTxt = day + "/" + month + "/" + year;

	return newDateTxt;
}

function buildDataQueryURL(dateTxt, officeTxt, healthZone){
	var possibleOffices = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
	var codesOffices = ["Gerencia+de+Ávila", "Gerencia+de+Burgos", "Gerencia+de+León", "Gerencia+de+Palencia", "Gerencia+de+Ponferrada", "Gerencia+de+Salamanca", "Gerencia+de+Segovia", "Gerencia+de+Soria", "Gerencia+de+Valladolid+Este", "Gerencia+de+Valladolid+Oeste", "Gerencia+de+Zamora"];

	var officeIndex = possibleOffices.indexOf(officeTxt);
	var codeOffice = codesOffices[officeIndex];

	var url = "";

	if (dateTxt == undefined || dateTxt.length == 0){
		url += "https://www.bmsalamanca.com/others/CoViDCyL/CORS_tasa-enfermos-acumulados-por-areas-de-salud.php?office=" + codeOffice;
	} else {
		url += "https://www.bmsalamanca.com/others/CoViDCyL/CORS_tasa-enfermos-acumulados-por-areas-de-salud.php?date=" + dateTxt + "&office=" + codeOffice;
	}

	if (healthZone != undefined){
		url += "&healthZone=" + healthZone;
	}

	console.log(url);

	return url;
}

function buildGraphDataQueryURL(officeTxt){
  var possibleOffices = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
  var codesOffices = ["Gerencia+de+Ávila", "Gerencia+de+Burgos", "Gerencia+de+León", "Gerencia+de+Palencia", "Gerencia+de+Ponferrada", "Gerencia+de+Salamanca", "Gerencia+de+Segovia", "Gerencia+de+Soria", "Gerencia+de+Valladolid+Este", "Gerencia+de+Valladolid+Oeste", "Gerencia+de+Zamora"];

  var officeIndex = possibleOffices.indexOf(officeTxt);
  var codeOffice = codesOffices[officeIndex];

  return "https://www.bmsalamanca.com/others/CoViDCyL/CORS_tasa-enfermos-acumulados-por-areas-de-salud.php?graph=true&office=" + codeOffice;

}

function buildForwardingURL(dateTxt, officeTxt, healthZone){
	var url = "";
	if (dateTxt == undefined || dateTxt.length == 0){
		url += "?gerencia=" + officeTxt;
	} else {
		url += "?fecha=" + dateTxt + "&gerencia=" + officeTxt;
	}

	if (healthZone != undefined){
		url += "&zbs=" + healthZone;
	}

	return url;
	
}

function getOfficetxtForOfficeCode(code){
	var officeNames = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
	var officeCodes = ["1701", "1702", "1703", "1705", "1704", "1706", "1707", "1708", "1710", "1709", "1711"];

	return officeNames[officeCodes.indexOf(code)];
}

function isDate(dateTxt){
	return dateTxt.match(/^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/); // d(d)/m(m)/yyyy
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

function buildIncidence(healthZone){

	dataObject = [];
	incidence = pureObject[pureObject.length-1]; // Incidence is last item on pureObject

	for (var i = 0; i < pureObject.length-1; i++) {
		if (pureObject[i]["fields"]["zbs_geo"] == healthZone){
			dataObject.push(pureObject[i]["fields"]);
		}
	}

	nameHealthZone = dataObject[0]["centro"];
	date = dataObject[0]["fecha"];
	date = moment(date, "YYYY-MM-DD").format("DD/MM/yyyy");;

	newSymptoms = dataObject[0]["totalenfermedad"];
	newSymptoms7d = dataObject[0]["totalenfermedad_7dias"];
	newSymptoms14d = dataObject[0]["totalenfermedad_14dias"];

	newPCR = dataObject[0]["pcr_positivos_sintomas"];
	newPCR7d = dataObject[0]["pcr_positivos_sintomas_7dias"];
	newPCR14d = dataObject[0]["pcr_positivos_sintomas_14dias"];

	newIncidence = incidence[0];
	newIncidence7d = incidence[1];
	newIncidence14d = incidence[2];

	$('#health-zone-name').html(nameHealthZone);
	$('#health-zone-date').html(date);
	
	$('#symptom-number').html(newSymptoms);
	$('#symptom-number-7d').html(newSymptoms7d);
	$('#symptom-number-14d').html(newSymptoms14d);

	$('#test-number').html(newPCR);
	$('#test-number-7d').html(newPCR7d);
	$('#test-number-14d').html(newPCR14d);

	$('#incidence-number').html(newIncidence);
	$('#incidence-number-7d').html(newIncidence7d);
	$('#incidence-number-14d').html(newIncidence14d);

	$('#data-town').show();
	$('#no-data-town').hide();

}

function buildTable(){

	dataObject = [];
	
	// Check if last item is an array, if so, don't add it to the table (because it's incidence):

	if (Array.isArray(pureObject[pureObject.length-1])) {
		for (var i = 0; i < pureObject.length-1; i++) {
			dataObject.push(pureObject[i]["fields"]);
		}
	} else {
		for (var i = 0; i < pureObject.length; i++) {
			dataObject.push(pureObject[i]["fields"]);
		}
	}

	console.log(pureObject);
	console.log(dataObject);

	for (var i = 0; i < dataObject.length; i++) {
		sumTotalDisease += dataObject[i]["totalenfermedad"];
		sumTotalDisease7Days += dataObject[i]["totalenfermedad_7dias"];
	}

	if (dataObject.length > 0){
		if (dataObject.length > 0){
			$('#no-data').hide();
			$('#hot').show();
		} else {
			$('#hot').hide();
			$('#no-data').show();
		}

		dataObject.push({});
		dataObject.push({});
	}

	var colHeads;
	var columnsData;
	var colsSum;
	var colsSort;
	var fixedCols;

	colsSort = {
	  	indicator: true,
	    sortEmptyCells: true,
	    initialConfig: {
	      column: 1,
	      sortOrder: 'desc'
	    }
	};
	colsSum = [
    {
      destinationColumn: 1,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    },
    {
      destinationColumn: 2,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    },
    {
      destinationColumn: 3,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    },
    {
      destinationColumn: 6,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    },
    {
      destinationColumn: 8,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    },
    {
      destinationColumn: 10,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    },
    {
      destinationColumn: 13,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    },
    {
      destinationColumn: 15,
      destinationRow: 0,
      type: 'sum',
      forceNumeric: true,
      suppressDataTypeErrors: true,
      reversedRowCoords: true,
      readOnly: true
    }
  ];
	colHeads = [
  'CENTRO',
	'TOTALENFERMEDAD',
	'PCR_POSITIVOS',
	'PCR_POSITIVOS_SINTOMAS_7DIAS',
	'TASAPCR_POSITIVOS_SINTOMASx10000_7DIAS',
	'TASA_TOTALENFERMEDAD_x100',
	'TOTALENFERMEDAD_7DIAS',
	'TASAx100_7DIAS',
	'TOTALENFERMEDAD_14DIAS',
	'TASAx100_14DIAS',
	'PCR_REALIZADOS',
	'TASAx100_PCR_REALIZADOS',
	'TASAx10000_PCR_POSITIVOS',
	'PCR_POSITIVOS_SINTOMAS',
	'TASAx10000_PCR_POSITIVOS_SINTOMAS',
	'PCR_POSITIVOS_SINTOMAS_14DIAS',
	'TASAPCR_POSITIVOS_SINTOMASx10000_14DIAS',
	'x_geo',
	'y_geo',
	'zbs_geo',
	'POSICION',
	'MUNICIPIO',
	'NOMBREGERENCIA',
	'TSI',
	'CS',
	'PROVINCIA',
	'TIPO_CENTRO',
	'GERENCIA',
	'FECHA'
  ];
  columnsData = [
    {
      data: 'centro',
      type: 'text',
      readOnly: true
    },
    {
      data: 'totalenfermedad',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pcr_positivos',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pcr_positivos_sintomas_7dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasapcr_positivos_sintomasx10000_7dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasax100',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'totalenfermedad_7dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasax100_7dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'totalenfermedad_14dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasax100_14dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pcr_realizados',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasax100_pcr_realizados',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasax10000_pcr_positivos',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pcr_positivos_sintomas',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasax10000_pcr_positivos_sintomas',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pcr_positivos_sintomas_14dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'tasapcr_positivos_sintomasx10000_14dias',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'x_geo',
      type: 'text',
      readOnly: true
    },
    {
      data: 'y_geo',
      type: 'text',
      readOnly: true
    },
    {
      data: 'zbs_geo',
      type: 'text',
      readOnly: true
    },
    {
      data: 'posicion',
      type: 'text',
      readOnly: true
    },
    {
      data: 'municipio',
      type: 'text',
      readOnly: true
    },
    {
      data: 'nombregerencia',
      type: 'text',
      readOnly: true
    },
    {
      data: 'tsi',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'cs',
      type: 'text',
      readOnly: true
    },
    {
      data: 'provincia',
      type: 'text',
      readOnly: true
    },
    {
      data: 'tipo_centro',
      type: 'text',
      readOnly: true
    },
    {
      data: 'gerencia',
      type: 'text',
      readOnly: true
    },
    {
      data: 'fecha',
      type: 'date',
      readOnly: true
    }
  ];

  fixedCols = 1;

  $('#date_hideTitle').html("Fecha: " + dataObject[0]["fecha"].split("-")[2] + "/" + dataObject[0]["fecha"].split("-")[1] + "/" + dataObject[0]["fecha"].split("-")[0]);

	if (getUrlParameter("hideTitle") != undefined && getUrlParameter("hideTitle") == "true"){

		// SHORTCUT:

		$('section.town').remove();
		$('#hot').addClass("hideTitle");
	    $('#graph').remove();
	    $('#ad1').remove();
	    $('#ad2').remove();
	}

	var hotElement = document.querySelector('#hot');
	var hotElementContainer = hotElement.parentNode;
	var hotSettings = {
	  licenseKey: 'non-commercial-and-evaluation',
	  data: dataObject,
	  columns: columnsData,
	  stretchH: 'all',
	  width: '98%',
	  height: 25 * dataObject.length,
	  autoWrapRow: true,
	  filters: true,
	  dropdownMenu: true,
	  rowHeaders: true,
	  colHeaders: colHeads,
	  columnSorting: colsSort,
	  fixedRowsTop: 0,
	  fixedColumnsLeft: fixedCols,
	  autoColumnSize: {
	    samplingRatio: 23
	  },
	  columnSummary: colsSum,
	  manualRowResize: true,
	  manualColumnResize: true
	};

	if (dataObject.length > 0){
		var hot = new Handsontable(hotElement, hotSettings);
	}
}

$(document).ready(function() {

  $('a[href^="#"]').click(function () {
    $('html, body').animate({
        scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top - 150
    }, 500);

    return false;
  });

	var date = getUrlParameter("fecha");
	var office = getUrlParameter("gerencia");
	var healthZone = getUrlParameter("zbs");
	var hideTitle = getUrlParameter("hideTitle");
	var possibleOffices = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
	var curatedData = [];
  	var graphData = {};
  	var graphValues = [];

	if (date != undefined && isDate(date)){
		$('#date').val(date);
	}

	if (office != undefined && possibleOffices.includes(office)){
		$("#office").val(office);
		$("#town").val(healthZone);
		if (healthZone != undefined){
			$('#no-data-town').show();
		}
		$("#office option[value=" + office + "]").attr('selected','selected');
		$.ajax({
	        type: 'GET',
	        url: buildDataQueryURL(date, office, healthZone),
	        dataType: 'json',
	        async: true,
	        success: function(data) {
	            pureObject = data;
	            buildTable();
	            if (healthZone != undefined){
	            	buildIncidence(healthZone);
	            }
	        }
	    });
	}

	if (hideTitle != undefined && hideTitle == "true"){
		$('header').hide();
		$('#form').hide();
	}

	$('#show').click(function(){

		var dateTxt = $('#date').val();
		var officeTxt = $("#office").children("option:selected").val();
		
		if (dateTxt.length > 0 && dateTxt.length < 8){
			alert("El formato de la fecha es incorrecto. Debe ser día/mes/año.");
		
		} else if (dateTxt.length >= 8) {
			if (isDate(dateTxt)){
				if (dateTxt.length < 10){
					dateTxt = addLeadingZeroesToDate(dateTxt);
				}
				window.location.href = buildForwardingURL(dateTxt, officeTxt, undefined);
			} else {
				alert("El formato de la fecha es incorrecto. Debe ser día/mes/año.");
			}

		} else if (dateTxt.length == 0){
			window.location.href = buildForwardingURL(dateTxt, officeTxt, undefined);
		}

	});

	var towns = ['ADANERO', 'ALDEASECA', 'CABEZAS DE ALAMBRE', 'DONHIERRO', 'DONJIMENO', 'ESPINOSA DE LOS CABALLEROS', 'GUTIERRE-MUÑOZ', 'NAVA DE AREVALO', 'ORBITA', 'PEDRO-RODRIGUEZ', 'SAN VICENTE DE AREVALO', 'VILLANUEVA DEL ACERAL', 'AREVALO', 'EL BOHODON', 'CANALES', 'CODORNIZ', 'CONSTANZANA', 'FUENTES DE AÑO', 'LANGA', 'MONTEJO DE AREVALO', 'SAN CRISTOBAL DE LA VEGA', 'SANCHIDRIAN', 'SINLABAJOS', 'DONVIDAS', 'MARTIN MUÑOZ DE LA DEHESA', 'MARTIN MUÑOZ DE LAS POSADAS', 'PALACIOS DE GODA', 'RAPARIEGOS', 'TIÑOSILLOS', 'TOLOCIRIO', 'VILLANUEVA DE GOMEZ', 'AVILA NORTE', 'AVILA RURAL', 'LAS BERLANAS', 'CASASOLA', 'GALLEGOS DE ALTAMIROS', 'MARLIN', 'MIRONCILLO', 'MONSALUPE', 'EL OSO', 'PAJARES DE ADAJA', 'SAN BARTOLOME DE PINARES', 'SAN JUAN DE LA NAVA', 'LA SERRADA', 'TOLBAÑOS', 'EL BARRACO', 'LA COLILLA', 'GEMUÑO', 'GOTARRENDURA', 'HERRADON DE PINARES', 'MEDIANA DE VOLTOYA', 'MINGORRIA', 'MUÑOPEPE', 'NIHARRA', 'OJOS-ALBOS', 'SALOBRAL', 'SAN ESTEBAN DE LOS PATOS', 'SANTA CRUZ DE PINARES', 'TORNADIZOS DE AVILA', 'VEGA DE SANTA MARIA', 'BERROCALEJO DE ARAGONA', 'BLASCOSANCHO', 'CARDEÑOSA', 'EL FRESNO', 'HERNANSANCHO', 'MARTIHERRERO', 'PADIERNOS', 'PEÑALBA DE AVILA', 'POZANCO', 'RIOFRIO', 'SAN PASCUAL', 'SANCHORREJA', 'SANTA MARIA DEL CUBILLO', 'SANTO DOMINGO DE LAS POSADAS', 'SOTALBO', 'VELAYOS', 'NAVALMORAL', 'NAVALUENGA', 'SAN JUAN DEL MOLINILLO', 'SERRANILLOS', 'BURGOHONDO', 'HOYOCASERO', 'NAVAQUESERA', 'NAVARREDONDILLA', 'NAVARREVISCA', 'NAVATALGORDO', 'VILLANUEVA DE AVILA', 'NAVALACRUZ', 'NAVALOSA', 'CEBREROS', 'EL TIEMBLO', 'EL HOYO DE PINARES', 'LAS NAVAS DEL MARQUES', 'NAVALPERAL DE PINARES', 'PEGUERINOS', 'SAN ESTEBAN DEL VALLE', 'SANTA CRUZ DEL VALLE', 'VILLAREJO DEL VALLE', 'CUEVAS DEL VALLE', 'MOMBELTRAN', 'BECEDILLAS', 'BONILLA DE LA SIERRA', 'COLLADO DEL MIRON', 'DIEGO DEL CARPIO', 'MALPARTIDA DE CORNEJA', 'EL MIRON', 'PIEDRAHITA', 'SAN MIGUEL DE SERREZUELA', 'TORTOLES', 'VILLAFRANCA DE LA SIERRA', 'VILLAR DE CORNEJA', 'HOYORREDONDO', 'NAVACEPEDILLA DE CORNEJA', 'PASCUALCOBO', 'SAN BARTOLOME DE CORNEJA', 'SANTA MARIA DEL BERROCAL', 'SANTIAGO DEL COLLADO', 'AREVALILLO', 'CASAS DEL PUERTO', 'MARTINEZ', 'MESEGAR DE CORNEJA', 'NARRILLOS DEL ALAMO', 'NAVAESCURIAL', 'SAN MIGUEL DE CORNEJA', 'ZAPARDIEL DE LA CAÑADA', 'AVILA SUR ESTE', 'CAMPILLO DE ARANDA', 'CASTRILLO DE LA VEGA', 'ESPINOSA DE CERVERA', 'MILAGROS', 'MONTEJO DE LA VEGA DE LA SERREZUELA', 'LA SEQUERA DE HAZA', 'VALDEANDE', 'VALDEVACAS DE MONTEJO', 'LA VID Y BARRIOS', 'VILLALBA DE DUERO', 'VILLAVERDE DE MONTEJO', 'ZAZUAR', 'ALDEHORNO', 'ARANDA DE DUERO', 'BAÑOS DE VALDEARADOS', 'FUENTELCESPED', 'FUENTESPINA', 'GUMIEL DE IZAN', 'GUMIEL DE MERCADO', 'HONRUBIA DE LA CUESTA', 'HONTANGAS', 'HONTORIA DE VALDEARADOS', 'MORADILLO DE ROA', 'PARDILLA', 'PEÑARANDA DE DUERO', 'QUEMADA', 'SAN JUAN DEL MONTE', 'VILLANUEVA DE GUMIEL', 'ADRADA DE HAZA', 'CALERUEGA', 'FRESNILLO DE LAS DUEÑAS', 'FUENTENEBRO', 'QUINTANA DEL PIDIO', 'SANTA CRUZ DE LA SALCEDA', 'SANTA MARIA DEL MERCADILLO', 'TORREGALINDO', 'TUBILLA DEL LAGO', 'VADOCONDES', 'VILLALBILLA DE GUMIEL', 'ARRAYA DE OCA', 'FRESNO DE RODILLA', 'HURONES', 'MEDINA DE POMAR', 'MONASTERIO DE RODILLA', 'MONTORIO', 'PINEDA DE LA SIERRA', 'VALLE DE SEDANO', 'BARRIOS DE COLINA', 'CARDEÑUELA RIOPICO', 'HUERMECES', 'MERINDAD DE RIO UBIERNA', 'RUBENA', 'SANTA MARIA DEL INVIERNO', 'VALLE DE LAS NAVAS', 'VALLE DE SANTIBAÑEZ', 'ALFOZ DE QUINTANADUEÑAS', 'ARLANZON', 'ATAPUERCA', 'BURGOS RURAL NORTE', 'ORBANEJA RIOPICO', 'QUINTANAORTUÑO', 'QUINTANAPALLA', 'QUINTANILLA VIVAR', 'SOTRAGERO', 'URBEL DEL CASTILLO', 'VILLAESCUSA LA SOMBRIA', 'VILLASUR DE HERREROS', 'VILLAYERNO MORQUILLAS', 'JUNTA DE TRASLALOMA', 'ESPINOSA DE LOS MONTEROS', 'MERINDAD DE MONTIJA', 'MERINDAD DE SOTOSCUEVA', 'GARCIA LORCA', 'MERINDAD DE CUESTA-URRIA', 'TRESPADERNE', 'CASTRILLO DE RIOPISUERGA', 'CASTRILLO MATAJUDIOS', 'CASTROJERIZ', 'HONTANAS', 'PADILLA DE ARRIBA', 'REZMONDO', 'VILLAQUIRAN DE LA PUEBLA', 'ZARZOSA DE RIO PISUERGA', 'ARENILLAS DE RIOPISUERGA', 'MELGAR DE FERNAMENTAL', 'PADILLA DE ABAJO', 'PEDROSA DEL PRINCIPE', 'SASAMON', 'CASTELLANOS DE CASTRO', 'VILLASANDINO', 'ALTABLE', 'AMEYUGO', 'BOZOO', 'VALLUERCANES', 'MIRANDA DE EBRO', 'BUGEDO', 'PANCORBO', 'SANTA GADEA DEL CID', 'CIADONCHA', 'PALAZUELOS DE MUÑO', 'PAMPLIEGA', 'VALLES DE PALENZUELA', 'VILLAQUIRAN DE LOS INFANTES', 'LOS BALBASES', 'BELBIMBRE', 'TAMARON', 'VALLEJERA', 'VILLAZOPEQUE', 'IGLESIAS', 'MAZUELA', 'OLMILLOS DE MUÑO', 'PERAL DE ARLANZA', 'PRESENCIO', 'REVILLA VALLEJERA', 'SANTA MARIA DEL CAMPO', 'VILLALDEMIRO', 'VILLAMEDIANILLA', 'VILLAVERDE DEL MONTE', 'VILLAVERDE-MOGINA', 'VILLODRIGO', 'CANICOSA DE LA SIERRA', 'QUINTANAR DE LA SIERRA', 'REGUMIEL DE LA SIERRA', 'NEILA', 'PALACIOS DE LA SIERRA', 'VILVIESTRE DEL PINAR', 'BERLANGAS DE ROA', 'FUENTEMOLINOS', 'LA HORRA', 'HOYALES DE ROA', 'NAVA DE ROA', 'OLMEDILLO DE ROA', 'ROA', 'TERRADILLOS DE ESGUEVA', 'TORRESANDINO', 'VILLAESCUSA DE ROA', 'LA CUEVA DE ROA', 'FUENTELISENDO', 'HAZA', 'SOTILLO DE LA RIBERA', 'VALDEZATE', 'VILLATUELDA', 'ANGUIX', 'FUENTECEN', 'PEDROSA DE DUERO', 'SAN MARTIN DE RUBIALES', 'TORTOLES DE ESGUEVA', 'VALLE DE ZAMANZAS', 'LOS ALTOS', 'SARGENTES DE LA LORA', 'TUBILLA DEL AGUA', 'LAS HUELGAS', 'ARDON', 'CHOZAS DE ABAJO', 'ARMUNIA', 'SANTOVENIA DE LA VALDONCINA', 'ONZONILLA', 'VEGA DE INFANZONES', 'BOÑAR', 'VALDELUGUEROS', 'VALDEPIELAGO', 'VEGAQUEMADA', 'PUEBLA DE LILLO', 'LA VECILLA', 'LA ERCINA', 'CISTIERNA', 'PRADO DE LA GUZPEÑA', 'SABERO', 'ALMANZA', 'CEBANICO', 'CREMENES', 'PRIORO', 'VALDERRUEDA', 'LA POLA DE GORDON', 'VILLAMANIN', 'LA ROBLA', 'LA BAÑEZA', 'SANTA ELENA DE JAMUZ', 'SOTO DE LA VEGA', 'SANTA MARIA DE LA ISLA', 'GARRAFE DE TORIO', 'VILLAQUILAMBRE', 'ERAS DE RENUEVA', 'SANTA COLOMBA DE CURUEÑO', 'CONDESA', 'MANSILLA MAYOR', 'SANTA CRISTINA DE VALMADRIGAL', 'VILLAMORATIEL DE LAS MATAS', 'VILLATURIEL', 'EL BURGO RANERO', 'GUSENDOS DE LOS OTEROS', 'VALVERDE-ENRIQUE', 'VILLANUEVA DE LAS MANZANAS', 'VILLASABARIEGO', 'CAMPO DE VILLAVIDEL', 'CORBILLOS DE LOS OTEROS', 'MANSILLA DE LAS MULAS', 'SANTAS MARTAS', 'BUSTILLO DEL PARAMO', 'CARRIZO', 'SANTA MARINA DEL REY', 'HOSPITAL DE ORBIGO', 'RIELLO', 'VILLARES DE ORBIGO', 'BENAVIDES', 'CIMANES DEL TEJAR', 'LLAMAS DE LA RIBERA', 'QUINTANA DEL CASTILLO', 'TURCIA', 'VILLADANGOS DEL PARAMO', 'VILLAREJO DE ORBIGO', 'SAN ANDRES DEL RABANEDO', 'VALVERDE DE LA VIRGEN', 'FABERO', 'PERANZANES', 'CANDIN', 'VEGA DE ESPINAREDA', 'BERLANGA DEL BIERZO', 'TORENO', 'PARAMO DEL SIL', 'VILLABLINO', 'PALACIOS DEL SIL', 'CARUCEDO', 'SOBRADO', 'VILLAFRANCA DEL BIERZO', 'BARJAS', 'OENCIA', 'TRABADELO', 'VILLADECANES', 'BALBOA', 'CORULLON', 'VEGA DE VALCARCE', 'BARRUELO DE SANTULLAN', 'VALLE DE VALDELUCIO', 'BASCONCILLOS DEL TOZO', 'AGUILAR DE CAMPOO', 'BERZOSILLA', 'BRAÑOSERA', 'POMAR DE VALDIVIA', 'HERMEDES DE CERRATO', 'VILLAVIUDAS', 'CEVICO NAVERO', 'REINOSO DE CERRATO', 'ANTIGÜEDAD', 'BALTANAS', 'CASTRILLO DE DON JUAN', 'ESPINOSA DE CERRATO', 'VILLACONANCIO', 'DEHESA DE MONTEJO', 'LA PERNIA', 'POLENTINOS', 'CASTREJON DE LA PEÑA', 'CERVERA DE PISUERGA', 'MUDA', 'SALINAS DE PISUERGA', 'SAN CEBRIAN DE MUDA', 'TRIOLLO', 'DE LA PUEBLA', 'CASTRILLO DE VILLAVEGA', 'ESPINOSA DE VILLAGONZALO', 'OSORNILLO', 'SAN CRISTOBAL DE BOEDO', 'SANTA CRUZ DE BOEDO', 'VILLASARRACINO', 'ABIA DE LAS TORRES', 'LANTADILLA', 'VILLAHERREROS', 'VILLAPROVEDO', 'BARCENA DE CAMPOS', 'OSORNO LA MAYOR', 'ERAS DEL BOSQUE', 'COBOS DE CERRATO', 'TORQUEMADA', 'VILLAMEDIANA', 'CORDOVILLA LA REAL', 'HORNILLOS DE CERRATO', 'PALENZUELA', 'QUINTANA DEL PUENTE', 'TABANERA DE CERRATO', 'VILLAHAN', 'HERRERA DE VALDECAÑAS', 'CASTRILLO DE ONIELO', 'CUBILLAS DE CERRATO', 'DUEÑAS', 'POBLACION DE CERRATO', 'ALBA DE CERRATO', 'CEVICO DE LA TORRE', 'VERTAVILLO', 'HONTORIA DE CERRATO', 'TARIEGO DE CERRATO', 'VALLE DE CERRATO', 'VENTA DE BAÑOS', 'LA CALZADA DE BEJAR', 'COLMENAR DE MONTEMAYOR', 'HORCAJO DE MONTEMAYOR', 'LAGUNILLA', 'MONTEMAYOR DEL RIO', 'PEÑACABALLERA', 'SANCHOTELLO', 'SANTIBAÑEZ DE LA SIERRA', 'VALDEHIJADEROS', 'VALDELAGEVE', 'ALDEACIPRESTE', 'BEJAR', 'CANDELARIO', 'EL CERRO', 'LA HOYA', 'MOLINILLO', 'NAVACARROS', 'NAVALMORAL DE BEJAR', 'CANTAGALLO', 'CRISTOBAL', 'PINEDAS', 'PUERTO DE BEJAR', 'VALDEFUENTES DE SANGUSIN', 'VALLEJERA DE RIOFRIO', 'BOADA', 'CABRILLAS', 'CASTRAZ', 'LA SAGRADA', 'LA FUENTE DE SAN ESTEBAN', 'PELARRODRIGUEZ', 'SAN MUÑOZ', 'BUENAMADRE', 'EL CUBO DE DON SANCHO', 'MARTIN DE YELTES', 'LA ALBERCA', 'EL MAILLO', 'NAVA DE FRANCIA', 'EL CABACO', 'MOGARRAZ', 'MONFORTE DE LA SIERRA', 'LAS CASAS DEL CONDE', 'SAN MARTIN DEL CASTAÑAR', 'SAN MIGUEL DEL ROBLEDO', 'BAÑOBAREZ', 'BERMELLAR', 'OLMEDO DE CAMACES', 'AHIGAL DE LOS ACEITEROS', 'CERRALBO', 'LUMBRALES', 'LA REDONDA', 'SAN FELICES DE LOS GALLEGOS', 'SOBRADILLO', 'LA FREGENEDA', 'FUENTELIANTE', 'HINOJOSA DE DUERO', 'SAN JOSE', 'F.VILLALOBOS', 'SAN JUAN', 'CAPUCHINOS', 'CABEZUELA', 'CANTALEJO', 'CUBILLO', 'FUENTERREBOLLO', 'NAVALILLA', 'PUEBLA DE PEDRAZA', 'SEBULCOR', 'AREVALILLO DE CEGA', 'CABALLAR', 'COBOS DE FUENTIDUEÑA', 'FUENTE EL OLMO DE FUENTIDUEÑA', 'MUÑOVEROS', 'REBOLLO', 'VALLE DE TABLADILLO', 'VEGANZONES', 'ALDEALCORVO', 'CARRASCAL DEL RIO', 'SAN MIGUEL DE BERNUY', 'SAN PEDRO DE GAILLOS', 'SAUQUILLO DE CABEZAS', 'TORREIGLESIAS', 'TUREGANO', 'VALDEVACAS Y GUIJAR', 'FRESNEDA DE CUELLAR', 'VALLELADO', 'CHAÑE', 'GOMEZSERRACIN', 'OLOMBRADA', 'PINAREJOS', 'SANCHONUÑO', 'CUELLAR', 'FRUMALES', 'SAMBOAL', 'SAN CRISTOBAL DE CUELLAR', 'ARCONES', 'CASLA', 'GALLEGOS', 'MATABUENA', 'OREJANA', 'PELAYOS DEL ARROYO', 'SANTIUSTE DE PEDRAZA', 'SANTO TOME DEL PUERTO', 'NAVAFRIA', 'PEDRAZA', 'PRADENA', 'SOTOSALBOS', 'TORRE VAL DE SAN PEDRO', 'ALDEALENGUA DE PEDRAZA', 'ARAHUETES', 'COLLADO HERMOSO', 'SEGOVIA I', 'EL ESPINAR', 'FUENTESOTO', 'FUENTIDUEÑA', 'CASTRO DE FUENTIDUEÑA', 'CUEVAS DE PROVANCO', 'LAGUNA DE CONTRERAS', 'SACRAMENIA', 'TORREADRADA', 'CASTROJIMENO', 'VALTIENDAS', 'ARCOS DE JALON', 'MONTEAGUDO DE LAS VICARIAS', 'MIÑO DE MEDINACELI', 'ALMALUEZ', 'MEDINACELI', 'SANTA MARIA DE HUERTA', 'YELO', 'ARENILLAS', 'BARCONES', 'BAYUBAS DE ARRIBA', 'BERLANGA DE DUERO', 'BAYUBAS DE ABAJO', 'CALTOJAR', 'FUENTEPINILLA', 'QUINTANA REDONDA', 'RELLO', 'LA RIBA DE ESCALOTE', 'VALDERRODILLA', 'RETORTILLO DE SORIA', 'TAJUECO', 'LANGA DE DUERO', 'LICERAS', 'SAN ESTEBAN DE GORMAZ', 'CASTILLEJO DE ROBLEDO', 'FUENTEARMEGIL', 'FUENTECAMBRON', 'MONTEJO DE TIERMES', 'ALCUBILLA DE AVELLANEDA', 'MIÑO DE SAN ESTEBAN', 'COVALEDA', 'DURUELO DE LA SIERRA', 'MOLINOS DE DUERO', 'MONTENEGRO DE CAMEROS', 'VINUESA', 'SALDUERO', 'SORIA NORTE', 'CASTROBOL', 'CASTROPONCE', 'MAYORGA', 'MELGAR DE ABAJO', 'SAELICES DE MAYORGA', 'VALDUNQUILLO', 'MELGAR DE ARRIBA', 'VILLALBA DE LA LOMA', 'VILLALON DE CAMPOS', 'BECILLA DE VALDERADUEY', 'IZAGRE', 'MONASTERIO DE VEGA', 'VILLAVICENCIO DE LOS CABALLEROS', 'CASTROMONTE', 'MEDINA DE RIOSECO', 'LA MUDARRA', 'VILLANUEVA DE SAN MANCIO', 'MONTEALEGRE DE CAMPOS', 'MORAL DE LA REINA', 'TAMARIZ DE CAMPOS', 'BERRUECES', 'VALDENEBRO DE LOS VALLES', 'VALVERDE DE CAMPOS', 'VILLABRAGIMA', 'VILLALBA DE LOS ALCORES', 'BERCERUELO', 'SAN MIGUEL DEL PINO', 'SAN SALVADOR', 'TORRECILLA DE LA ABADESA', 'VILLAN DE TORDESILLAS', 'BERCERO', 'MATILLA DE LOS CAÑOS', 'PEDROSA DEL REY', 'SAN ROMAN DE HORNIJA', 'TORDESILLAS', 'TORRECILLA DE LA TORRE', 'VELILLA', 'BARRUELO DEL VALLE', 'POLLOS', 'ROBLADILLO', 'SAN PELAYO', 'TORRELOBATON', 'VELLIZA', 'VILLALAR DE LOS COMUNEROS', 'VILLASEXMIR', 'DELICIAS II', 'RONDILLA I', 'SAN PABLO', 'LA VICTORIA', 'GAMAZO', 'CABEZON DE PISUERGA', 'CASTRONUEVO DE ESGUEVA', 'VILLARMENTERO DE ESGUEVA', 'RENEDO DE ESGUEVA', 'SANTOVENIA DE PISUERGA', 'CIGALES', 'CORCOS', 'CUBILLAS DE SANTA MARTA', 'SAN MARTIN DE VALVENI', 'TRIGUEROS DEL VALLE', 'VALORIA LA BUENA', 'FUENSALDAÑA', 'MUCIENTES', 'PARADA DEL MOLINO', 'ALCAÑICES', 'TRABAZOS', 'FIGUERUELA DE ARRIBA', 'GALLEGOS DEL RIO', 'MAHIDE', 'PINO DEL ORO', 'RABANALES', 'RABANO DE ALISTE', 'SAMIR DE LOS CAÑOS', 'FONFRIA', 'SAN VICENTE DE LA CABEZA', 'SAN VITERO', 'VIÑAS', 'BENAVENTE', 'MORALES DE REY', 'POBLADURA DEL VALLE', 'SANTA CRISTINA DE LA POLVOROSA', 'LA TORRE DEL VALLE', 'VILLAFERRUEÑA', 'BRIME DE URZ', 'COOMONTE', 'QUINTANILLA DE URZ', 'QUIRUELAS DE VIDRIALES', 'SANTA MARIA DE LA VEGA', 'FRESNO DE LA POLVOROSA', 'MAIRE DE CASTROPONCE', 'MANGANESES DE LA POLVOROSA', 'VILLABRAZARO', 'VILLANAZAR', 'BURGANES DE VALVERDE', 'FUENTES DE ROPEL', 'NAVIANOS DE VALVERDE', 'SANTA COLOMBA DE LAS MONJAS', 'SANTOVENIA', 'BARCIAL DEL BARCO', 'BRETO', 'FRIERA DE VALVERDE', 'MATILLA DE ARZON', 'SAN CRISTOBAL DE ENTREVIÑAS', 'SAN MIGUEL DEL VALLE', 'VALDESCORRIEL', 'VILLAVEZA DEL AGUA', 'ARCOS DE LA POLVOROSA', 'BRETOCINO', 'CASTROGONZALO', 'MILLES DE LA POLVOROSA', 'VILLANUEVA DE AZOAGUE', 'SAN PEDRO DE CEQUE', 'VEGA DE TERA', 'CALZADILLA DE TERA', 'CAMARZANA DE TERA', 'MELGAR DE TERA', 'MICERECES DE TERA', 'SANTIBAÑEZ DE TERA', 'SANTA CROYA DE TERA', 'VILLANUEVA DE LAS PERAS', 'CABAÑAS DE SAYAGO', 'CORRALES', 'CORRALES DEL VINO', 'PELEAS DE ABAJO', 'VILLANUEVA DE CAMPEAN', 'EL CUBO DE TIERRA DEL VINO', 'FUENTESPREADAS', 'PEÑAUSENDE', 'SANTA CLARA DE AVEDILLO', 'CASASECA DE CAMPEAN', 'CUELGAMURES', 'JAMBRINA', 'MAYALDE', 'EL PIÑERO', 'PUERTA NUEVA', 'SANTA ELENA', 'ABEZAMES', 'MORALES DE TORO', 'PELEAGONZALO', 'PINILLA DE TORO', 'TORO', 'VEZDEMARBAN', 'VILLALONSO', 'BUSTILLO DEL ORO', 'POZOANTIGUO', 'VALDEFINJAS', 'FUENTESECAS', 'MALVA', 'VILLARDONDIEGO', 'VILLAVENDIMIO', 'AYOO DE VIDRIALES', 'BRIME DE SOG', 'VILLAGERIZ', 'ARRABALDE', 'CUBO DE BENAVENTE', 'GRANUCILLO', 'MOLEZUELAS DE LA CARBALLEDA', 'SANTIBAÑEZ DE VIDRIALES', 'UÑA DE QUINTANA', 'ALCUBILLA DE NOGALES', 'FUENTE ENCALADA', 'ALGODRE', 'ALMARAZ DE DUERO', 'ANDAVIAS', 'CUBILLOS', 'GALLEGOS DEL PAN', 'LA HINIESTA', 'MUELAS DEL PAN', 'VALCABADO', 'VILLALUBE', 'VILLASECO DEL PAN', 'ASPARIEGOS', 'MONTAMARTA', 'MORERUELA DE LOS INFANZONES', 'PALACIOS DEL PAN', 'ROALES', 'SAN PEDRO DE LA NAVE-ALMENDRA', 'BENEGILES', 'CORESES', 'FRESNO DE LA RIBERA', 'MATILLA LA SECA', 'MOLACILLOS', 'MONFARRACINOS', 'TORRES DEL CARRIZAL', 'VILLALCAMPO', 'ZAMORA NORTE', 'CAZURRA', 'ENTRALA', 'MORALEJA DEL VINO', 'SANZOLES', 'ARCENILLAS', 'GEMA', 'MORALES DEL VINO', 'EL PERDIGON', 'VILLALAZAN', 'ZAMORA SUR', 'CASASECA DE LAS CHANAS', 'MADRIDANOS', 'PERERUELA', 'VENIALBO', 'VILLARALBO', 'ARENAS DE SAN PEDRO', 'EL HORNILLO', 'EL ARENAL', 'GUISANDO', 'GAVILANES', 'LANZAHITA', 'MIJARES', 'PEDRO BERNARDO', 'CANDELEDA', 'POYALES DEL HOYO', 'CANTIVEROS', 'CISLA', 'COLLADO DE CONTRERAS', 'FONTIVEROS', 'SALVADIOS', 'BERNUY-ZAPARDIEL', 'MUÑOSANCHO', 'RIVILLA DE BARAJAS', 'CABEZAS DEL POZO', 'CRESPOS', 'FLORES DE AVILA', 'FUENTE EL SAUZ', 'GIMIALCON', 'CEPEDA LA MORA', 'SAN MARTIN DEL PIMPOLLAR', 'HOYOS DE MIGUEL MUÑOZ', 'HOYOS DEL ESPINO', 'NAVADIJOS', 'NAVARREDONDA DE GREDOS', 'SAN JUAN DE GREDOS', 'SAN MARTIN DE LA VEGA DEL ALBERCHE', 'GARGANTA DEL VILLAR', 'HOYOS DEL COLLADO', 'LA ADRADA', 'HIGUERA DE LAS DUEÑAS', 'SANTA MARIA DEL TIETAR', 'CASAVIEJA', 'CASILLAS', 'NAVAHONDILLA', 'PIEDRALAVES', 'SOTILLO DE LA ADRADA', 'FRESNEDILLA', 'CHAMARTIN', 'MIRUEÑA DE LOS INFANZONES', 'MUÑICO', 'CILLAN', 'HURTUMPASCUAL', 'MANCERA DE ARRIBA', 'SAN GARCIA DE INGELMOS', 'SAN JUAN DEL OLMO', 'SOLANA DE RIOALMAR', 'CABEZAS DEL VILLAR', 'GALLEGOS DE SOBRINOS', 'MANJABALAGO', 'NARRILLOS DEL REBOLLAR', 'VALDECASA', 'BASCUÑANA', 'FRESNEÑA', 'REDECILLA DEL CAMPO', 'SANTA CRUZ DEL VALLE URBION', 'TOSANTOS', 'VALLE DE OCA', 'VALMALA', 'VILLAFRANCA MONTES DE OCA', 'CASTILDELGADO', 'ESPINOSA DEL CAMINO', 'FRESNO DE RIO TIRON', 'IBRILLOS', 'PRADOLUENGO', 'VILORIA DE RIOJA', 'BELORADO', 'CEREZO DE RIO TIRON', 'CERRATON DE JUARROS', 'FRESNEDA DE LA SIERRA TIRON', 'REDECILLA DEL CAMINO', 'VILLAGALIJO', 'VILLAMBISTIA', 'CARCEDO DE BUREBA', 'CUBO DE BUREBA', 'GRISALEÑA', 'MIRAVECHE', 'QUINTANABUREBA', 'QUINTANILLA SAN GARCIA', 'REINOSO', 'RUBLACEDO DE ABAJO', 'SALAS DE BUREBA', 'SANTA MARIA RIVARREDONDA', 'SANTA OLALLA DE BUREBA', 'BAÑUELOS DE BUREBA', 'BRIVIESCA', 'CANTABRANA', 'CARRIAS', 'CASCAJARES DE BUREBA', 'CASTIL DE PEONES', 'PIERNIGAS', 'QUINTANAELEZ', 'RUCANDIO', 'VALLARTA DE BUREBA', 'LA VID DE BUREBA', 'VILEÑA', 'ABAJAS', 'AGUAS CANDIDAS', 'AGUILAR DE BUREBA', 'ALCOCERO DE MOLA', 'LOS BARRIOS DE BUREBA', 'BERZOSA DE BUREBA', 'BUSTO DE BUREBA', 'FUENTEBUREBA', 'LAS HORMAZAS', 'LLANO DE BUREBA', 'NAVAS DE BUREBA', 'OÑA', 'PADRONES DE BUREBA', 'POZA DE LA SAL', 'PRADANOS DE BUREBA', 'QUINTANAVIDES', 'ROJAS', 'VILLANUEVA DE TEBA', 'ZUÑEDA', 'CRISTOBAL ACOSTA', 'I. LOPEZ SAIZ', 'GAMONAL ANTIGUA', 'SAN AGUSTIN', 'JOSE LUIS SANTAMARIA', 'ASTORGA', 'BRAZUELO', 'MAGAZ DE CEPEDA', 'VAL DE SAN LORENZO', 'LUCILLO', 'LUYEGO', 'SANTA COLOMBA DE SOMOZA', 'SANTIAGO MILLAS', 'VILLAMEJIL', 'VALDERREY', 'VILLAGATON', 'LA PALOMERA', 'CRUCERO', 'JOSE AGUADO I', 'JOSE AGUADO II', 'VALDEFRESNO', 'VEGAS DEL CONDADO', 'VALDEPOLO', 'CUBILLAS DE RUEDA', 'GRADEFES', 'SANTA MARIA DEL MONTE DE CEA', 'VILLAMARTIN DE DON SANCHO', 'VILLAZANZO DE VALDERADUEY', 'CALZADA DEL COTO', 'CEA', 'ESCOBAR DE CAMPOS', 'GORDALIZA DEL PINO', 'VILLASELAN', 'BERCIANOS DEL REAL CAMINO', 'CASTROTIERRA DE VALMADRIGAL', 'GRAJAL DE CAMPOS', 'JOARILLA DE LAS MATAS', 'SAHAGUN', 'VALLECILLO', 'VILLAMOL', 'CAMPAZAS', 'LA UNION DE CAMPOS', 'VILLAQUEJIDA', 'GORDONCILLO', 'CIMANES DE LA VEGA', 'QUINTANILLA DEL MOLAR', 'ROALES DE CAMPOS', 'URONES DE CASTROPONCE', 'VALDERAS', 'IGÜEÑA', 'TORRE DEL BIERZO', 'BEMBIBRE', 'CASTROPODAME', 'FOLGOSO DE LA RIBERA', 'NOCEDA DEL BIERZO', 'PONFERRADA', 'PRIARANZA DEL BIERZO', 'PUENTE DE DOMINGO FLOREZ', 'BENUZA', 'BORRENES', 'AMAYUELAS DE ARRIBA', 'ASTUDILLO', 'BOADILLA DEL CAMINO', 'ITERO DEL CASTILLO', 'MELGAR DE YUSO', 'REVENGA DE CAMPOS', 'SAN CEBRIAN DE CAMPOS', 'SANTOYO', 'TAMARA DE CAMPOS', 'VILLALACO', 'AMUSCO', 'REQUENA DE CAMPOS', 'RIBAS DE CAMPOS', 'FROMISTA', 'ITERO DE LA VEGA', 'MARCILLA DE CAMPOS', 'PIÑA DE CAMPOS', 'POBLACION DE CAMPOS', 'VALBUENA DE PISUERGA', 'VILLODRE', 'VILLOVIECO', 'DEHESA DE ROMANOS', 'MICIECES DE OJEDA', 'OLEA DE BOEDO', 'OLMOS DE OJEDA', 'PARAMO DE BOEDO', 'PRADANOS DE OJEDA', 'REBOLLEDO DE LA TORRE', 'REVILLA DE COLLAZOS', 'SANTIBAÑEZ DE ECLA', 'LA VID DE OJEDA', 'ALAR DEL REY', 'CALAHORRA DE BOEDO', 'SOTOBAÑADO Y PRIORATO', 'BASCONES DE OJEDA', 'COLLAZOS DE BOEDO', 'HERRERA DE PISUERGA', 'PAYO DE OJEDA', 'VILLAMERIEL', 'BECERRIL DE CAMPOS', 'VALLE DEL RETORTILLO', 'FUENTES DE NAVA', 'PAREDES DE NAVA', 'RIBEROS DE LA CUEZA', 'VILLANUEVA DEL REBOLLAR', 'CARDEÑOSA DE VOLPEJERA', 'VILLAMUERA DE LA CUEZA', 'CAPILLAS', 'CASTROMOCHO', 'MENESES DE CAMPOS', 'ABARCA DE CAMPOS', 'AUTILLO DE CAMPOS', 'BELMONTE DE CAMPOS', 'FRECHILLA', 'GUAZA DE CAMPOS', 'MAZARIEGOS', 'MAZUECOS DE VALDEGINATE', 'PEDRAZA DE CAMPOS', 'TORREMORMOJON', 'VILLAMARTIN DE CAMPOS', 'VILLARRAMIEL', 'AMPUDIA', 'BAQUERIN DE CAMPOS', 'CASTIL DE VELA', 'VILLERIAS DE CAMPOS', 'CEREZAL DE PEÑAHORCADA', 'MIEZA', 'VILLASBUENAS', 'ALDEADAVILA DE LA RIBERA', 'BARRUECOPARDO', 'MASUECO', 'SALDEANA', 'SAUCELLE', 'EL MILANO', 'VILVESTRE', 'LA ZARZA DE PUMAREDA', 'SANTIZ', 'TOPAS', 'EL ARCO', 'CALZADA DE VALDUNCIEL', 'SAN PELAYO DE GUAREÑA', 'TORRESMENUDAS', 'ALDEARRODRIGO', 'AÑOVER DE TORMES', 'FORFOLEDA', 'PALACIOS DEL ARZOBISPO', 'VALDELOSA', 'VALDUNCIEL', 'ZAMAYON', 'PALACIOSRUBIOS', 'POVEDA DE LAS CINTAS', 'TARAZONA DE GUAREÑA', 'VILLAFLORES', 'ZORITA DE LA FRONTERA', 'CANTALAPIEDRA', 'LA ATALAYA', 'EL BODON', 'CASTILLEJO DE MARTIN VIEJO', 'LA ENCINA', 'SERRADILLA DEL ARROYO', 'SERRADILLA DEL LLANO', 'CIUDAD RODRIGO', 'MONSAGRO', 'PASTORES', 'SAELICES EL CHICO', 'SANCTI-SPIRITUS', 'TENEBRON', 'ZAMARRA', 'CARPIO DE AZABA', 'LA ALAMEDILLA', 'CAMPILLO DE AZABA', 'ITUERO DE AZABA', 'NAVASFRIAS', 'PUEBLA DE AZABA', 'LA ALBERGUERIA DE ARGAÑAN', 'CASILLAS DE FLORES', 'FUENTEGUINALDO', 'ALDEA DEL OBISPO', 'LA BOUZA', 'FUENTES DE OÑORO', 'PUERTO SEGURO', 'VILLAR DE ARGAÑAN', 'VILLAR DE CIERVO', 'LA ALAMEDA DE GARDON', 'ESPEJA', 'GALLEGOS DE ARGAÑAN', 'VILLAR DE LA YEGUA', 'ALAMEDILLA', 'DOÑINOS DE LEDESMA', 'ENCINA DE SAN SILVESTRE', 'GEJUELO DEL BARRO', 'LEDESMA', 'EL MANZANO', 'SANDO', 'SANTA MARIA DE SANDO', 'SARDON DE LOS FRAILES', 'VILLARMAYOR', 'MONLERAS', 'VILLASDARDO', 'VILLASECO DE LOS GAMITOS', 'VILLASECO DE LOS REYES', 'LA MATA DE LEDESMA', 'ROBLIZA DE COJOS', 'SANCHON DE LA SAGRADA', 'ALDEHUELA DE LA BOVEDA', 'CALZADA DE DON DIEGO', 'CANILLAS DE ABAJO', 'MATILLA DE LOS CAÑOS DEL RIO', 'VILLALBA DE LOS LLANOS', 'CARRASCAL DEL OBISPO', 'TABERA DE ABAJO', 'VECINOS', 'LAS VEGUILLAS', 'CEPEDA', 'HERGUIJUELA DE LA SIERRA', 'MADROÑAL', 'MIRANDA DEL CASTAÑAR', 'VILLANUEVA DEL CONDE', 'SOTOSERRANO', 'GARCIBUEY', 'SEQUEROS', 'ALDEALENGUA', 'ALDEARRUBIA', 'ALMENARA DE TORMES', 'CASTELLANOS DE MORISCOS', 'CASTELLANOS DE VILLIQUERA', 'MONTERRUBIO DE ARMUÑA', 'MORISCOS', 'SAN MORALES', 'VALVERDON', 'VILLARES DE LA REINA', 'JUZBADO', 'SAN CRISTOBAL DE LA CUESTA', 'CABRERIZOS', 'VILLAMAYOR', 'ALARAZ', 'CANTARACILLO', 'MALPARTIDA', 'SALMORAL', 'SANTIAGO DE LA PUEBLA', 'EL CAMPO DE PEÑARANDA', 'VENTOSA DEL RIO ALMAR', 'VILLAR DE GALLIMAZO', 'ALCONADA', 'ALDEASECA DE LA FRONTERA', 'BOVEDA DEL RIO ALMAR', 'MACOTERA', 'MANCERA DE ABAJO', 'NAVA DE SOTROBAL', 'PARADINAS DE SAN JUAN', 'PEÑARANDA DE BRACAMONTE', 'RAGAMA', 'TORDILLOS', 'PIZARRALES-VIDAL', 'HERGUIJUELA DE CIUDAD RODRIGO', 'MARTIAGO', 'ROBLEDA', 'EL SAHUGO', 'VILLASRUBIAS', 'PEÑAPARDA', 'AGALLAS', 'EL PAYO', 'PELABRAVO', 'CALVARRASA DE ABAJO', 'CALVARRASA DE ARRIBA', 'ENCINAS DE ABAJO', 'MACHACON', 'SANTA MARTA DE TORMES', 'VILLAGONZALO DE TORMES', 'AGUILAFUENTE', 'CANTIMPALOS', 'NAVALMANZANO', 'PINARNEGRILLO', 'ALDEA REAL', 'CARBONERO EL MAYOR', 'ESCALONA DEL PRADO', 'ESCARABAJOSA DE CABEZAS', 'ESCOBAR DE POLENDOS', 'FUENTEPELAYO', 'LASTRAS DE CUELLAR', 'MOZONCILLO', 'SAN MARTIN Y MUDRIAN', 'TABANERA LA LUENGA', 'YANGUAS DE ERESMA', 'ZARZUELA DEL PINAR', 'ALCONADA DE MADERUELO', 'AYLLON', 'RIBOTA', 'ALDEALENGUA DE SANTA MARIA', 'CEREZO DE ABAJO', 'CILLERUELO DE SAN MAMES', 'CORRAL DE AYLLON', 'FRESNO DE CANTESPINO', 'LANGUILLA', 'MADERUELO', 'RIAGUAS DE SAN BARTOLOME', 'RIAZA', 'CAMPO DE SAN PEDRO', 'CASTILLEJO DE MESLEON', 'CEREZO DE ARRIBA', 'MORAL DE HORNUEZ', 'SEQUERA DE FRESNO', 'SEGOVIA III', 'BOCEGUILLAS', 'CASTROSERNA DE ABAJO', 'CONDADO DE CASTILNOVO', 'FRESNO DE LA FUENTE', 'NAVARES DE ENMEDIO', 'PRADALES', 'VALLERUELA DE SEPULVEDA', 'ALDEANUEVA DE LA SERREZUELA', 'GRAJERA', 'SEPULVEDA', 'URUEÑAS', 'ALDEONTE', 'BARBOLLA', 'BERCIMUEL', 'CASTROSERRACIN', 'CEDILLO DE LA TORRE', 'DURUELO', 'ENCINAS', 'LA MATILLA', 'NAVARES DE AYUSO', 'NAVARES DE LAS CUEVAS', 'PAJAREJOS', 'SANTA MARTA DEL CERRO', 'SOTILLO', 'VALLERUELA DE PEDRAZA', 'ADRADAS', 'ALMAZAN', 'ALPANSEQUE', 'BORJABAD', 'MOMBLONA', 'NEPAS', 'VELAMAZAN', 'ALCUBILLA DE LAS PEÑAS', 'COSCURITA', 'MORON DE ALMAZAN', 'SOLIEDRA', 'ALENTISQUE', 'BARAONA', 'BARCA', 'CENTENERA DE ANDALUZ', 'ESCOBOSA DE ALMAZAN', 'MATAMALA DE ALMAZAN', 'NOLAY', 'TARODA', 'VILLASAYAS', 'ALMAZUL', 'GOMARA', 'VELILLA DE LOS AJOS', 'BLIECOS', 'CARABANTES', 'FUENTELMONGE', 'MAJAN', 'QUIÑONERIA', 'REZNOS', 'SERON DE NAGIMA', 'TORLENGUA', 'VILLASECA DE ARCIEL', 'ALMENAR DE SORIA', 'CAÑAMAQUE', 'CIHUELA', 'DEZA', 'TEJADO', 'TORRUBIA DE SORIA', 'CASAREJOS', 'ESPEJA DE SAN MARCELINO', 'ESPEJON', 'TALVEILA', 'CUBILLA', 'RABANERA DEL PINAR', 'SAN LEONARDO DE YAGÜE', 'SANTA MARIA DE LAS HOYAS', 'HERRERA DE SORIA', 'HONTORIA DEL PINAR', 'MURIEL VIEJO', 'NAVALENO', 'VADILLO', 'LOS RABANOS', 'SORIA SUR', 'BENAFARCES', 'CASASOLA DE ARION', 'CASTROMEMBIBRE', 'MOTA DEL MARQUES', 'SAN CEBRIAN DE MAZOTE', 'URUEÑA', 'VILLARDEFRADES', 'MARZALES', 'SAN PEDRO DE LATARCE', 'TIEDRA', 'VEGA DE VALDETRONCO', 'VILLALBARBA', 'VILLAVELLID', 'ADALIA', 'GALLEGOS DE HORNIJA', 'PARQUESOL', 'GERIA', 'SIMANCAS', 'CIGUÑUELA', 'ARROYO DE LA ENCOMIENDA', 'PARQUE ALAMEDA-COVARESA', 'CABEZON DE VALDERADUEY', 'CUENCA DE CAMPOS', 'FONTIHOYUELO', 'HERRIN DE CAMPOS', 'VEGA DE RUIPONCE', 'VILLACARRALON', 'VILLANUEVA DE LA CONDESA', 'BUSTILLO DE CHAVES', 'GATON DE CAMPOS', 'SANTERVAS DE CAMPOS', 'VILLABARUZ DE CAMPOS', 'VILLACID DE CAMPOS', 'VILLAGOMEZ LA NUEVA', 'CEINOS DE CAMPOS', 'VILLAFRADES DE CAMPOS', 'CASTRODEZA', 'ZARATAN', 'PEÑAFLOR DE HORNIJA', 'VILLANUBLA', 'WAMBA', 'CANILLAS DE ESGUEVA', 'CASTRILLO-TEJERIEGO', 'ESGUEVILLAS DE ESGUEVA', 'FOMBELLIDA', 'TORRE DE ESGUEVA', 'VILLACO', 'VILLANUEVA DE LOS INFANTES', 'CASTROVERDE DE CERRATO', 'VILLAFUERTE', 'AMUSQUILLO', 'ENCINAS DE ESGUEVA', 'OLMOS DE ESGUEVA', 'PIÑA DE ESGUEVA', 'MAGDALENA', 'TORTOLA', 'PILARICA', 'CIRCULAR', 'OLMEDO', 'ALMENARA DE ADAJA', 'HORNILLOS DE ERESMA', 'LLANO DE OLMEDO', 'LA ZARZA', 'ALCAZAREN', 'BOCIGAS', 'FUENTE-OLMEDO', 'PURAS', 'ARGUJILLO', 'CASTRILLO DE LA GUAREÑA', 'GUARRATE', 'EL MADERAL', 'VILLAESCUSA', 'VILLAMOR DE LOS ESCUDEROS', 'LA BOVEDA DE TORO', 'FUENTELAPEÑA', 'FUENTESAUCO', 'EL PEGO', 'SAN MIGUEL DE LA RIBERA', 'VADILLO DE LA GUAREÑA', 'VILLABUENA DEL PUENTE', 'VIRGEN DE LA CONCHA', 'AVILA ESTACION', 'AVILA SUR OESTE', 'ALDEANUEVA DE SANTA CRUZ', 'AVELLANEDA', 'LA CARRERA', 'JUNCIANA', 'SANTIAGO DEL TORMES', 'SOLANA DE AVILA', 'UMBRIAS', 'GILBUENA', 'LA HORCAJADA', 'LOS LLANOS DE TORMES', 'EL LOSAR DEL BARCO', 'MEDINILLA', 'SAN LORENZO DE TORMES', 'SANTA MARIA DE LOS CABALLEROS', 'ZAPARDIEL DE LA RIBERA', 'LA ALDEHUELA', 'EL BARCO DE AVILA', 'BECEDAS', 'BOHOYO', 'GIL GARCIA', 'NAVA DEL BARCO', 'NAVALONGUILLA', 'NAVALPERAL DE TORMES', 'NAVATEJARES', 'NEILA DE SAN MIGUEL', 'PUERTO CASTILLA', 'SAN BARTOLOME DE BEJAR', 'TORMELLAS', 'BERCIAL DE ZAPARDIEL', 'BLASCONUÑO DE MATACABRAS', 'CASTELLANOS DE ZAPARDIEL', 'HORCAJO DE LAS TORRES', 'MADRIGAL DE LAS ALTAS TORRES', 'RASUEROS', 'SAN ESTEBAN DE ZAPARDIEL', 'BARROMAN', 'MORALEJA DE MATACABRAS', 'MAMBLAS', 'GRANDES Y SAN MARTIN', 'NARROS DEL CASTILLO', 'PAPATRIGO', 'RIOCABADO', 'SAN PEDRO DEL ARROYO', 'SIGERES', 'VITA', 'ALBORNOS', 'HERREROS DE SUSO', 'NARROS DE SALDUEÑA', 'EL PARRAL', 'SAN JUAN DE LA ENCINILLA', 'VIÑEGRA DE MORAÑA', 'AVEINTE', 'BLASCOMILLAN', 'BRABOS', 'BULARROS', 'CABIZUELA', 'MUÑOGRANDE', 'MUÑOMER DEL PECO', 'SANTO TOME DE ZABARCOS', 'VILLAFLOR', 'POVEDA', 'SANTA MARIA DEL ARROYO', 'SOLOSANCHO', 'LA TORRE', 'VADILLO DE LA SIERRA', 'VILLATORO', 'LA HIJA DE DIOS', 'MUÑANA', 'PRADOSEGAR', 'AMAVIDA', 'MENGAMUÑOZ', 'MUÑOGALINDO', 'MUÑOTELLO', 'NARROS DEL PUERTO', 'VILLANUEVA DEL CAMPILLO', 'ALBILLOS', 'ARCOS', 'BUNIEL', 'CAVIA', 'MADRIGAL DEL MONTE', 'PEDROSA DE RIO URBEL', 'RABE DE LAS CALZADAS', 'REVILLA DEL CAMPO', 'SALDAÑA DE BURGOS', 'SAN MAMES DE BURGOS', 'VALDORROS', 'VILLAGONZALO PEDERNALES', 'VILLAMIEL DE LA SIERRA', 'VILLANGOMEZ', 'VILLARIEZO', 'VILLORUEBO', 'BURGOS RURAL SUR', 'CARDEÑADIJO', 'CASTRILLO DEL VAL', 'CAYUELA', 'COGOLLOS', 'CUBILLO DEL CAMPO', 'ISAR', 'PALAZUELOS DE LA SIERRA', 'REVILLARRUZ', 'SARRACIN', 'TARDAJOS', 'LOS AUSINES', 'CARCEDO DE BURGOS', 'CARDEÑAJIMENO', 'CELADA DEL CAMINO', 'ESTEPAR', 'FRANDOVINEZ', 'HORNILLOS DEL CAMINO', 'IBEAS DE JUARROS', 'MODUBAR DE LA EMPAREDADA', 'LAS QUINTANILLAS', 'SAN ADRIAN DE JUARROS', 'TORRELARA', 'VILLALBILLA DE BURGOS', 'VILLANUEVA DE ARGAÑO', 'LA PUEBLA DE ARGANZON', 'CONDADO DE TREVIÑO', 'GAMONAL LAS TORRES', 'BRAZACORTA', 'ARAUZO DE MIEL', 'ARAUZO DE TORRE', 'HUERTA DE REY', 'ARAUZO DE SALCE', 'CORUÑA DEL CONDE', 'AVELLANOSA DE MUÑO', 'CILLERUELO DE ABAJO', 'FONTIOSO', 'LERMA', 'MECERREYES', 'OQUILLAS', 'PINILLA TRASMONTE', 'QUINTANILLA DEL AGUA Y TORDUELES', 'QUINTANILLA DEL COCO', 'SANTIBAÑEZ DE ESGUEVA', 'TEJADA', 'TORRECILLA DEL MONTE', 'TORREPADRE', 'VILLAFRUELA', 'VILLALMANZO', 'VILLAMAYOR DE LOS MONTES', 'CEBRECOS', 'CILLERUELO DE ARRIBA', 'MADRIGALEJO DEL MONTE', 'NEBREDA', 'PUENTEDURA', 'RETUERTA', 'ROYUELA DE RIO FRANCO', 'SANTA CECILIA', 'SANTIBAÑEZ DEL VAL', 'SOLARANA', 'TORDOMAR', 'VILLAHOZ', 'ZAEL', 'BAHABON DE ESGUEVA', 'CABAÑES DE ESGUEVA', 'CIRUELOS DE CERVERA', 'COVARRUBIAS', 'CUEVAS DE SAN CLEMENTE', 'IGLESIARRUBIA', 'PINEDA TRASMONTE', 'QUINTANILLA DE LA MATA', 'SANTA INES', 'LOS COMUNEROS', 'LOS CUBOS', 'BARBADILLO DE HERREROS', 'CASTRILLO DE LA REINA', 'CONTRERAS', 'LA GALLEGA', 'HACINAS', 'JARAMILLO DE LA FUENTE', 'PINILLA DE LOS BARRUECOS', 'VALLE DE VALDELAGUNA', 'VIZCAINOS', 'BARBADILLO DEL MERCADO', 'BARBADILLO DEL PEZ', 'CAMPOLARA', 'CARAZO', 'HORTIGÜELA', 'MONCALVILLO', 'SALAS DE LOS INFANTES', 'SAN MILLAN DE LARA', 'SANTO DOMINGO DE SILOS', 'CABEZON DE LA SIERRA', 'HUERTA DE ARRIBA', 'MAMBRILLAS DE LARA', 'MAMOLAR', 'MONTERRUBIO DE LA DEMANDA', 'PINILLA DE LOS MOROS', 'LA REVILLA Y AHEDO', 'RIOCAVADO DE LA SIERRA', 'SANTA CLARA', 'JUNTA DE VILLALBA DE LOSA', 'BERBERANA', 'VALLE DE LOSA', 'PARTIDO DE LA SIERRA EN TOBALINA', 'VALLE DE TOBALINA', 'FRIAS', 'ALFOZ DE BRICIA', 'ARIJA', 'MERINDAD DE VALDEPORRES', 'ALFOZ DE SANTA GADEA', 'VALLE DE VALDEBEZANA', 'PEDROSA DEL PARAMO', 'SOTRESGUDO', 'SUSINOS DEL PARAMO', 'SORDILLOS', 'TOBAR', 'VILLADIEGO', 'VILLAMAYOR DE TREVIÑO', 'GRIJALBA', 'HUMADA', 'MANCILES', 'VILLEGAS', 'VALLE DE MENA', 'MERINDAD DE VALDIVIELSO', 'VALLE DE MANZANEDO', 'VILLARCAYO DE MERINDAD DE CASTILLA LA VIEJA', 'SAN JUSTO DE LA VEGA', 'VILLAOBISPO DE OTERO', 'CABRILLANES', 'SAN EMILIANO', 'SENA DE LUNA', 'ALIJA DEL INFANTADO', 'LA ANTIGUA', 'DESTRIANA', 'PALACIOS DE LA VALDUERNA', 'REGUERAS DE ARRIBA', 'RIEGO DE LA VEGA', 'ROPERUELOS DEL PARAMO', 'SAN ADRIAN DEL VALLE', 'SAN CRISTOBAL DE LA POLANTERA', 'CASTRILLO DE LA VALDUERNA', 'CASTROCALBON', 'QUINTANA DEL MARCO', 'VALDEFUENTES DEL PARAMO', 'VILLAZALA', 'CASTROCONTRIGO', 'CEBRONES DEL RIO', 'POZUELO DEL PARAMO', 'QUINTANA Y CONGOSTO', 'SAN ESTEBAN DE NOGALES', 'VILLAMONTAN DE LA VALDUERNA', 'ENCINEDO', 'CASTRILLO DE CABRERA', 'TRUCHAS', 'RIOSECO DE TAPIA', 'SANTA MARIA DE ORDAS', 'SOTO Y AMIO', 'CARROCERA', 'VALDESAMARIO', 'LOS BARRIOS DE LUNA', 'MURIAS DE PAREDES', 'LAS OMAÑAS', 'MATALLANA DE TORIO', 'VEGACERVERA', 'CARMENES', 'MARAÑA', 'RIAÑO', 'BURON', 'ACEBEDO', 'BOCA DE HUERGANO', 'OSEJA DE SAJAMBRE', 'POSADA DE VALDEON', 'SARIEGOS', 'CUADROS', 'LAGUNA DE NEGRILLOS', 'POBLADURA DE PELAYO GARCIA', 'SAN PEDRO BERCIANOS', 'VALDEVIMBRE', 'SANTA MARIA DEL PARAMO', 'BERCIANOS DEL PARAMO', 'LAGUNA DALGA', 'URDIALES DEL PARAMO', 'ZOTES DEL PARAMO', 'CASTILFALE', 'FUENTES DE CARBAJAL', 'VILLADEMOR DE LA VEGA', 'CABREROS DEL RIO', 'CUBILLAS DE LOS OTEROS', 'MATADEON DE LOS OTEROS', 'MATANZA', 'VILLABRAZ', 'VILLAMAÑAN', 'VILLAORNATE Y CASTRO', 'ALGADEFE', 'FRESNO DE LA VEGA', 'PAJARES DE LOS OTEROS', 'SAN MILLAN DE LOS CABALLEROS', 'TORAL DE LOS GUZMANES', 'VALDEMORA', 'VALENCIA DE DON JUAN', 'VILLAMANDOS', 'ARGANZA', 'CACABELOS', 'CAMPONARAYA', 'CARRACEDELO', 'SANCEDO', 'CONGOSTO', 'MOLINASECA', 'CUBILLOS DEL SIL', 'CABAÑAS RARAS', 'BUSTILLO DEL PARAMO DE CARRION', 'LOMAS', 'PERALES', 'CARRION DE LOS CONDES', 'CERVATOS DE LA CUEZA', 'MANQUILLOS', 'NOGAL DE LAS HUERTAS', 'LA SERNA', 'VILLANUÑO DE VALDAVIA', 'VILLATURDE', 'VILLOLDO', 'ARCONADA', 'CALZADA DE LOS MOLINOS', 'LOMA DE UCIEZA', 'SAN MAMES DE CAMPOS', 'VALDE-UCIEZA', 'VILLALCAZAR DE SIRGA', 'VILLAMORONTA', 'FRESNO DEL RIO', 'MANTINOS', 'SANTIBAÑEZ DE LA PEÑA', 'VILLALBA DE GUARDO', 'RESPENDA DE LA PEÑA', 'VELILLA DEL RIO CARRION', 'CONGOSTO DE VALDAVIA', 'GUARDO', 'JARDINILLOS', 'FUENTES DE VALDEPERO', 'MONZON DE CAMPOS', 'VALDEOLMILLOS', 'VILLAUMBRALES', 'HUSILLOS', 'MAGAZ DE PISUERGA', 'PALENCIA RURAL', 'SANTA CECILIA DEL ALCOR', 'SOTO DE CERRATO', 'AUTILLA DEL PINO', 'GRIJOTA', 'VILLALOBON', 'PINTOR OLIVA', 'AYUELA', 'BUSTILLO DE LA VEGA', 'POZA DE LA VEGA', 'RENEDO DE LA VEGA', 'TABANERA DE VALDAVIA', 'VALDERRABANO', 'VILLAELES DE VALDAVIA', 'VILLARRABE', 'VILLASILA DE VALDAVIA', 'PINO DEL RIO', 'LA PUEBLA DE VALDAVIA', 'QUINTANILLA DE ONSOÑA', 'SALDAÑA', 'VILLABASTA DE VALDAVIA', 'VILLOTA DEL PARAMO', 'BUENAVISTA DE VALDAVIA', 'PEDROSA DE LA VEGA', 'SANTERVAS DE LA VEGA', 'VILLALUENGA DE LA VEGA', 'POZO DE URAMA', 'LAGARTOS', 'LEDIGOS', 'VILLADA', 'BOADILLA DE RIOSECO', 'CISNEROS', 'MORATINOS', 'POBLACION DE ARROYO', 'SAN ROMAN DE LA CUBA', 'VILLACIDALER', 'VILLALCON', 'VILLAMURIEL DE CERRATO', 'ALDEASECA DE ALBA', 'ARMENTEROS', 'BELEÑA', 'CHAGARCIA MEDIANERO', 'COCA DE ALBA', 'GAJATES', 'GALISANCHO', 'LARRODRIGO', 'NAVALES', 'PEDROSILLO DE ALBA', 'PEDROSILLO DE LOS AIRES', 'PELAYOS', 'VALDEMIERQUE', 'ANAYA DE ALBA', 'BUENAVISTA', 'EJEME', 'HORCAJO MEDIANERO', 'LA MAYA', 'PEDRAZA DE ALBA', 'SIETEIGLESIAS DE TORMES', 'TERRADILLOS', 'ALBA DE TORMES', 'ENCINAS DE ARRIBA', 'FRESNO ALHANDIGA', 'GALINDUSTE', 'GARCIHERNANDEZ', 'MARTINAMOR', 'PEÑARANDILLA', 'VALDECARROS', 'MIGUEL ARMIJO', 'GARRIDO NORTE', 'GARRIDO SUR', 'LA CABEZA DE BEJAR', 'FUENTERROBLE DE SALVATIERRA', 'GUIJO DE AVILA', 'PEROMINGO', 'PUEBLA DE SAN MEDEL', 'LA TALA', 'ALDEAVIEJA DE TORMES', 'CESPEDOSA DE TORMES', 'FRESNEDOSO', 'GALLEGOS DE SOLMIRON', 'GUIJUELO', 'NAVA DE BEJAR', 'NAVAMORALES', 'PIZARRAL', 'PUENTE DEL CONGOSTO', 'LOS SANTOS', 'BERROCAL DE SALVATIERRA', 'CASAFRANCA', 'FUENTES DE BEJAR', 'LEDRADA', 'MONTEJO', 'SALVATIERRA DE TORMES', 'SANTIBAÑEZ DE BEJAR', 'SORIHUELA', 'VALDELACASA', 'VALVERDE DE VALDELACASA', 'HERGUIJUELA DEL CAMPO', 'MEMBRIBE DE LA SIERRA', 'SAN ESTEBAN DE LA SIERRA', 'SAN MIGUEL DE VALERO', 'LA SIERPE', 'EL TORNADIZO', 'ENDRINAL', 'ESCURIAL DE LA SIERRA', 'FRADES DE LA SIERRA', 'LINARES DE RIOFRIO', 'MONLEON', 'BARBALOS', 'VALERO', 'CABEZABELLOSA DE LA CALZADA', 'PARADA DE RUBIALES', 'PITIEGUA', 'TARDAGUILA', 'VALLESA DE LA GUAREÑA', 'LA VELLES', 'VILLAVERDE DE GUAREÑA', 'ARCEDIANO', 'CAÑIZAL', 'ESPINO DE LA ORBADA', 'LA ORBADA', 'PEDROSILLO EL RALO', 'ALDEANUEVA DE FIGUEROA', 'GOMECELLO', 'NEGRILLA DE PALENCIA', 'PAJARES DE LA LAGUNA', 'PALENCIA DE NEGRILLA', 'ALDEATEJADA', 'CARBAJOSA DE LA SAGRADA', 'MONTERRUBIO DE LA SIERRA', 'EL PINO DE TORMES', 'PERIURBANO SUR', 'SAN PEDRO DEL VALLE', 'VEGA DE TIRADOS', 'ZARAPICOS', 'DOÑINOS DE SALAMANCA', 'GALINDO Y PERAHUY', 'GOLPEJAS', 'MIRANDA DE AZAN', 'ROLLAN', 'ARAPILES', 'BARBADILLO', 'CARRASCAL DE BARREGAS', 'MORILLE', 'MOZARBEZ', 'PARADA DE ARRIBA', 'SAN PEDRO DE ROZADOS', 'ALBA DE YELTES', 'ALDEANUEVA DE LA SIERRA', 'BERROCAL DE HUEBRA', 'CERECEDA DE LA SIERRA', 'CILLEROS DE LA BASTIDA', 'MORASVERDES', 'ABUSEJO', 'DIOS LE GUARDE', 'NAVARREDONDA DE LA RINCONADA', 'TEJEDA Y SEGOYUELA', 'ALDEHUELA DE YELTES', 'LA BASTIDA', 'NARROS DE MATALAYEGUA', 'PUEBLA DE YELTES', 'LA RINCONADA DE LA SIERRA', 'SEPULCRO-HILARIO', 'TAMAMES', 'ELENA GINEL DIEZ', 'ARABAYONA DE MOGICA', 'BABILAFUENTE', 'CANTALPINO', 'EL PEDROSO DE LA ARMUÑA', 'CORDOVILLA', 'MORIÑIGO', 'VILLORUELA', 'ALMENDRA', 'BOGAJO', 'BRINCONES', 'CABEZA DEL CABALLO', 'ENCINASOLA DE LOS COMENDADORES', 'ESPADAÑA', 'PERALEJOS DE ARRIBA', 'POZOS DE HINOJO', 'SANCHON DE LA RIBERA', 'TRABANCA', 'VALDERRODRIGO', 'VALSALABROSO', 'LA VIDOLA', 'VILLAR DE PERALONSO', 'VILLARMUERTO', 'VILLAVIEJA DE YELTES', 'GUADRAMIRO', 'IRUELOS', 'MORONTA', 'PEREÑA DE LA RIBERA', 'VITIGUDINO', 'AHIGAL DE VILLARINO', 'BARCEO', 'CIPEREZ', 'LA PEÑA', 'PERALEJOS DE ABAJO', 'PUERTAS', 'VILLAR DE SAMANIEGO', 'VILLARES DE YELTES', 'VILLARINO DE LOS AIRES', 'YECLA DE YELTES', 'UNIVERSIDAD CENTRO', 'COZUELOS DE FUENTIDUEÑA', 'FUENTEPIÑEL', 'FUENTESAUCO DE FUENTIDUEÑA', 'MEMBIBRE DE LA HOZ', 'ALDEASOÑA', 'HONTALBILLA', 'TORRECILLA DEL PINAR', 'ADRADOS', 'CALABAZAS DE FUENTIDUEÑA', 'PEROSILLO', 'BERNARDOS', 'COCA', 'JUARROS DE VOLTOYA', 'MELQUE DE CERCOS', 'MIGUELAÑEZ', 'ALDEANUEVA DEL CODONAL', 'DOMINGO GARCIA', 'FUENTE DE SANTA CRUZ', 'NAVA DE LA ASUNCION', 'ORTIGOSA DE PESTAÑO', 'ALDEHUELA DEL CODONAL', 'NAVAS DE ORO', 'NIEVA', 'SANTA MARIA LA REAL DE NIEVA', 'SANTIUSTE DE SAN JUAN BAUTISTA', 'VILLEGUILLO', 'SEGOVIA II', 'ABADES', 'AÑE', 'BRIEVA', 'CABAÑAS DE POLENDOS', 'OTERO DE HERREROS', 'RODA DE ERESMA', 'SEGOVIA RURAL', 'VALVERDE DEL MAJANO', 'BERCIAL', 'BERNUY DE PORREROS', 'ENCINILLAS', 'GARCILLAN', 'HONTANARES DE ERESMA', 'MARAZOLEJA', 'MARAZUELA', 'MARTIN MIGUEL', 'MARUGAN', 'ORTIGOSA DEL MONTE', 'SAN CRISTOBAL DE SEGOVIA', 'SANGARCIA', 'TORRECABALLEROS', 'VALSECA', 'ADRADA DE PIRON', 'ANAYA', 'ARMUÑA', 'ESPIRDO', 'LOS HUERTOS', 'JUARROS DE RIOMOROS', 'LASTRAS DEL POZO', 'LA LASTRILLA', 'LA LOSA', 'MUÑOPEDRO', 'NAVAS DE RIOFRIO', 'PALAZUELOS DE ERESMA', 'SANTO DOMINGO DE PIRON', 'TRESCASAS', 'MAELLO', 'MONTERRUBIO', 'VEGAS DE MATUTE', 'VILLACASTIN', 'NAVAS DE SAN ANTONIO', 'VALDEPRADOS', 'ZARZUELA DEL MONTE', 'ITUERO Y LAMA', 'LABAJOS', 'SAN ILDEFONSO', 'CASTILRUIZ', 'DEVANOS', 'VOZMEDIANO', 'AGREDA', 'CIGUDOSA', 'MAGAÑA', 'TREVAGO', 'VALDELAGUA DEL CERRO', 'FUENTESTRUN', 'MATALEBRERAS', 'SAN FELICES', 'BLACOS', 'FRESNO DE CARACENA', 'GORMAZ', 'RECUERDA', 'RIOSECO DE SORIA', 'UCERO', 'VALDENEBRO', 'BURGO DE OSMA-CIUDAD DE OSMA', 'CARRASCOSA DE ABAJO', 'NAFRIA DE UCERO', 'QUINTANAS DE GORMAZ', 'VALDEMALUQUE', 'TORREBLACOS', 'VILLANUEVA DE GORMAZ', 'BERATON', 'BOROBIA', 'HINOJOSA DEL CAMPO', 'TAJAHUERCE', 'CUEVA DE AGREDA', 'NOVIERCAS', 'CIRIA', 'OLVEGA', 'PINILLA DEL CAMPO', 'POZALMURO', 'ALDEALAFUENTE', 'ALMAJANO', 'ALMARZA', 'AUSEJO DE LA SIERRA', 'MURIEL DE LA FUENTE', 'REBOLLAR', 'RENIEBLAS', 'ROLLAMIENTA', 'EL ROYO', 'VALDEAVELLANO DE TERA', 'VILLACIERVOS', 'VILLAR DEL CAMPO', 'ABEJAR', 'ALDEALSEÑOR', 'ARANCON', 'CABREJAS DEL PINAR', 'CALATAÑAZOR', 'CANDILICHERA', 'CARRASCOSA DE LA SIERRA', 'CIDONES', 'CIRUJALES DEL RIO', 'CUBO DE LA SOLANA', 'GARRAY', 'LA LOSILLA', 'NARROS', 'SORIA RURAL', 'TARDELCUENDE', 'LOS VILLARES DE SORIA', 'ALCONABA', 'ALDEALICES', 'ALDEALPOZO', 'AREVALO DE LA SIERRA', 'CABREJAS DEL CAMPO', 'CASTILFRIO DE LA SIERRA', 'FUENTECANTOS', 'GOLMAYO', 'LA POVEDA DE SORIA', 'SOTILLO DEL RINCON', 'SUELLACABRAS', 'VALDEGEÑA', 'VILLAR DEL ALA', 'LAS ALDEHUELAS', 'CERBON', 'VILLAR DEL RIO', 'VIZMANOS', 'YANGUAS', 'FUENTES DE MAGAÑA', 'ONCALA', 'SAN PEDRO MANRIQUE', 'SANTA CRUZ DE YANGUAS', 'ARTURO EYRIES', 'CASA DEL BARCO', 'PLAZA DEL EJERCITO', 'HUERTA DEL REY', 'BOECILLO', 'LAGUNA DE DUERO', 'VIANA DE CEGA', 'AGUILAR DE CAMPOS', 'POZUELO DE LA ORDEN', 'VILLAFRECHOS', 'BARCIAL DE LA LOMA', 'BOLAÑOS DE CAMPOS', 'PALAZUELO DE VEDIJA', 'TORDEHUMOS', 'VILLAMURIEL DE CAMPOS', 'CABREROS DEL MONTE', 'MORALES DE CAMPOS', 'SANTA EUFEMIA DEL ARROYO', 'VILLAGARCIA DE CAMPOS', 'VILLANUEVA DE LOS CABALLEROS', 'CISTERNIGA', 'DELICIAS I', 'BARRIO ESPAÑA', 'CIRCUNVALACION', 'COGECES DE ISCAR', 'FUENTE EL OLMO DE ISCAR', 'PEDRAJAS DE SAN ESTEBAN', 'MATA DE CUELLAR', 'MEGECES', 'VILLAVERDE DE ISCAR', 'ISCAR', 'REMONDO', 'RONDILLA II', 'CANTERAC', 'CURIEL DE DUERO', 'LANGAYO', 'PEÑAFIEL', 'RABANO', 'SAN LLORENTE', 'VALBUENA DE DUERO', 'BOCOS DE DUERO', 'CAMPASPERO', 'CANALEJAS DE PEÑAFIEL', 'CASTRILLO DE DUERO', 'COGECES DEL MONTE', 'MANZANILLO', 'PIÑEL DE ABAJO', 'PIÑEL DE ARRIBA', 'QUINTANILLA DE ARRIBA', 'BAHABON', 'CORRALES DE DUERO', 'FOMPEDRAZA', 'OLMOS DE PEÑAFIEL', 'PESQUERA DE DUERO', 'TORRE DE PEÑAFIEL', 'TORRESCARCELA', 'VALDEARCOS DE LA VEGA', 'CAMPORREDONDO', 'MONTEMAYOR DE PILILLA', 'LA PEDRAJA DE PORTILLO', 'SAN MIGUEL DEL ARROYO', 'VILORIA', 'ALDEA DE SAN MIGUEL', 'ALDEAMAYOR DE SAN MARTIN', 'MOJADOS', 'PORTILLO', 'MATAPOZUELOS', 'VENTOSA DE LA CUESTA', 'SERRADA', 'VALDESTILLAS', 'LA SECA', 'VILLANUEVA DE DUERO', 'QUINTANILLA DE ONESIMO', 'SARDON DE DUERO', 'VILLABAÑEZ', 'OLIVARES DE DUERO', 'LA PARRILLA', 'TUDELA DE DUERO', 'SANTIBAÑEZ DE VALCORBA', 'TRASPINEDO', 'VILLAVAQUERIN', 'CASTREJON DE TRABANCOS', 'SIETE IGLESIAS DE TRABANCOS', 'TORRECILLA DE LA ORDEN', 'ALAEJOS', 'CASTRONUÑO', 'VILLAFRANCA DE DUERO', 'EL CAMPILLO', 'CARPIO', 'FRESNO EL VIEJO', 'MEDINA DEL CAMPO', 'MURIEL', 'RUBI DE BRACAMONTE', 'RUEDA', 'SAN PABLO DE LA MORALEJA', 'VILLAVERDE DE MEDINA', 'BRAHOJOS DE MEDINA', 'FUENTE EL SOL', 'LOMOVIEJO', 'NUEVA VILLA DE LAS TORRES', 'POZALDEZ', 'SAN VICENTE DEL PALACIO', 'VELASCALVARO', 'ATAQUINES', 'BOBADILLA DEL CAMPO', 'CERVILLEGO DE LA CRUZ', 'MORALEJA DE LAS PANADERAS', 'NAVA DEL REY', 'POZAL DE GALLINAS', 'RAMIRO', 'SALVADOR DE ZAPARDIEL', 'HERMISENDE', 'PORTO', 'LUBIAN', 'PIAS', 'ARQUILLINOS', 'GRANJA DE MORERUELA', 'VIDAYANES', 'VILLAFAFILA', 'VILLARRIN DE CAMPOS', 'BELVER DE LOS MONTES', 'MANGANESES DE LA LAMPREANA', 'PAJARES DE LA LAMPREANA', 'PIEDRAHITA DE CASTRO', 'CASTRONUEVO', 'CERECINOS DEL CARRIZAL', 'POBLADURA DE VALDERADUEY', 'REVELLINOS', 'SAN AGUSTIN DEL POZO', 'SAN CEBRIAN DE CASTRO', 'VILLALBA DE LA LAMPREANA', 'SANTA EUFEMIA DEL BARCO', 'VEGALATRAVE', 'CARBAJALES DE ALBA', 'LOSACIO', 'MANZANAL DEL BARCO', 'OLMILLOS DE CASTRO', 'LOSACINO', 'VIDEMALA', 'ASTURIANOS', 'ESPADAÑEDO', 'MANZANAL DE ARRIBA', 'MANZANAL DE LOS INFANTES', 'ROSINOS DE LA REQUEJADA', 'JUSTEL', 'MOMBUEY', 'PEQUE', 'RIONEGRO DEL PUENTE', 'VILLARDECIERVOS', 'CERNADILLA', 'FERRERAS DE ARRIBA', 'MUELAS DE LOS CABALLEROS', 'PALACIOS DE SANABRIA', 'TREFACIO', 'COBREROS', 'PEDRALBA DE LA PRADERIA', 'ROBLEDA-CERVANTES', 'GALENDE', 'PUEBLA DE SANABRIA', 'REQUEJO', 'SAN JUSTO', 'CARBELLINO', 'GAMONES', 'MORAL DE SAYAGO', 'MORALINA', 'SALCE', 'VILLADEPERA', 'VILLARDIEGUA DE LA RIBERA', 'ARGAÑIN', 'FRESNO DE SAYAGO', 'LUELMO', 'MORALEJA DE SAYAGO', 'ROELOS DE SAYAGO', 'TORREGAMONES', 'VILLAR DEL BUEY', 'ALFARAZ DE SAYAGO', 'ALMEIDA DE SAYAGO', 'BERMILLO DE SAYAGO', 'FARIZA', 'FERMOSELLE', 'MUGA DE SAYAGO', 'MORALES DE VALVERDE', 'OTERO DE BODAS', 'POZUELO DE TABARA', 'RIOFRIO DE ALISTE', 'TABARA', 'FERRERAS DE ABAJO', 'PUEBLICA DE VALVERDE', 'FARAMONTANOS DE TABARA', 'FERRERUELA', 'MORERUELA DE TABARA', 'PERILLA DE CASTRO', 'SANTA MARIA DE VALVERDE', 'VILLAVEZA DE VALVERDE', 'PRADO', 'QUINTANILLA DEL MONTE', 'SAN ESTEBAN DEL MOLAR', 'VILLAMAYOR DE CAMPOS', 'VILLAR DE FALLAVES', 'CERECINOS DE CAMPOS', 'COTANES DEL MONTE', 'QUINTANILLA DEL OLMO', 'SAN MARTIN DE VALDERADUEY', 'VEGA DE VILLALOBOS', 'VILLALOBOS', 'VILLALPANDO', 'VILLARDIGA', 'CAÑIZO', 'CASTROVERDE DE CAMPOS', 'TAPIOLES', 'VILLANUEVA DEL CAMPO'];
    
	var normalize = function(term) {
		var ret = "";
		for (var i = 0; i < term.length; i++) {
			ret += term.charAt(i);
		}
		return ret;
	};

	$('#town').autocomplete({

        minLength: 1,
        autoFocus: true,
        source: function(request, response) {
        	if (request.term.length > 3){
        		var term = request.term;
        		term = term.replace("á", "a");
        		term = term.replace("Á", "A");
        		term = term.replace("é", "e");
        		term = term.replace("É", "E");
        		term = term.replace("í", "i");
        		term = term.replace("Í", "I");
        		term = term.replace("ó", "o");
        		term = term.replace("Ó", "O");
        		term = term.replace("ú", "u");
        		term = term.replace("Ú", "U");

        		var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
    	    	response($.grep(towns, function(value) {
        			value = value.truc || value.value || value;
        			return matcher.test(value) || matcher.test(normalize(value));
        		}));
        	}
        }
    });

    function readTextFile(file, callback) {
	    var rawFile = new XMLHttpRequest();
	    rawFile.overrideMimeType("application/json");
	    rawFile.open("GET", file, true);
	    rawFile.onreadystatechange = function() {
	        if (rawFile.readyState === 4 && rawFile.status == "200") {
	            callback(rawFile.responseText);
	        }
	    }
	    rawFile.send(null);
	}

    $('#show-town').click(function(){
		if (towns.indexOf($('#town').val()) > -1) {
			var town = $('#town').val();
		    var officeCode = townsInfo[town]["gerencia"];
		    var healthZone = townsInfo[town]["zbs_geo"];

		    var officeTxt = getOfficetxtForOfficeCode(officeCode);
		   	window.location.href = buildForwardingURL(undefined, officeTxt, healthZone);

		} else {
			swal("¡No hemos encontrado el municipio!", "Por favor, intenta elegir uno de los sugeridos o escribe uno cercano", "error");
		}
	});

  function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
  }

  function getNameGraphOption(graphOption){
    return $("#graph-param option[value='" + graphOption + "']").html();
  }

  function buildGraphValues(){
    graphValues = [];
    for (var i = 0; i < Object.values(graphData).length; i++) {
      var value = Object.values(graphData)[i][$('#graph-param').children("option:selected").val()];
      graphValues.push(value);
    }

    buildGraphImg(Object.keys(graphData), graphValues, $('#graph-param').children("option:selected").val());

    $('#noGraph').hide();
  }

  function buildGraphImg(dates, data, graphOption){
    var myChart = Highcharts.chart('graphContainer', {
      chart: {
          type: 'column'
      },
      title: {
          text: getNameGraphOption(graphOption)
      },
      xAxis: {
          categories: dates
      },
      yAxis: {
        max: Math.max(...data),
        title: {
          text: ''
        }
      },
      series: [{
        name: 'Num. casos',
          data: data,
          showInLegend: false
      }],
      exporting:{ 
        buttons: {
          contextButton: {
            menuItems: [{
              textKey: 'downloadPNG',
              text: 'Descargar PNG',
              onclick: function () {
                this.exportChart();
              }
            }, {
              textKey: 'downloadJPEG',
              text: 'Descargar JPEG',
              onclick: function () {
                this.exportChart({
                  type: 'image/jpeg'
                });
              }
            }, {
              textKey: 'downloadPDF',
              text: 'Descargar PDF',
              onclick: function () {
                this.exportChart({
                  type: 'application/pdf'
                });
              }
            }, {
              textKey: 'downloadSVG',
              text: 'Descargar SVG',
              onclick: function () {
                this.exportChart({
                  type: 'image/svg+xml'
                });
              }
            }]
          }
        }
        }
    }, function (myChart) {

      myChart.renderer.image('https://www.bmsalamanca.com/others/CoViDCyL/watermark.png',myChart.plotLeft + myChart.plotSizeX - 200, 10, 173, 40)
            .add();
    });

  }

  function buildGraphData(data){

    for (var i = 0; i < data.length; i++) {
      curatedData.push(data[i]["fields"]);
    }

    for (var i = 0; i < curatedData.length; i++) {

      if (graphData[curatedData[i]["fecha"]] === undefined){

        var date = {
          "totalenfermedad": 0,
          "pcrpositivos": 0,
          "pcrpositivos7dias": 0,
          "totalenfermedad7dias": 0,
          "totalenfermedad14dias": 0,
          "pcrrealizados": 0,
          "pcrpositivossintomas": 0,
          "pcrpositivossintomas14dias": 0,
          "tasaenfermedadx100": 0,
          "tasaenfermedadx100_7dias": 0,
          "tasaenfermedadx100_14dias": 0,
          "tasax100_pcr_realizados": 0,
          "tasax10000_pcr_positivos": 0,
          "tasax10000_pcr_positivos_sintomas": 0,
          "tasapcr_positivos_sintomasx10000_7dias": 0,
          "tasapcr_positivos_sintomasx10000_14dias": 0

        }

        graphData[curatedData[i]["fecha"]] = date;
      }

      if (!isNaN(curatedData[i]["totalenfermedad"])){
        graphData[curatedData[i]["fecha"]].totalenfermedad += curatedData[i]["totalenfermedad"];
      }

      if (!isNaN(curatedData[i]["pcr_positivos"])){
        graphData[curatedData[i]["fecha"]].pcrpositivos += curatedData[i]["pcr_positivos"];
      }

      if (!isNaN(curatedData[i]["pcr_positivos_sintomas_7dias"])){
        graphData[curatedData[i]["fecha"]].pcrpositivos7dias += curatedData[i]["pcr_positivos_sintomas_7dias"];
      }

      if (!isNaN(curatedData[i]["totalenfermedad_7dias"])){
        graphData[curatedData[i]["fecha"]].totalenfermedad7dias += curatedData[i]["totalenfermedad_7dias"];
      }

      if (!isNaN(curatedData[i]["totalenfermedad_14dias"])){
        graphData[curatedData[i]["fecha"]].totalenfermedad14dias += curatedData[i]["totalenfermedad_14dias"];
      }

      if (!isNaN(curatedData[i]["pcr_realizados"])){
        graphData[curatedData[i]["fecha"]].pcrrealizados += curatedData[i]["pcr_realizados"];
      }
      
      if (!isNaN(curatedData[i]["pcr_positivos_sintomas"])){
        graphData[curatedData[i]["fecha"]].pcrpositivossintomas += curatedData[i]["pcr_positivos_sintomas"];
      }

      if (!isNaN(curatedData[i]["pcr_positivos_sintomas_14dias"])){
        graphData[curatedData[i]["fecha"]].pcrpositivossintomas14dias += curatedData[i]["pcr_positivos_sintomas_14dias"];
      }
      
      if (!isNaN(curatedData[i]["tasax100"])){
        graphData[curatedData[i]["fecha"]].tasaenfermedadx100 += curatedData[i]["tasax100"];
      }
      
      if (!isNaN(curatedData[i]["tasax100_7dias"])){
        graphData[curatedData[i]["fecha"]].tasaenfermedadx100_7dias += curatedData[i]["tasax100_7dias"];
      }

      if (!isNaN(curatedData[i]["tasax100_14dias"])){
        graphData[curatedData[i]["fecha"]].tasaenfermedadx100_14dias += curatedData[i]["tasax100_14dias"];
      }

      if (!isNaN(curatedData[i]["tasax100_pcr_realizados"])){
        graphData[curatedData[i]["fecha"]].tasax100_pcr_realizados += curatedData[i]["tasax100_pcr_realizados"];
      }
      
      if (!isNaN(curatedData[i]["tasax10000_pcr_positivos"])){
        graphData[curatedData[i]["fecha"]].tasax10000_pcr_positivos += curatedData[i]["tasax10000_pcr_positivos"];
      }

      if (!isNaN(curatedData[i]["tasax10000_pcr_positivos_sintomas"])){
        graphData[curatedData[i]["fecha"]].tasax10000_pcr_positivos_sintomas += curatedData[i]["tasax10000_pcr_positivos_sintomas"];
      }
      
      if (!isNaN(curatedData[i]["tasapcr_positivos_sintomasx10000_7dias"])){
        graphData[curatedData[i]["fecha"]].tasapcr_positivos_sintomasx10000_7dias += curatedData[i]["tasapcr_positivos_sintomasx10000_7dias"];
      }

      if (!isNaN(curatedData[i]["tasapcr_positivos_sintomasx10000_14dias"])){
        graphData[curatedData[i]["fecha"]].tasapcr_positivos_sintomasx10000_14dias += curatedData[i]["tasapcr_positivos_sintomasx10000_14dias"];
      }

    }

    graphData = sortObject(graphData);

  }

  $('#showGraph').click(function(){

    var officeTxt = $("#office").children("option:selected").val();
    $('#noGraph').show();
    $('#noGraph').html("<br/><i>Cargando datos... Por favor espere...</i>");


    if (curatedData.length == 0){
      $.ajax({
        type: 'GET',
        url: buildGraphDataQueryURL(officeTxt),
        dataType: 'json',
        async: true,
        success: function(data) {
            buildGraphData(data);
            buildGraphValues();
        }
      });
    } else {
      buildGraphValues();
    }

  });

});

// When the user scrolls the page, execute myFunction 
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("nav-sections");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}