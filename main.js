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

function buildDataQueryURL(dateTxt, officeTxt){
	var possibleOffices = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
	var codesOffices = ["Gerencia+de+Ávila", "Gerencia+de+Burgos", "Gerencia+de+León", "Gerencia+de+Palencia", "Gerencia+de+Ponferrada", "Gerencia+de+Salamanca", "Gerencia+de+Segovia", "Gerencia+de+Soria", "Gerencia+de+Valladolid+Este", "Gerencia+de+Valladolid+Oeste", "Gerencia+de+Zamora"];

	var officeIndex = possibleOffices.indexOf(officeTxt);
	var codeOffice = codesOffices[officeIndex];

	if (dateTxt == undefined || dateTxt.length == 0){
		return "https://www.bmsalamanca.com/others/CoViDCyL/CORS_tasa-enfermos-acumulados-por-areas-de-salud.php?office=" + codeOffice;
	} else {
		return "https://www.bmsalamanca.com/others/CoViDCyL/CORS_tasa-enfermos-acumulados-por-areas-de-salud.php?date=" + dateTxt + "&office=" + codeOffice;
	}

}

function buildForwardingURL(dateTxt, officeTxt){
	if (dateTxt == undefined || dateTxt.length == 0){
		return "?gerencia=" + officeTxt;
	} else {
		return "?fecha=" + dateTxt + "&gerencia=" + officeTxt;
	}
	
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

function buildTable(){

	dataObject = [];
	
	for (var i = 0; i < pureObject.length; i++) {
		dataObject.push(pureObject[i]["fields"]);
	}

	for (var i = 0; i < dataObject.length; i++) {
		sumTotalDisease += dataObject[i]["totalenfermedad"];
		sumTotalDisease7Days += dataObject[i]["totalenfermedad_7dias"];
	}

	if (dataObject.length > 0){
		$('#hiddenSumTotalDisease').attr("valueHiddenSumTotalDisease", $('#hiddenSumTotalDisease').attr("valueHiddenSumTotalDisease").replace("X", sumTotalDisease));

		$('#hiddenSumTotalDisease7Days').attr("valueHiddenSumTotalDisease7Days", $('#hiddenSumTotalDisease7Days').attr("valueHiddenSumTotalDisease7Days").replace("X", sumTotalDisease7Days));

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


	var hotElement = document.querySelector('#hot');
	var hotElementContainer = hotElement.parentNode;
	var hotSettings = {
	  licenseKey: 'non-commercial-and-evaluation',
	  data: dataObject,
	  columns: [
	    {
	      data: 'fecha',
	      type: 'date',
	      dateFormat: 'DD/MM/YYYY'
	    },
	    {
	      data: 'nombregerencia',
	      type: 'text'
	    },
	    {
	      data: 'cs',
	      type: 'text'
	    },
	    {
	      data: 'centro',
	      type: 'text'
	    },
	    {
	      data: 'totalenfermedad',
	      type: 'numeric'
	    },
	    {
	      data: 'tasax100',
	      type: 'numeric'
	    },
	    {
	      data: 'totalenfermedad_7dias',
	      type: 'numeric'
	    },
	    {
	      data: 'tasax100_7dias',
	      type: 'numeric'
	    },
	    {
	      data: 'totalenfermedad_14dias',
	      type: 'numeric'
	    },
	    {
	      data: 'tasax100_14dias',
	      type: 'numeric'
	    },
	    {
	      data: 'provincia',
	      type: 'text'
	    },
	    {
	      data: 'tipo_centro',
	      type: 'text'
	    },
	    {
	      data: 'pcr_realizados',
	      type: 'numeric'
	    },
	    {
	      data: 'tasax100_pcr_realizados',
	      type: 'numeric'
	    },
	    {
	      data: 'pcr_positivos',
	      type: 'numeric'
	    },
	    {
	      data: 'tasax10000_pcr_positivos',
	      type: 'numeric'
	    },
	    {
	      data: 'pcr_positivos_sintomas',
	      type: 'numeric'
	    },
	    {
	      data: 'tasax10000_pcr_positivos_sintomas',
	      type: 'numeric'
	    },
	    {
	      data: 'pcr_positivos_sintomas_7dias',
	      type: 'numeric'
	    },
	    {
	      data: 'tasapcr_positivos_sintomasx10000_7dias',
	      type: 'numeric'
	    },
	    {
	      data: 'pcr_positivos_sintomas_14dias',
	      type: 'numeric'
	    },
	    {
	      data: 'tasapcr_positivos_sintomasx10000_14dias',
	      type: 'numeric'
	    },
	    {
	      data: 'x_geo',
	      type: 'text'
	    },
	    {
	      data: 'y_geo',
	      type: 'text'
	    },
	    {
	      data: 'zbs_geo',
	      type: 'text'
	    },
	    {
	      data: 'posicion',
	      type: 'text'
	    },
	    {
	      data: 'municipio',
	      type: 'text'
	    },
	    {
	      data: 'gerencia',
	      type: 'text'
	    },
	    {
	      data: 'tsi',
	      type: 'numeric'
	    },
	    
	    
	  ],
	  stretchH: 'all',
	  width: '90%',
	  height: 23 * dataObject.length + 100,
	  autoWrapRow: true,
	  filters: true,
	  dropdownMenu: true,
	  rowHeaders: true,
	  colHeaders: [
	    'FECHA',
		'NOMBREGERENCIA',
		'CS',
		'CENTRO',
		'TOTALENFERMEDAD',
		'TASAx100',
		'TOTALENFERMEDAD_7DIAS',
		'TASAx100_7DIAS',
		'TOTALENFERMEDAD_14DIAS',
		'TASAx100_14DIAS',
		'PROVINCIA',
		'TIPO_CENTRO',
		'PCR_REALIZADOS',
		'TASAx100_PCR_REALIZADOS',
		'PCR_POSITIVOS',
		'TASAx10000_PCR_POSITIVOS',
		'PCR_POSITIVOS_SINTOMAS',
		'TASAx10000_PCR_POSITIVOS_SINTOMAS',
		'PCR_POSITIVOS_SINTOMAS_7DIAS',
		'TASAPCR_POSITIVOS_SINTOMASx10000_7DIAS',
		'PCR_POSITIVOS_SINTOMAS_14DIAS',
		'TASAPCR_POSITIVOS_SINTOMASx10000_14DIAS',
		'x_geo',
		'y_geo',
		'zbs_geo',
		'Posicion',
		'MUNICIPIO',
		'GERENCIA',
		'TSI'
	  ],
	  columnSorting: {
	  	indicator: true,
	    sortEmptyCells: true,
	    initialConfig: {
	      column: 4,
	      sortOrder: 'desc'
	    }
	  },
	  autoColumnSize: {
	    samplingRatio: 23
	  },
	  columnSummary: [
	    {
	      destinationColumn: 4,
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
	      destinationColumn: 12,
	      destinationRow: 0,
	      type: 'sum',
	      forceNumeric: true,
	      suppressDataTypeErrors: true,
	      reversedRowCoords: true,
	      readOnly: true
	    },
	    {
	      destinationColumn: 14,
	      destinationRow: 0,
	      type: 'sum',
	      forceNumeric: true,
	      suppressDataTypeErrors: true,
	      reversedRowCoords: true,
	      readOnly: true
	    },
	    {
	      destinationColumn: 16,
	      destinationRow: 0,
	      type: 'sum',
	      forceNumeric: true,
	      suppressDataTypeErrors: true,
	      reversedRowCoords: true,
	      readOnly: true
	    },
	    {
	      destinationColumn: 18,
	      destinationRow: 0,
	      type: 'sum',
	      forceNumeric: true,
	      suppressDataTypeErrors: true,
	      reversedRowCoords: true,
	      readOnly: true
	    },
	    {
	      destinationColumn: 20,
	      destinationRow: 0,
	      type: 'sum',
	      forceNumeric: true,
	      suppressDataTypeErrors: true,
	      reversedRowCoords: true,
	      readOnly: true
	    }
	  ],
	  manualRowResize: true,
	  manualColumnResize: true
	};

	if (dataObject.length > 0){
		var hot = new Handsontable(hotElement, hotSettings);
	}
}

$(document).ready(function() {

	var date = getUrlParameter("fecha");
	var office = getUrlParameter("gerencia");
	var hideTittle = getUrlParameter("hideTittle");
	var possibleOffices = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
	
	if (date != undefined && isDate(date)){
		$('#date').val(date);
	}

	if (office != undefined && possibleOffices.includes(office)){
		$("#office").val(office);
		$("#office option[value=" + office + "]").attr('selected','selected');
		$.ajax({
	        type: 'GET',
	        url: buildDataQueryURL(date, office),
	        dataType: 'json',
	        async: true,
	        success: function(data) {
	            pureObject = data;
	            buildTable();
	        }
	    });
	}

	if (hideTittle == "true"){
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
				window.location.href = buildForwardingURL(dateTxt, officeTxt);
			} else {
				alert("El formato de la fecha es incorrecto. Debe ser día/mes/año.");
			}

		} else if (dateTxt.length == 0){
			window.location.href = buildForwardingURL(dateTxt, officeTxt);
		}

	});

});