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

	if (isset($_GET['all']) && isset($_GET['healthZone'])){
		$all = $_GET['all'];
		if ($all == "true"){
			$healthZone = $_GET['healthZone'];
			echo(getAllIncidenceForHealthZone($healthZone));
		}
	}

?>