async function searchCars(query) {
    try {
        const response = await fetch('http://localhost:5000/api/cars/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Search error:', error);
        displayError('Failed to search cars. Please try again.');
        return [];
    }
}

function displaySearchResults(cars) {
    const searchResults = document.querySelector('.search-results');
    
    if (!cars.length) {
        searchResults.innerHTML = `
            <div class="no-results">
                <p>No matching vehicles found</p>
            </div>`;
        searchResults.style.display = 'block';
        return;
    }

    searchResults.innerHTML = cars.map(car => `
        <div class="search-result-item" data-car-id="${car._id}">
            <div class="result-content">
                <h4>${car.name}</h4>
                <p>${car.brand} ${car.model} - $${car.price}/day</p>
            </div>
        </div>
    `).join('');
    
    searchResults.style.display = 'block';

    // Add click handlers to results
    const resultItems = document.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            const carId = item.dataset.carId;
            window.location.href = `/booking.html?car_id=${carId}`;
        });
    });
}

function displayError(message) {
    const searchResults = document.querySelector('.search-results');
    searchResults.innerHTML = `
        <div class="search-error">
            <p>${message}</p>
        </div>`;
    searchResults.style.display = 'block';
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    const searchResults = document.querySelector('.search-results');
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});