<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Historical Figures Explorer</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Historical Figures Explorer</h1>
    <div class="search-controls">
      <form action="search.php" method="GET">
        <input type="text" name="query" placeholder="Search historical figures...">
        <button type="submit">Search</button>
        <button type="button" onclick="location.href='random.php'">Random</button>
      </form>
    </div>
    <div id="results" class="results-container">
      <?php if (isset($_GET['query']) && !empty($_GET['query'])): ?>
        <?php
          include 'db.php';
          $query = htmlspecialchars($_GET['query']);
          $stmt = $pdo->prepare("SELECT * FROM historical_figures WHERE name LIKE ? OR field_of_influence LIKE ? LIMIT 20");
          $stmt->execute(["%$query%", "%$query%"]);
          $results = $stmt->fetchAll();

          if ($results):
            foreach ($results as $figure): ?>
              <div class="figure-card">
                <img src="<?= htmlspecialchars($figure['image_url']) ?>" alt="<?= htmlspecialchars($figure['name']) ?>">
                <h3><?= htmlspecialchars($figure['name']) ?></h3>
                <p><strong>Born:</strong> <?= htmlspecialchars($figure['birth_date']) ?></p>
                <p><strong>Known for:</strong> <?= htmlspecialchars($figure['field_of_influence']) ?></p>
                <p><?= htmlspecialchars($figure['description']) ?></p>
              </div>
            <?php endforeach;
          else:
            echo "<p>No results found.</p>";
          endif;
        ?>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
