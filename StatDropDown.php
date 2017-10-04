<?php
	$db_params = parse_ini_file('/home/pi/Desktop/db_params.ini');
	
	try{
		$dsn = "mysql:host=".$db_params['host'].";dbname=PokeStats";
		$conn = new PDO($dsn, $db_params['user'], $db_params['password']);
		//set the PDO error mode to exception
    	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    	$query = $conn->prepare("SELECT id, identifier FROM stats WHERE is_battle_only = 0;");
    	$query->execute();

    	//echo json_encode($query->fetchAll());
    	echo json_encode($query->fetchAll(PDO::FETCH_ASSOC));

	}
	catch(PDOException $e){
		echo "Connection failed: " . $e->getMessage();
	}
?>