export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { grade, fullCode, typeName, r1, r2, r3, isEmpty1, isEmpty2, isEmpty3 } = req.body;

  const entry = {
    id: Date.now().toString(),
    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    grade,
    fullCode,
    typeName,
    r1: r1 || '',
    r2: r2 || '',
    r3: r3 || '',
    // 무응답 플래그
    flag1: isEmpty1 ? 'EMPTY' : 'OK',
    flag2: isEmpty2 ? 'EMPTY' : 'OK',
    flag3: isEmpty3 ? 'EMPTY' : 'OK',
    hasEmpty: isEmpty1 || isEmpty2 || isEmpty3
  };

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    // 전체 목록 키에 추가
    const listKey = 'responses';
    const getRes = await fetch(`${url}/get/${listKey}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    const existing = getData.result ? JSON.parse(getData.result) : [];
    existing.push(entry);

    await fetch(`${url}/set/${listKey}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: JSON.stringify(existing) })
    });

    res.status(200).json({ success: true, id: entry.id });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Save failed' });
  }
}
