<?php
require 'db.php';

// Support both GET and POST
$search = $_GET['q'] ?? $_POST['q'] ?? '';
$search = trim($search);

// Sanitize input for LIKE query
$searchParam = "%$search%";
$nameParam = $search; // For exact or prefix match

// First, try to find matches in the name field only
$sql_name = "SELECT * FROM historical_figures WHERE name LIKE :search ORDER BY name ASC LIMIT 20";
$stmt_name = $pdo->prepare($sql_name);
$stmt_name->execute(['search' => $searchParam]);
$name_results = $stmt_name->fetchAll();

if (count($name_results) > 0) {
    $results = $name_results;
} else {
    // If no name matches, search other fields
    $sql_other = "SELECT * FROM historical_figures WHERE 
        field_of_influence LIKE :search OR 
        primary_occupation LIKE :search OR 
        country_of_origin LIKE :search OR 
        major_achievements LIKE :search OR 
        description LIKE :search
        ORDER BY name ASC
        LIMIT 20";
    $stmt_other = $pdo->prepare($sql_other);
    $stmt_other->execute(['search' => $searchParam]);
    $results = $stmt_other->fetchAll();
}

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'count' => count($results),
    'results' => $results
]);
?>
