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

function buildGraphDataQueryURL(officeTxt){
  var possibleOffices = ["avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora"];
  var codesOffices = ["Gerencia+de+Ávila", "Gerencia+de+Burgos", "Gerencia+de+León", "Gerencia+de+Palencia", "Gerencia+de+Ponferrada", "Gerencia+de+Salamanca", "Gerencia+de+Segovia", "Gerencia+de+Soria", "Gerencia+de+Valladolid+Este", "Gerencia+de+Valladolid+Oeste", "Gerencia+de+Zamora"];

  var officeIndex = possibleOffices.indexOf(officeTxt);
  var codeOffice = codesOffices[officeIndex];

  return "https://www.bmsalamanca.com/others/CoViDCyL/CORS_tasa-enfermos-acumulados-por-areas-de-salud.php?graph=true&office=" + codeOffice;

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
      type: 'text'
    },
    {
      data: 'totalenfermedad',
      type: 'numeric'
    },
    {
      data: 'pcr_positivos',
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
      data: 'pcr_realizados',
      type: 'numeric'
    },
    {
      data: 'tasax100_pcr_realizados',
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
      data: 'nombregerencia',
      type: 'text'
    },
    {
      data: 'tsi',
      type: 'numeric'
    },
    {
      data: 'cs',
      type: 'text'
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
      data: 'gerencia',
      type: 'text'
    },
    {
      data: 'fecha',
      type: 'date'
    }
  ];

  fixedCols = 1;

	if (getUrlParameter("hideTitle") != undefined && getUrlParameter("hideTitle") == "true"){

		// SHORTCUT:

		$('#date_hideTitle').html("Fecha: " + dataObject[0]["fecha"].split("-")[2] + "/" + dataObject[0]["fecha"].split("-")[1] + "/" + dataObject[0]["fecha"].split("-")[0]);
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
	  height: 10 * dataObject.length,
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
				window.location.href = buildForwardingURL(dateTxt, officeTxt);
			} else {
				alert("El formato de la fecha es incorrecto. Debe ser día/mes/año.");
			}

		} else if (dateTxt.length == 0){
			window.location.href = buildForwardingURL(dateTxt, officeTxt);
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