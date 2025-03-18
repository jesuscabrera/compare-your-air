// api/getLocations.js

export default async function handler(req, res) {
  try {
    const apiUrl =
      "https://api.openaq.org/v3/locations?limit=999&page=1&order_by=id&sort_order=asc&countries_id=79";
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "X-API-Key": process.env.VITE_OPENAQ_API_KEY, // Your API key, set in Vercel's environment variables
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch data" });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.status(500).json({ error: "Server error" });
  }
}
