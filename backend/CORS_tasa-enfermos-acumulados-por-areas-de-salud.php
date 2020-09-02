<?php

	ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

	if (isset($_GET['date']) && isset($_GET['office'])){

		header('Content-Type: application/json');
		header("Access-Control-Allow-Origin: *");

		$dateFragments = explode("/", $_GET['date']);
		$day = $dateFragments[0];
		$month = $dateFragments[1];
		$year = $dateFragments[2];
		$office = $_GET['office'];

		$url = "https://data.opendatasoft.com/explore/dataset/tasa-enfermos-acumulados-por-areas-de-salud@jcyl/download/?format=json&disjunctive.zbs_geo=true&refine.fecha=" . $year . "&refine.fecha=" . $year . "%2F" . $month . "&refine.fecha=" . $year . "%2F" . $month . "%2F" . $day . "&refine.nombregerencia=" . $office . "&timezone=Europe/Berlin";

		$json = file_get_contents($url);

		if (isset($_GET['healthZone'])){

			$healthZone = $_GET['healthZone'];

			$json = json_decode($json, true);
			
			$date = "$day-$month-$year";

			$incidences = array();
			array_push($incidences, getIncidenceForDate($date, $healthZone));
			array_push($incidences, getIncidenceForDate("$date -7 days", $healthZone));
			array_push($incidences, getIncidenceForDate("$date -14 days", $healthZone));
			array_push($incidences, getRedIncidenceForDate($date, $healthZone));
			array_push($json, $incidences);
			$json = json_encode($json);
		}

		echo $json;

	} else if (!isset($_GET['date']) && isset($_GET['office']) && !isset($_GET['graph'])){

		header('Content-Type: application/json');
		header("Access-Control-Allow-Origin: *");

		$date = date('m/d/Y');

		do {

			$date = date('m/d/Y', strtotime("$date -1 days"));

			$day = date('d', strtotime($date));
			$month = date('m', strtotime($date));
			$year = date('Y', strtotime($date));
			$office = $_GET['office'];

			$url = "https://data.opendatasoft.com/explore/dataset/tasa-enfermos-acumulados-por-areas-de-salud@jcyl/download/?format=json&disjunctive.zbs_geo=true&refine.fecha=" . $year . "&refine.fecha=" . $year . "%2F" . $month . "&refine.fecha=" . $year . "%2F" . $month . "%2F" . $day . "&refine.nombregerencia=" . $office . "&timezone=Europe/Berlin";

			$json = file_get_contents($url);
			$jsonArray = json_decode($json);

		} while (count($jsonArray) == 0);

		if (isset($_GET['healthZone'])){

			$healthZone = $_GET['healthZone'];

			$json = json_decode($json, true);
			
			$date = "$day-$month-$year";

			$incidences = array();
			array_push($incidences, getIncidenceForDate($date, $healthZone));
			array_push($incidences, getIncidenceForDate("$date -7 days", $healthZone));
			array_push($incidences, getIncidenceForDate("$date -14 days", $healthZone));
			array_push($incidences, getRedIncidenceForDate($date, $healthZone));
			array_push($json, $incidences);
			$json = json_encode($json);

		}
		
		echo $json;

	} else if (!isset($_GET['date']) && isset($_GET['office']) && isset($_GET['graph'])){
		if ($_GET['graph'] == "true"){

			header('Content-Type: application/json');
			header("Access-Control-Allow-Origin: *");

			$office = $_GET['office'];

			$url = "https://data.opendatasoft.com/explore/dataset/tasa-enfermos-acumulados-por-areas-de-salud@jcyl/download/?format=json&disjunctive.zbs_geo=true&refine.nombregerencia=" . $office . "&timezone=Europe/Berlin";

			$json = file_get_contents($url);
			$jsonArray = json_decode($json);

			echo $json;
		}

	} else if (!isset($_GET['date']) && isset($_GET['gerencia']) && isset($_GET['shortcut'])){

		header('Content-Type: text/html; charset=utf-8');
		header("Access-Control-Allow-Origin: *");

		if ($_GET['shortcut'] == "true"){

			do {

				$date = date('m/d/Y', strtotime("$date -1 days"));

				$day = date('d', strtotime($date));
				$month = date('m', strtotime($date));
				$year = date('Y', strtotime($date));
				$officeTxt = $_GET['gerencia'];

				$possibleOffices = array("avila", "burgos", "leon", "palencia", "ponferrada", "salamanca", "segovia", "soria", "valladolidEste", "valladolidOeste", "zamora");
				$codesOffices = array("Gerencia+de+Ávila", "Gerencia+de+Burgos", "Gerencia+de+León", "Gerencia+de+Palencia", "Gerencia+de+Ponferrada", "Gerencia+de+Salamanca", "Gerencia+de+Segovia", "Gerencia+de+Soria", "Gerencia+de+Valladolid+Este", "Gerencia+de+Valladolid+Oeste", "Gerencia+de+Zamora");

				$officeIndex = 0;
				foreach ($possibleOffices as $possibleOffice) {
					if ($possibleOffice == $officeTxt){
						break;
					}
					$officeIndex++;
				}

				$codeOffice = $codesOffices[$officeIndex];

				$url = "https://data.opendatasoft.com/explore/dataset/tasa-enfermos-acumulados-por-areas-de-salud@jcyl/download/?format=json&disjunctive.zbs_geo=true&refine.fecha=" . $year . "&refine.fecha=" . $year . "%2F" . $month . "&refine.fecha=" . $year . "%2F" . $month . "%2F" . $day . "&refine.nombregerencia=" . $codeOffice . "&timezone=Europe/Berlin";

				$json = file_get_contents($url);
				$jsonArray = json_decode($json);

			} while (count($jsonArray) == 0);

			$valueHiddenSumTotalDisease = 0;
			$valueHiddenSumTotalDisease7Days = 0;

			$valueHiddenSumTotalPCR = 0;
			$valueHiddenSumTotalPCR7Days = 0;

			for ($i=0; $i < count($jsonArray); $i++) { 
				$valueHiddenSumTotalDisease += $jsonArray[$i]->fields->totalenfermedad;
				$valueHiddenSumTotalDisease7Days += $jsonArray[$i]->fields->totalenfermedad_7dias;

				$valueHiddenSumTotalPCR += $jsonArray[$i]->fields->pcr_positivos;
				$valueHiddenSumTotalPCR7Days += $jsonArray[$i]->fields->pcr_positivos_sintomas_7dias;
			}

			
			echo "El " . date("d/m", strtotime($date)) . " se han registrado " . $valueHiddenSumTotalDisease . " nuevos casos compatibles activos.<br/>";
			echo "En los últimos 7 días se han registrado " . $valueHiddenSumTotalDisease7Days . " nuevos casos compatibles activos.<br/><br/>";

			echo "El " . date("d/m", strtotime($date)) . " se han registrado  " . $valueHiddenSumTotalPCR . " nuevos casos confirmados con PCR.<br/>";
			echo "En los últimos 7 días se han registrado " . $valueHiddenSumTotalPCR7Days . " nuevos casos confirmados con PCR.";

		}
	}

	function getIncidenceForDate($incidenceDate, $healthZone){
		$date = date('d-m-Y', strtotime($incidenceDate));
		$day = date('d', strtotime($date));
		$month = date('m', strtotime($date));
		$year = date('Y', strtotime($date));

		$urlIncidence = "https://data.opendatasoft.com/explore/dataset/prevalencia-coronavirus@jcyl/download/?format=json&disjunctive.provincia=true&refine.fecha=" . $year . "&refine.fecha=" . $year . "%2F" . $month . "&refine.fecha=" . $year . "%2F" . $month . "%2F" . $day . "&refine.zbs_geo=" . $healthZone . "&timezone=Europe/Madrid";

		$jsonIncidence = json_decode(file_get_contents($urlIncidence));
		$incidence = $jsonIncidence[0]->fields->prevalencia;

		return $incidence;
	}

	function getRedIncidenceForDate($incidenceDate, $healthZone){

		$date = date('d-m-Y', strtotime($incidenceDate));
		$day = date('d', strtotime($date));
		$month = date('m', strtotime($date));
		$year = date('Y', strtotime($date));

		$urlIncidence = "https://analisis.datosabiertos.jcyl.es/api/records/1.0/analyze/?refine.fecha=" . $year . "-" . $month . "-" . $day . "&maxpoints=0&sort=incidencia&x=zbs_geo&y.incidencia.expr=tasapcr_positivos_sintomasx10000_7dias&y.incidencia.func=SUM&y.incidencia.cumulative=false&y.rojo.expr=sospecha_transmision_comunitaria&y.rojo.func=SUM&y.rojo.cumulative=false&dataset=tasa-enfermos-acumulados-por-areas-de-salud&timezone=Europe%2FBerlin&lang=es";

		$jsonRedIncidence = json_decode(file_get_contents($urlIncidence), true);
		
		foreach ($jsonRedIncidence as $item) {
			if ($item["x"] == $healthZone){
				if ($item["rojo"] == 0){
					return 0;
				} else {
					return 1;
				}
			}
		}

	}

?>