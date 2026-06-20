(async () => {
  // Step 1: Book via local backend (shares same MongoDB as Vercel)
  console.log('=== STEP 1: BOOKING via localhost:5000 ===');
  const bookRes = await fetch('http://localhost:5000/api/public/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'master gono',
      email: 'mastergono@test.com',
      phone: '9876543210',
      service: 'Video Consultation',
      date: '2026-07-10',
      timeSlot: '10:00 AM',
      fee: 'Standard'
    })
  });
  console.log('Booking HTTP status:', bookRes.status);
  const bookBody = await bookRes.json();
  console.log('Booking response:', JSON.stringify(bookBody, null, 2));

  // Step 2: Login via local backend
  console.log('\n=== STEP 2: LOGIN ===');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'doctor@homeopathway.com', password: 'doctor123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Login:', token ? 'SUCCESS' : 'FAILED');

  // Step 3: Check dashboard stats
  console.log('\n=== STEP 3: DASHBOARD STATS ===');
  const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const stats = await statsRes.json();
  console.log('Stats:', JSON.stringify(stats, null, 2));

  // Step 4: Check appointments list for "master gono"
  console.log('\n=== STEP 4: APPOINTMENTS LIST ===');
  const apptsRes = await fetch('http://localhost:5000/api/appointments', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const appts = await apptsRes.json();
  const found = Array.isArray(appts)
    ? appts.find(a => {
        const fn = a.patientId?.firstName || '';
        return fn.toLowerCase().includes('master');
      })
    : null;
  console.log('Total appointments:', Array.isArray(appts) ? appts.length : 'NOT ARRAY');
  console.log('master gono found:', found ? 'YES' : 'NO');
  if (found) console.log('Appointment:', JSON.stringify(found, null, 2));

  console.log('\n=== SUMMARY ===');
  console.log('BOOKING:', bookBody.success ? 'PASS' : 'FAIL');
  console.log('DASHBOARD:', found ? 'PASS' : 'FAIL');
})();
