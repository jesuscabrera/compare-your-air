export default async function handler(req, res) {
  try {
    // Get the city id from the query string
    const { cityId } = req.query;
    if (!cityId) {
      return res.status(400).json({ error: "City ID is required." });
    }

    // Build the API URL using the city ID
    const apiUrl = `https://api.openaq.org/v3/locations/${cityId}/latest?limit=999&page=1`;

    // Fetch data from the external API using your secure API key
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "X-API-Key": process.env.VITE_OPENAQ_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).json({ error: errorText });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getLocationsData:", error);
    res.status(500).json({ error: "Server error" });
  }
}
