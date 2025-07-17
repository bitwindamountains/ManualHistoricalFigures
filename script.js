document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const randomBtn = document.getElementById("randomBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");

  // Add Clear Search button
  let clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Search';
  clearBtn.style.marginLeft = '10px';
  clearBtn.onclick = () => {
    searchInput.value = '';
    loadHomeFigures();
  };
  document.querySelector('.search-controls').appendChild(clearBtn);

  function showLoading() {
    resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
  }

  // Pagination state
  let allFigures = [];
  let currentPage = 1;
  const pageSize = 9;

  // Fetch all figures for home page and paginate
  async function loadHomeFigures() {
    showLoading();
    try {
      const response = await fetch('all_figures.php');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      allFigures = data.results || [];
      currentPage = 1;
      renderPaginatedFigures();
    } catch (error) {
      resultsContainer.innerHTML = `<p class="error">Error loading figures: ${error.message}</p>`;
    }
  }

  function renderPaginatedFigures() {
    resultsContainer.innerHTML = '';
    if (!allFigures.length) {
      resultsContainer.innerHTML = '<p>No historical figures found.</p>';
      return;
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageFigures = allFigures.slice(start, end);
    pageFigures.forEach(figure => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = renderSummary(figure);
      card.querySelector('.show-more').onclick = () => {
        // Show full-details card for this figure
        resultsContainer.innerHTML = '';
        const detailCard = document.createElement('div');
        detailCard.className = 'card';
        detailCard.innerHTML = renderFullDetails(figure, true);
        resultsContainer.appendChild(detailCard);
      };
      resultsContainer.appendChild(card);
    });
    renderPaginationControls();
  }

  function renderPaginationControls() {
    const totalPages = Math.ceil(allFigures.length / pageSize);
    if (totalPages <= 1) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'pagination-controls-wrapper';
    const pagination = document.createElement('div');
    pagination.className = 'pagination-controls';
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; renderPaginatedFigures(); };
    pagination.appendChild(prevBtn);
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      if (i === currentPage) pageBtn.classList.add('active');
      pageBtn.onclick = () => { currentPage = i; renderPaginatedFigures(); };
      pagination.appendChild(pageBtn);
    }
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; renderPaginatedFigures(); };
    pagination.appendChild(nextBtn);
    wrapper.appendChild(pagination);
    resultsContainer.appendChild(wrapper);
  }

  // Search and random logic (unchanged)
  async function fetchFigures(query = "") {
    showLoading();
    try {
      const response = await fetch(`search.php?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      displayResults(data, !!query);
    } catch (error) {
      resultsContainer.innerHTML = `<p class="error">Error fetching results: ${error.message}</p>`;
      console.error("Fetch error:", error);
    }
  }

  async function fetchRandomFigure() {
    showLoading();
    try {
      const response = await fetch(`random.php`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      displayResults([data], false);
    } catch (error) {
      resultsContainer.innerHTML = `<p class="error">Error fetching random figure: ${error.message}</p>`;
      console.error("Random fetch error:", error);
    }
  }

  function displayResults(response, showAllDetails) {
    let figures = Array.isArray(response) ? response : response.results || [];
    resultsContainer.innerHTML = "";
    if (!figures || figures.length === 0) {
      resultsContainer.innerHTML = "<p>No historical figures found.</p>";
      return;
    }
    figures.forEach(figure => {
      const card = document.createElement("div");
      card.className = "card";
      // Always show full details if showAllDetails is true or if only one figure (random)
      if (showAllDetails || figures.length === 1) {
        card.innerHTML = renderFullDetails(figure, true);
      } else {
        card.innerHTML = renderSummary(figure);
        card.querySelector('.show-more').onclick = () => {
          // Replace results with a single full-details card
          resultsContainer.innerHTML = '';
          const detailCard = document.createElement('div');
          detailCard.className = 'card';
          detailCard.innerHTML = renderFullDetails(figure, true);
          resultsContainer.appendChild(detailCard);
        };
      }
      resultsContainer.appendChild(card);
    });
  }

  function renderSummary(figure) {
    return `
      <img src="${figure.image_url || 'https://via.placeholder.com/400x180?text=No+Image'}" alt="${figure.name}" class="card-image">
      <h2>${figure.name}</h2>
      <p><strong>Born:</strong> ${figure.birth_date || "Unknown"}</p>
      <p><strong>Died:</strong> ${figure.death_date || "Unknown"}</p>
      <p><strong>Country:</strong> ${figure.country_of_origin || "Unknown"}</p>
      <p><strong>Occupation:</strong> ${figure.primary_occupation || "Unknown"}</p>
      <button class="show-more">Show More</button>
    `;
  }

  function renderFullDetails(figure, isFullView = false) {
    // Unique, beautiful name style for full render
    const nameHtml = isFullView
      ? `<div class="full-details-name-unique">${figure.name}</div>`
      : `<h2>${figure.name}</h2>`;
    const imgClass = isFullView ? 'card-image full-details-img-padding' : 'card-image';
    return `
      <img src="${figure.image_url || 'https://via.placeholder.com/400x180?text=No+Image'}" alt="${figure.name}" class="${imgClass}">
      ${nameHtml}
      <div class="details-table-wrapper">
        <table class="details-table">
          <tr><th>Birth Date</th><td>${figure.birth_date || "Unknown"}</td></tr>
          <tr><th>Death Date</th><td>${figure.death_date || "Unknown"}</td></tr>
          <tr><th>Gender</th><td>${figure.gender || "Unknown"}</td></tr>
          <tr><th>Birth Place</th><td>${figure.birth_place || "Unknown"}</td></tr>
          <tr><th>Country of Origin</th><td>${figure.country_of_origin || "Unknown"}</td></tr>
          <tr><th>Nationality</th><td>${figure.nationality || "Unknown"}</td></tr>
          <tr><th>Primary Occupation</th><td>${figure.primary_occupation || "Unknown"}</td></tr>
          <tr><th>Era</th><td>${figure.era || "Unknown"}</td></tr>
          <tr><th>Time Period</th><td>${figure.time_period || "Unknown"}</td></tr>
          <tr><th>Field of Influence</th><td>${figure.field_of_influence || "Unknown"}</td></tr>
          <tr><th>Major Achievements</th><td>${figure.major_achievements || "None"}</td></tr>
          <tr><th>Cause of Death</th><td>${figure.cause_of_death || "Unknown"}</td></tr>
          <tr><th>Historical Significance</th><td>${figure.historical_significance || "None"}</td></tr>
          <tr><th>Famous Works</th><td>${figure.famous_works || "None"}</td></tr>
          <tr><th>Quotes</th><td>${figure.quotes || "None"}</td></tr>
          <tr><th>Description</th><td>${figure.description || "None"}</td></tr>
        </table>
      </div>
    `;
  }

  searchBtn.addEventListener("click", () => {
    if (!searchInput.value.trim()) {
      loadHomeFigures();
    } else {
      fetchFigures(searchInput.value);
    }
  });

  randomBtn.addEventListener("click", () => {
    fetchRandomFigure();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!searchInput.value.trim()) {
        loadHomeFigures();
      } else {
        fetchFigures(searchInput.value);
      }
    }
  });

  // On load, show paginated home
  loadHomeFigures();
});
