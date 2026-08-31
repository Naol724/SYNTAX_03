/**
 * End-to-end API test — runs all core endpoints
 * node scripts/test-endpoints.js
 */

const BASE = 'http://localhost:5000/api/v1';
let pass = 0; let fail = 0;

async function req(method, path, body, token) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json();
  return { status: res.status, data: json };
}

function check(label, ok, detail = '') {
  if (ok) { console.log(`  ✅ ${label}`, detail); pass++; }
  else     { console.log(`  ❌ ${label}`, detail); fail++; }
}

async function run() {
  console.log('\n=== SYNTAX API — END-TO-END TESTS ===\n');

  // --- AUTH ---
  console.log('[ AUTH ]');
  const loginRes = await req('POST', '/admin/login', { email: 'admin@syntax.com', password: 'Admin@Syntax2026!' });
  check('Login valid credentials', loginRes.status === 200, loginRes.data.message);
  const token = loginRes.data.data?.accessToken;
  const refresh = loginRes.data.data?.refreshToken;

  const badLogin = await req('POST', '/admin/login', { email: 'admin@syntax.com', password: 'wrong' });
  check('Login wrong password → 401', badLogin.status === 401);

  const noFields = await req('POST', '/admin/login', { email: 'admin@syntax.com' });
  check('Login missing fields → 422', noFields.status === 422);

  const meRes = await req('GET', '/admin/me', null, token);
  check('/me authenticated', meRes.status === 200, meRes.data.data?.email);

  const meUnauth = await req('GET', '/admin/me');
  check('/me unauthenticated → 401', meUnauth.status === 401);

  const refreshRes = await req('POST', '/admin/refresh', { refreshToken: refresh });
  check('Refresh token', refreshRes.status === 200);
  const newToken = refreshRes.data.data?.accessToken;

  // --- DASHBOARD ---
  console.log('\n[ DASHBOARD ]');
  const dashRes = await req('GET', '/admin/dashboard', null, newToken);
  check('Dashboard stats', dashRes.status === 200, `services=${dashRes.data.data?.totalServices} msgs=${dashRes.data.data?.totalMessages}`);

  // --- USER REGISTRATION ---
  console.log('\n[ USER REGISTRATION ]');
  const regEmail = `user_${Date.now()}@test.com`;
  const regRes = await req('POST', '/users/register', { email: regEmail, full_name: 'Test User', company_name: 'ACME' });
  check('Register new user', regRes.status === 201, regEmail);

  const dupRes = await req('POST', '/users/register', { email: regEmail, full_name: 'Test User' });
  check('Duplicate registration → 409', dupRes.status === 409);

  // --- SERVICES ---
  console.log('\n[ SERVICES ]');
  const createSvc = await req('POST', '/admin/services', { name: 'Web Development', type: 'web', description: 'Full stack web dev services for modern businesses.', language: ['React','Node.js','TypeScript'], is_active: true, display_order: 1 }, newToken);
  check('Create service (admin)', createSvc.status === 201, createSvc.data.data?.name);
  const svcId = createSvc.data.data?.service_id;

  const getSvcs = await req('GET', '/services');
  check('Get public services', getSvcs.status === 200, `count=${getSvcs.data.data?.length}`);

  const updateSvc = await req('PUT', `/admin/services/${svcId}`, { short_description: 'Modern web apps' }, newToken);
  check('Update service', updateSvc.status === 200);

  // --- PORTFOLIO ---
  console.log('\n[ PORTFOLIO ]');
  const createPort = await req('POST', '/admin/portfolio', { project_name: 'E-Commerce Platform', portfolio_type: 'website', description: 'Full stack e-commerce solution with React and Node.js backend.', language_used: ['React','Node.js'], is_published: true }, newToken);
  check('Create portfolio', createPort.status === 201, createPort.data.data?.project_name);
  const portId = createPort.data.data?.portfolio_id;

  const getPorts = await req('GET', '/portfolio');
  check('Get public portfolio', getPorts.status === 200, `count=${getPorts.data.data?.length}`);

  // --- BLOG ---
  console.log('\n[ BLOG ]');
  const createBlog = await req('POST', '/admin/blog', { title: 'Getting Started with Next.js 15', content: 'Next.js 15 brings exciting new features including improved Server Components and better performance optimizations for modern web applications.', category: 'tutorial', tags: ['nextjs','react','typescript'], is_published: true, publish_date: new Date().toISOString() }, newToken);
  check('Create blog', createBlog.status === 201, createBlog.data.data?.title);
  const blogSlug = createBlog.data.data?.slug;

  const getBlogs = await req('GET', '/blog');
  check('Get public blogs', getBlogs.status === 200, `count=${getBlogs.data.data?.length}`);

  const getBlog = await req('GET', `/blog/${blogSlug}`);
  check('Get blog by slug', getBlog.status === 200, getBlog.data.data?.title);

  const getCats = await req('GET', '/blog/categories');
  check('Get blog categories', getCats.status === 200);

  // --- MESSAGES ---
  console.log('\n[ MESSAGES ]');
  const sendMsg = await req('POST', '/messages', { sender_name: 'Jane Smith', sender_email: 'jane@client.com', subject: 'Website Project', message: 'I would like to discuss building a new website for my company.' });
  check('Send message (public)', sendMsg.status === 201, `id=${sendMsg.data.data?.message_id}`);

  const getMsgs = await req('GET', '/admin/messages', null, newToken);
  check('Get messages (admin)', getMsgs.status === 200, `total=${getMsgs.meta?.pagination?.total}`);

  const getMsgStats = await req('GET', '/admin/messages/stats', null, newToken);
  check('Message stats', getMsgStats.status === 200, `unread=${getMsgStats.data.data?.unread_count}`);

  // --- DEVELOPERS ---
  console.log('\n[ DEVELOPERS ]');
  const createDev = await req('POST', '/admin/developers', { full_name: 'Alice Johnson', skill: ['React','TypeScript','Node.js'], position: 'Senior Full Stack Developer', bio: 'Experienced developer with 5 years building modern web apps.', years_of_experience: 5, is_active: true, display_order: 1 }, newToken);
  check('Create developer', createDev.status === 201, createDev.data.data?.full_name);

  const getDevs = await req('GET', '/developers');
  check('Get public developers', getDevs.status === 200, `count=${getDevs.data.data?.length}`);

  // --- TESTIMONIALS ---
  console.log('\n[ TESTIMONIALS ]');
  const createTest = await req('POST', '/admin/testimonials', { client_name: 'Bob Williams', feedback: 'Outstanding work! Delivered on time and exceeded all our expectations completely.', rating: 5, project_type: 'website', position_work: 'CEO', company_name: 'Williams Corp', is_approved: true }, newToken);
  check('Create testimonial', createTest.status === 201, createTest.data.data?.client_name);

  const getTests = await req('GET', '/testimonials');
  check('Get public testimonials', getTests.status === 200, `count=${getTests.data.data?.length}`);

  // --- LOGOUT ---
  console.log('\n[ LOGOUT ]');
  await req('POST', '/admin/logout', { refreshToken: refresh });
  const revokedRes = await req('POST', '/admin/refresh', { refreshToken: refresh });
  check('Revoked token rejected → 401', revokedRes.status === 401);

  // --- SUMMARY ---
  console.log(`\n${'='.repeat(40)}`);
  console.log(`TOTAL: ${pass + fail} tests | ✅ ${pass} passed | ❌ ${fail} failed`);
  if (fail === 0) console.log('\n🎉 ALL TESTS PASSED — Backend is production-ready!\n');
  else console.log('\n⚠️  Some tests failed — check errors above\n');
}

run().catch(console.error);
