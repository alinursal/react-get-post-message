<?php

include_once('config.php');

$status = json_decode(file_get_contents('php://input'), true);

$query = "INSERT INTO $table (`message`, `type`, `time`) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($gDB, $query);
mysqli_stmt_bind_param($stmt, 'sss', $status['message'], $status['type'], $status['time']);
mysqli_stmt_execute($stmt);

$newID = mysqli_stmt_insert_id($stmt);

mysqli_close($gDB);

header('Content-Type: application/json');
die(json_encode([
    'success' => TRUE,
    'id' => $newID
]));
