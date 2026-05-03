export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    const getRes = await fetch(`${url}/get/responses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    const responses = getData.result ? JSON.parse(getData.result) : [];

    res.status(200).json({ success: true, responses });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Fetch failed', responses: [] });
  }
}
