<?php
require 'db.php';

// Support both GET and POST
$search = $_GET['q'] ?? $_POST['q'] ?? '';
$search = trim($search);

// Sanitize input for LIKE query
$searchParam = "%$search%";
$nameParam = $search; // For exact or prefix match

// Prioritize name matches first, then others
$sql = "SELECT *,
    CASE
        WHEN name LIKE :name_prefix THEN 1
        WHEN name LIKE :search THEN 2
        ELSE 3
    END as priority
FROM historical_figures WHERE 
    name LIKE :search OR 
    field_of_influence LIKE :search OR 
    primary_occupation LIKE :search OR 
    country_of_origin LIKE :search OR 
    major_achievements LIKE :search OR 
    description LIKE :search
ORDER BY priority, name ASC
LIMIT 20";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    'search' => $searchParam,
    'name_prefix' => "$nameParam%"
]);
$results = $stmt->fetchAll();

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'count' => count($results),
    'results' => $results
]);
?>
