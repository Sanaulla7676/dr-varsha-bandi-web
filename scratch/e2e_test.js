(async()=>{
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'doctor@homeopathway.com', password: 'doctor123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  const preStatsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const preStats = await preStatsRes.json();

  const preApptsRes = await fetch('http://localhost:5000/api/appointments', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const preAppts = await preApptsRes.json();

  const bookRes = await fetch('http://localhost:5000/api/public/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'gogomaster',
      email: 'gogo@example.com',
      phone: '9999999999',
      service: 'Video',
      date: '2026-07-01',
      timeSlot: '10:00 AM',
      fee: 'Standard'
    })
  });
  const bookResult = await bookRes.json();

  const postStatsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const postStats = await postStatsRes.json();

  const postApptsRes = await fetch('http://localhost:5000/api/appointments', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const postAppts = await postApptsRes.json();

  console.log(JSON.stringify({ preStats, preAppts, bookResult, postStats, postAppts }, null, 2));
})();
