<?php
require 'db.php';

$stmt = $pdo->query("SELECT * FROM historical_figures ORDER BY id ASC");
$results = $stmt->fetchAll();

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'count' => count($results),
    'results' => $results
]); 