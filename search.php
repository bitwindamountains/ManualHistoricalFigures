<?php
require 'db.php';

// Support both GET and POST
$search = $_GET['q'] ?? $_POST['q'] ?? '';
$search = trim($search);

// Sanitize input for LIKE query
$searchParam = "%$search%";

// Allow searching in more fields for flexibility
$sql = "SELECT * FROM historical_figures WHERE 
    name LIKE :search OR 
    field_of_influence LIKE :search OR 
    primary_occupation LIKE :search OR 
    country_of_origin LIKE :search OR 
    major_achievements LIKE :search OR 
    description LIKE :search
    LIMIT 20";

$stmt = $pdo->prepare($sql);
$stmt->execute(['search' => $searchParam]);
$results = $stmt->fetchAll();

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'count' => count($results),
    'results' => $results
]);
?>
