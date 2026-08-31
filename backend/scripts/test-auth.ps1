$BASE = "http://localhost:5000/api/v1"
$PASS = 0
$FAIL = 0

function Test($label, $script) {
  try {
    $result = & $script
    Write-Host "  PASS: $label" -ForegroundColor Green
    $script:PASS++
    return $result
  } catch {
    Write-Host "  FAIL: $label -" $_.Exception.Message.Substring(0, [Math]::Min(80, $_.Exception.Message.Length)) -ForegroundColor Red
    $script:FAIL++
    return $null
  }
}

Write-Host "`n=== AUTH TESTS ===" -ForegroundColor Cyan

# 1. Login with correct credentials
$loginData = Test "POST /admin/login (valid)" {
  $b = '{"email":"admin@syntax.com","password":"Admin@Syntax2026!"}'
  (Invoke-RestMethod -Uri "$BASE/admin/login" -Method POST -Body $b -ContentType "application/json").data
}
$TOKEN = $loginData.accessToken
$REFRESH = $loginData.refreshToken

# 2. Login with wrong password
Test "POST /admin/login (wrong password → 401)" {
  $b = '{"email":"admin@syntax.com","password":"wrongpassword"}'
  try { Invoke-RestMethod -Uri "$BASE/admin/login" -Method POST -Body $b -ContentType "application/json" }
  catch { if ($_.Exception.Message -match "401") { return "401 correct" } throw }
}

# 3. Login with missing fields
Test "POST /admin/login (missing fields → 422)" {
  $b = '{"email":"admin@syntax.com"}'
  try { Invoke-RestMethod -Uri "$BASE/admin/login" -Method POST -Body $b -ContentType "application/json" }
  catch { if ($_.Exception.Message -match "422|400") { return "422 correct" } throw }
}

# 4. GET /admin/me with token
$meData = Test "GET /admin/me (authenticated)" {
  (Invoke-RestMethod -Uri "$BASE/admin/me" -Method GET -Headers @{ Authorization = "Bearer $TOKEN" }).data
}
Write-Host "       Logged in as: $($meData.email) [$($meData.role)]" -ForegroundColor Gray

# 5. GET /admin/me without token
Test "GET /admin/me (no token → 401)" {
  try { Invoke-RestMethod -Uri "$BASE/admin/me" -Method GET }
  catch { if ($_.Exception.Message -match "401") { return "401 correct" } throw }
}

# 6. Refresh token
$refreshData = Test "POST /admin/refresh (valid)" {
  $b = "{`"refreshToken`":`"$REFRESH`"}"
  (Invoke-RestMethod -Uri "$BASE/admin/refresh" -Method POST -Body $b -ContentType "application/json").data
}
$NEW_TOKEN = $refreshData.accessToken
Write-Host "       New token issued: $($NEW_TOKEN.Substring(0,20))..." -ForegroundColor Gray

# 7. Test protected route with new token
Test "GET /admin/dashboard (with new token)" {
  (Invoke-RestMethod -Uri "$BASE/admin/dashboard" -Method GET -Headers @{ Authorization = "Bearer $NEW_TOKEN" }).data
}

# 8. User registration
Test "POST /users/register (new user)" {
  $b = '{"email":"testuser@syntax.com","full_name":"Test User","company_name":"Test Co"}'
  (Invoke-RestMethod -Uri "$BASE/users/register" -Method POST -Body $b -ContentType "application/json").data
}

# 9. Duplicate user registration
Test "POST /users/register (duplicate → 409)" {
  $b = '{"email":"testuser@syntax.com","full_name":"Test User"}'
  try { Invoke-RestMethod -Uri "$BASE/users/register" -Method POST -Body $b -ContentType "application/json" }
  catch { if ($_.Exception.Message -match "409") { return "409 correct" } throw }
}

# 10. Logout
Test "POST /admin/logout" {
  $b = "{`"refreshToken`":`"$REFRESH`"}"
  Invoke-RestMethod -Uri "$BASE/admin/logout" -Method POST -Body $b -ContentType "application/json"
}

# 11. Use revoked refresh token
Test "POST /admin/refresh (revoked token → 401)" {
  $b = "{`"refreshToken`":`"$REFRESH`"}"
  try { Invoke-RestMethod -Uri "$BASE/admin/refresh" -Method POST -Body $b -ContentType "application/json" }
  catch { if ($_.Exception.Message -match "401") { return "401 correct" } throw }
}

Write-Host "`n=== RESULTS ===" -ForegroundColor Cyan
Write-Host "  Passed: $PASS" -ForegroundColor Green
Write-Host "  Failed: $FAIL" -ForegroundColor $(if ($FAIL -eq 0) { "Green" } else { "Red" })
