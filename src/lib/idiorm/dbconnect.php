<?php 

require_once('idiorm.php');

ORM::configure('mysql:host=localhost;dbname=happytuning');
ORM::configure('username', 'happytuning');
ORM::configure('password', 'welcome1');
ORM::configure('driver_options', [PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8']);


