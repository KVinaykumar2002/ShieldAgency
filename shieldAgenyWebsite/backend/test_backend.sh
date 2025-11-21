#!/bin/bash
echo "🔍 Testing Backend Endpoints..."
echo ""

# Health check
echo "1. Health Check:"
curl -s http://localhost:5001/health | python3 -m json.tool 2>/dev/null | grep -q "success" && echo "   ✅ PASS" || echo "   ❌ FAIL"
echo ""

# Public endpoints
echo "2. Public Endpoints:"
for endpoint in "services" "testimonials" "certifications" "gallery" "google-reviews"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/$endpoint)
    [ "$status" = "200" ] && echo "   ✅ GET /api/$endpoint" || echo "   ❌ GET /api/$endpoint (Status: $status)"
done
echo ""

# Admin endpoints (should work with current middleware)
echo "3. Admin Endpoints:"
for endpoint in "admin/google-reviews" "admin/dashboard/stats" "admin/guards"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/$endpoint)
    [ "$status" = "200" ] && echo "   ✅ GET /api/$endpoint" || echo "   ⚠️  GET /api/$endpoint (Status: $status)"
done
echo ""

# Auth endpoint
echo "4. Auth Endpoints:"
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5001/api/auth/login -H "Content-Type: application/json" -d '{"email":"test","password":"test"}')
[ "$status" = "200" ] || [ "$status" = "401" ] || [ "$status" = "400" ] && echo "   ✅ POST /api/auth/login" || echo "   ❌ POST /api/auth/login (Status: $status)"
echo ""

# 404 handler
echo "5. Error Handling:"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/nonexistent)
[ "$status" = "404" ] && echo "   ✅ 404 Handler working" || echo "   ❌ 404 Handler (Status: $status)"
echo ""

echo "✅ Backend test complete!"
