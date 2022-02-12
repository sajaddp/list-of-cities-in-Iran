<?php 



/*
	Input
		cities		path of json file or array of cities (string or array)
		provinces		path of json file or array of provinces (string or array)
		input_format		input data format it must be "array" or "json" (string)
		output_format		output data format it must be "array" or "json" (string)
	Output
		result		json or array according to the output_format (string or array)
*/



function getCitiesAndProvinceFull_V1($cities,$provinces,$input_format='array',$output_format='array')
{
	// Load Data
	$provinces = ($input_format=='json'?json_decode(file_get_contents($provinces),true):$provinces);
	$cities = ($input_format=='json'? json_decode(file_get_contents($cities),true):$cities);

	// Define final array
	$result=[];


	for ($i=0; $i < count($provinces); $i++) {
		$province_cities = [];
		foreach ($cities as $city)
			// Search for cities which "province_id" are same with province "id"
			if($city['province_id'] == $provinces[$i]['id'])
				array_push($province_cities, array("id"=>$city['id'],"name"=>$city['name'],"slug"=>$city['slug']));
		$result[$i] = $provinces[$i];
		$result[$i]['cities'] = $province_cities;
	}
	// return the output according to the output_format
	return ($output_format=='json'? json_encode($result): $result);
}

function getCitiesAndProvinceFull_V2($cities,$provinces,$input_format='array',$output_format='array')
{
	// Load Data
	$provinces = ($input_format=='json'?json_decode(file_get_contents($provinces),true):$provinces);
	$cities = ($input_format=='json'? json_decode(file_get_contents($cities),true):$cities);
	
	// Define final array
	$result=[];
	for ($i=0; $i < count($provinces); $i++) {
		// Search for cities which "province_id" are same with province "id"
		$province_cities = getCitiesByProvinceID($provinces[$i]['id'],$cities,$provinces);

		$result[$i] = $provinces[$i];
		$result[$i]['cities'] = $province_cities;
	}
	// return the output according to the output_format
	return $result;
}

function getCitiesByProvinceID($province_id,$cities,$provinces,$input_format='array',$output_format='array')
{
	// Load Data
	$provinces = ($input_format=='json'?json_decode(file_get_contents($provinces),true):$provinces);
	$cities = ($input_format=='json'? json_decode(file_get_contents($cities),true):$cities);
	$result=[];
	foreach ($cities as $city) 
		if($city['province_id'] == $province_id)
			array_push($result, array("id"=>$city['id'],"name"=>$city['name'],"slug"=>$city['slug']));
	// return the output according to the output_format
	return ($output_format=='json'? json_encode($result): $result );
}

function getCitiesByProvinceName($province_name,$cities,$provinces,$input_format='array',$output_format='array')
{
	// Load Data
	$provinces = ($input_format=='json'?json_decode(file_get_contents($provinces),true):$provinces);
	$cities = ($input_format=='json'? json_decode(file_get_contents($cities),true):$cities);
	$result=[];
	foreach ($provinces as $province)
		if($province['name'] == $province_name)
			foreach ($cities as $city)
				if($city['province_id'] == $province['id'])
					array_push($result, array("id"=>$city['id'],"name"=>$city['name'],"slug"=>$city['slug']));
	// return the output according to the output_format
	return ($output_format=='json'? json_encode($result):$result);
}

function getProvinceByCityID($city_id,$cities,$provinces,$input_format='array',$output_format='array')
{
	// Load Data
	$provinces = ($input_format=='json'?json_decode(file_get_contents($provinces),true):$provinces);
	$cities = ($input_format=='json'? json_decode(file_get_contents($cities),true):$cities);
	foreach ($cities as $city)
		if($city['id'] == $city_id)
			foreach ($provinces as $province)
				if($province['id'] == $city['province_id'])
					// return the output according to the output_format
					return ($output_format=='json'? json_encode($province): $province );
}

function getProvinceByCityName($city_name,$cities,$provinces,$input_format='array',$output_format='array')
{
	// Load Data
	$provinces = ($input_format=='json'?json_decode(file_get_contents($provinces),true):$provinces);
	$cities = ($input_format=='json'? json_decode(file_get_contents($cities),true):$cities);
	foreach ($cities as $city)
		if($city['name'] == $city_name)
			foreach ($provinces as $province)
				if($province['id'] == $city['province_id'])
					// return the output according to the output_format
					return ($output_format=='json'? json_encode($province): $province );
}

?>
