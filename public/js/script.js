const tickerData = document.getElementById('tickerData');

// Function to fetch data from the backend
const fetchData = async () => {
  try {
    const response = await fetch('/api/tickers');
    const data = await response.json();

    // Populate the table with data
    data.forEach((ticker) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ticker.name}</td>
        <td>${ticker.last}</td>
        <td>${ticker.buy}</td>
        <td>${ticker.sell}</td>
        <td>${ticker.volume}</td>
        <td>${ticker.base_unit}</td>
      `;
      tickerData.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();
