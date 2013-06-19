<?php

// Edit the $mysql_user, $mysql_pass, and $mysql_host with your mysql credential
$mysql_user   = "your_username";
$mysql_pass   = "your_password";
$mysql_host   = "localhost";
$mysql_dbname = "sticky_note";

$db = mysql_connect($mysql_host, $mysql_user, $mysql_pass) or die("Cannot connect to MySQL");
mysql_select_db($mysql_dbname, $db);
