#!/usr/bin/env bash
# 在已登入 peinanfoundation 帳號的終端機執行
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== 1. 確認 Vercel 帳號 ==="
npx vercel whoami
npx vercel teams ls

echo ""
echo "=== 2. 切換到 peinanfoundation 團隊（依實際 slug 調整）==="
# 若 teams ls 顯示不同 slug，請改為正確名稱
npx vercel teams switch peinanfoundation 2>/dev/null || \
npx vercel teams switch peinanfoundation-8926 2>/dev/null || \
echo "請手動執行: npx vercel teams switch <你的團隊slug>"

echo ""
echo "=== 3. 建立 Blob Store 並連接專案 ==="
env -u VERCEL_OIDC_TOKEN -u BLOB_STORE_ID npx vercel blob create-store peinanwebsite-blob --access public --yes || \
echo "若 Store 已存在，略過此步"

echo ""
echo "=== 4. 部署專案到 peinanfoundation ==="
npx vercel link --yes 2>/dev/null || true
npx vercel --prod --yes

echo ""
echo "=== 5. 設定環境變數（若尚未設定）==="
echo "請在 Vercel Dashboard 確認 Production 有："
echo "  - ADMIN_USERNAME"
echo "  - ADMIN_PASSWORD"
echo "  - ADMIN_SESSION_SECRET"
echo "  - BLOB_READ_WRITE_TOKEN（Connect Blob 後自動產生）"

echo ""
echo "=== 6. 回填 CMS 資料 ==="
npx vercel env pull .env.production.local --environment=production --yes
set -a && source .env.production.local && set +a
npm run restore:cms
rm -f .env.production.local

echo ""
echo "=== 7. 轉移網域 hkpeinan.com ==="
echo "在 gaphys-projects 的 peinanwebsite 移除 hkpeinan.com"
echo "在本專案 Settings → Domains 加入 hkpeinan.com"
echo ""
echo "完成！"
