<?php
	//connect to database
	$db_params = parse_ini_file('/home/pi/Desktop/db_params.ini');
	echo "Hello, world";
	
	try{
		$dsn = "mysql:host=".$db_params['host'].";dbname=PokeStats";
		$conn = new PDO($dsn, $db_params['user'], $db_params['password']);
		//set the PDO error mode to exception
    	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    	echo "Connected successfully"; 
	}
	catch(PDOException $e){
		echo "Connection failed: " . $e->getMessage();
	}
?>