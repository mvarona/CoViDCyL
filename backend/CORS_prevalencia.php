<?php

	function getAllIncidenceForHealthZone($healthZone){
		header('Content-Type: application/json');
		header("Access-Control-Allow-Origin: *");

		$dateFragments = explode("/", $_GET['date']);
		$day = $dateFragments[0];
		$month = $dateFragments[1];
		$year = $dateFragments[2];
		$healthZone = $_GET['healthZone'];

		$url = "https://data.opendatasoft.com/explore/dataset/prevalencia-coronavirus@jcyl/download/?format=json&disjunctive.provincia=true&refine.zbs_geo=" . $healthZone . "&timezone=Europe/Madrid";

		$json = file_get_contents($url);

		return $json;
	}

	function getIncidenceForDateAndHealthZone($incidenceDate, $healthZone){
		header('Content-Type: application/json');
		header("Access-Control-Allow-Origin: *");

		$date = date('d-m-Y', strtotime($incidenceDate));
		$day = date('d', strtotime($date));
		$month = date('m', strtotime($date));
		$year = date('Y', strtotime($date));

		$urlIncidence = "https://data.opendatasoft.com/explore/dataset/prevalencia-coronavirus@jcyl/download/?format=json&disjunctive.provincia=true&refine.fecha=" . $year . "&refine.fecha=" . $year . "%2F" . $month . "&refine.fecha=" . $year . "%2F" . $month . "%2F" . $day . "&refine.zbs_geo=" . $healthZone . "&timezone=Europe/Madrid";

		$jsonIncidence = json_decode(file_get_contents($urlIncidence));
		$incidence = $jsonIncidence[0]->fields->prevalencia;

		return $incidence;
	}

	function getRedIncidenceForDateAndHealthZone($incidenceDate, $healthZone){

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

	// ENTRY POINT:

	if (isset($_GET['all']) && isset($_GET['healthZone'])){
		$all = $_GET['all'];
		if ($all == "true"){
			$healthZone = $_GET['healthZone'];
			echo(getAllIncidenceForHealthZone($healthZone));
		}
	}

	if (!isset($_GET['all']) && !isset($_GET['redZones']) && isset($_GET['date']) && isset($_GET['healthZone'])){
		$date = $_GET['date'];
		$healthZone = $_GET['healthZone'];

		echo(getIncidenceForDateAndHealthZone($date, $healthZone));
	}

	if (!isset($_GET['all']) && isset($_GET['redZones']) && isset($_GET['date']) && isset($_GET['healthZone'])){
		$redZones = $_GET['redZones'];
		$date = $_GET['date'];
		$healthZone = $_GET['healthZone'];

		if ($redZones == "true"){
			echo(getRedIncidenceForDateAndHealthZone($date, $healthZone));
		}
	}

?>