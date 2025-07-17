<?php
header('Content-Type: application/json');
try {
    require 'db.php';

    $stmt = $pdo->query("SELECT * FROM historical_figures ORDER BY RAND() LIMIT 1");
    $figure = $stmt->fetch();

    if ($figure) {
        echo json_encode($figure);
    } else {
        echo json_encode(['error' => 'No figure found']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>