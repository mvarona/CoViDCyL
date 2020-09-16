var pureObject; // Load JSON file from API URL
var dataObject; // Fetch only relevant fields

pureObject = [];
dataObject = [];
pureAllIncidences = [];

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

	return url;
}

function buildAllIncidenceURL(healthZone){
	var url = "https://www.bmsalamanca.com/others/CoViDCyL/CORS_prevalencia.php?all=true&healthZone=" + healthZone;

	return url;
}

function buildGraphDataQueryURL(officeTxt){
  var possibleOffices = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
  var codesOffices = ["Gerencia+de+Ávila", "Gerencia+de+Burgos", "Gerencia+de+León", "Gerencia+de+Palencia", "Gerencia+de+Ponferrada", "Gerencia+de+Salamanca", "Gerencia+de+Segovia", "Gerencia+de+Soria", "Gerencia+de+Valladolid+Este", "Gerencia+de+Valladolid+Oeste", "Gerencia+de+Zamora"];

  var officeIndex = possibleOffices.indexOf(officeTxt);
  var codeOffice = codesOffices[officeIndex];

  return "https://www.bmsalamanca.com/others/CoViDCyL/CORS_tasa-enfermos-acumulados-por-areas-de-salud.php?graph=true&office=" + codeOffice;

}

function buildForwardingURL(dateTxt, officeTxt, healthZone, town){
	var url = "";
	if (dateTxt == undefined || dateTxt.length == 0){
		url += "?gerencia=" + officeTxt;
	} else {
		url += "?fecha=" + dateTxt + "&gerencia=" + officeTxt;
	}

	if (healthZone != undefined){
		url += "&zbs=" + healthZone + "&municipio=" + town;
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

function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
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
	date = moment(date, "YYYY-MM-DD").format("DD/MM/yyyy");

	newSymptoms = dataObject[0]["totalenfermedad"];
	newSymptoms7d = dataObject[0]["totalenfermedad_7dias"];
	newSymptoms14d = dataObject[0]["totalenfermedad_14dias"];

	newPCR = dataObject[0]["pcr_positivos"];
	newPCR7d = dataObject[0]["pcr_positivos_sintomas_7dias"];
	newPCR14d = dataObject[0]["pcr_positivos_sintomas_14dias"];

	newIncidence = incidence[0];
	newIncidence7d = incidence[1];
	newIncidence14d = incidence[2];
	redIncidence = incidence[3];

	rate = dataObject[0]["tasapcr_positivos_sintomasx10000_7dias"].toFixed(2);

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

	$('#rate-num').html(rate);

	rateSentence = "";

	if (rate <= 2.5 && redIncidence == 0){
		rateSentence = "Mantén la distancia social, mascarilla e higiene respiratoria y de manos. Avisa a tu centro de salud si tienes síntomas.";
		$('#rate-color').addClass("green");
	} else if (rate > 2.5 && rate < 5 && redIncidence == 0){
		rateSentence = "Extrema las medidas de precaución y prevención. No realices desplazamientos innecesarios.";
		$('#rate-color').addClass("yellow");
	} else if (rate >= 5 && redIncidence == 0){
		rateSentence = "Restringe al máximo el contacto social. Evita reuniones de más de 10 personas y limita al máximo la exposición en lugares cerrados.";
		$('#rate-color').addClass("orange");
	} else if (redIncidence != 0){
		rateSentence = "Sospecha de transmisión comunitaria, criterio de la Dirección General de Salud Pública. Permanece en tu zona de salud.";
		$('#rate-color').addClass("red");
	}

	$('#rate-sentence').html(rateSentence);

	if (newIncidence > newIncidence7d){
		$('#incidence-trend').html("⬆️");
		$('#incidence-trend').attr("title", "Tendencia al alza en comparación con hace 7 días");

	} else if (newIncidence < newIncidence7d){
		$('#incidence-trend').html("⬇️");
		$('#incidence-trend').attr("title", "Tendencia a la baja en comparación con hace 7 días");

	} else {
		$('#incidence-trend').html("➡️");
		$('#incidence-trend').attr("title", "Tendencia mantenida en comparación con hace 7 días");
	}

	$('#warning-sentence-similar').css("display", "none");
	$('#warning-sentence-unique').css("display", "none");
	$('#loading-stats-minimum').show();

	$.ajax({
        type: 'GET',
        url: buildAllIncidenceURL(healthZone),
        dataType: 'json',
        async: true,
        success: function(data) {
            pureAllIncidences = data;
            allIncidencesPredictor(newIncidence, dataObject[0]["fecha"]);
        }
    });

}

function allIncidencesPredictor(currentIncidence, lastDate){

	allIncidences = {};

	for (var i = 0; i < pureAllIncidences.length; i++) {
		allIncidences[pureAllIncidences[i]["fields"]["fecha"]] = pureAllIncidences[i]["fields"]["prevalencia"];
	}

	allIncidences = sortObject(allIncidences);
	firstSimilarDay = "";
	posFirstSimilarDay = 0;

	for (var i = 0; i < Object.values(allIncidences).length-1; i++) {
		if (Object.values(allIncidences)[i] <= currentIncidence && Object.values(allIncidences)[i+1] >= currentIncidence){
			firstSimilarDay = Object.keys(allIncidences)[i+1];
			posFirstSimilarDay = i+1;
			break;
		}
	}

	if (firstSimilarDay == lastDate){
		// No similar day until today:

		$('#warning-sentence-similar').hide();
		$('#warning-sentence-unique').css("display", "inline-block");

	} else {
		nextIncidences = Object.values(allIncidences).slice(posFirstSimilarDay, Object.values(allIncidences).length);
		minNextIncidences = Math.min.apply(Math, nextIncidences);
		posMinNextIncidences = 0;

		for (var i = posFirstSimilarDay; i < Object.values(allIncidences).length; i++) {
			if (Object.values(allIncidences)[i] == minNextIncidences){
				posMinNextIncidences = i;
				break;
			}
		}

		dayWithMinimum = Object.keys(allIncidences)[posMinNextIncidences];
		daysBetweenSimilarAndMinimum = posMinNextIncidences - posFirstSimilarDay;

		$('#similar-num-cases').html(allIncidences[firstSimilarDay]);
		$('#similar-num-date').html(moment(firstSimilarDay, "YYYY-MM-DD").format("DD/MM/yyyy"));
		$('#difference-min-days').html(daysBetweenSimilarAndMinimum);
		$('#min-num-cases').html(minNextIncidences);
		$('#min-num-date').html(moment(dayWithMinimum, "YYYY-MM-DD").format("DD/MM/yyyy"));

		$('#loading-stats-minimum').hide();
		$('#warning-sentence-similar').css("display", "inline-block");
		$('#warning-sentence-unique').hide();

	}

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
	var town = getUrlParameter("municipio");
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
		$("#town").val(town);
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
			swal("El formato de la fecha es incorrecto", "Debe ser día/mes/año", "error");
		
		} else if (dateTxt.length >= 8) {
			if (isDate(dateTxt)){
				if (dateTxt.length < 10){
					dateTxt = addLeadingZeroesToDate(dateTxt);
				}
				window.location.href = buildForwardingURL(dateTxt, officeTxt, undefined, undefined);
			} else {
				swal("El formato de la fecha es incorrecto", "Debe ser día/mes/año", "error");
			}

		} else if (dateTxt.length == 0){
			window.location.href = buildForwardingURL(dateTxt, officeTxt, undefined, undefined);
		}

	});
    
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

    $('#show-town').click(function(){
		if (towns.indexOf($('#town').val()) > -1) {
			var town = $('#town').val();
		    var officeCode = townsInfo[town]["gerencia"];
		    var healthZone = townsInfo[town]["zbs_geo"];

		    var officeTxt = getOfficetxtForOfficeCode(officeCode);
		   	window.location.href = buildForwardingURL(undefined, officeTxt, healthZone, town);

		} else {
			swal("¡No hemos encontrado el municipio!", "Por favor, intenta elegir uno de los sugeridos o escribe uno cercano", "error");
		}
	});

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

      myChart.renderer.image('https://www.bmsalamanca.com/others/CoViDCyL/images/watermark.png',myChart.plotLeft + myChart.plotSizeX - 200, 10, 173, 40)
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