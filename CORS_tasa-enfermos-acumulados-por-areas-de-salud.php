<?php
	header('Content-Type: application/json');
	header("Access-Control-Allow-Origin: *");

	if (isset($_GET['date']) && isset($_GET['office'])){

		$dateFragments = explode("/", $_GET['date']);
		$day = $dateFragments[0];
		$month = $dateFragments[1];
		$year = $dateFragments[2];
		$office = $_GET['office'];

		$url = "https://data.opendatasoft.com/explore/dataset/tasa-enfermos-acumulados-por-areas-de-salud@jcyl/download/?format=json&disjunctive.zbs_geo=true&refine.fecha=" . $year . "&refine.fecha=" . $year . "%2F" . $month . "&refine.fecha=" . $year . "%2F" . $month . "%2F" . $day . "&refine.nombregerencia=" . $office . "&timezone=Europe/Berlin";

		$json = file_get_contents($url);
		echo $json;
	}

?>