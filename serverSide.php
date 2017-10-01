<?php
	//connect to database
	$db_params = parse_ini_file('/home/pi/Desktop/db_params.ini');
	
	try{
		$dsn = "mysql:host=".$db_params['host'].";dbname=PokeStats";
		$conn = new PDO($dsn, $db_params['user'], $db_params['password']);
		//set the PDO error mode to exception
    	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    	$query = $conn->prepare("SELECT pokemon.identifier, pokemon_stats.base_stat FROM pokemon_stats INNER JOIN pokemon ON pokemon_stats.pokemon_id = pokemon.id WHERE pokemon.id = 1 AND pokemon_stats.stat_id = :selected_stat");
    	$query->execute(array(':selected_stat' => $_GET['stat']));

    	//echo json_encode($query->fetchAll());
    	echo json_encode($query->fetchAll(PDO::FETCH_ASSOC));

	}
	catch(PDOException $e){
		echo "Connection failed: " . $e->getMessage();
	}
?>