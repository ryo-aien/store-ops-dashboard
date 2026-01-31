-- Historical store metrics data (5 years: 2021-2025)
-- Monthly aggregated data for heatmap visualization
-- Patterns designed to show clear regional trends over time

-- Create function to generate historical data with meaningful patterns
-- Regional patterns:
-- - 関東: Steady growth, high base
-- - 近畿: Moderate growth, seasonal peaks in autumn
-- - 中部: Stable with slight decline in 2023, recovery in 2024-2025
-- - 九州・沖縄: Strong growth especially summer (tourism)
-- - 北海道: Winter peaks, summer dips
-- - 東北: Gradual recovery after 2021, steady growth
-- - 中国・四国: Moderate, stable performance

-- =====================================================
-- 2021年 月次データ (COVID影響からの回復期)
-- =====================================================

-- 2021年1月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-01-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.7
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.65
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.7
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.6
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.8
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.5
        ELSE (150000 + random() * 100000) * 0.65
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(150 + random() * 100)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(120 + random() * 80)
        ELSE floor(80 + random() * 60)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年2月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-02-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.68
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.63
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.68
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.58
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.85
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.48
        ELSE (150000 + random() * 100000) * 0.63
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(145 + random() * 95)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(115 + random() * 75)
        ELSE floor(75 + random() * 55)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年3月 (年度末、やや回復)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-03-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.75
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.70
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.73
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.65
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.75
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.55
        ELSE (150000 + random() * 100000) * 0.68
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(160 + random() * 110)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(125 + random() * 85)
        ELSE floor(85 + random() * 65)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年4月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-04-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.72
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.68
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.71
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.63
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.70
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.60
        ELSE (150000 + random() * 100000) * 0.66
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(155 + random() * 105)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(122 + random() * 82)
        ELSE floor(82 + random() * 62)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年5月 (GW、緊急事態宣言)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-05-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.65
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.60
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.65
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.58
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.63
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.50
        ELSE (150000 + random() * 100000) * 0.60
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(140 + random() * 90)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(110 + random() * 70)
        ELSE floor(70 + random() * 50)
    END,
    floor(random() * 4)
FROM stores s WHERE s.status = 'active';

-- 2021年6月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-06-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.70
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.65
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.68
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.62
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.60
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.55
        ELSE (150000 + random() * 100000) * 0.63
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(150 + random() * 100)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(118 + random() * 78)
        ELSE floor(78 + random() * 58)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年7月 (夏開始)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-07-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.73
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.68
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.70
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.70
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.65
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.70
        ELSE (150000 + random() * 100000) * 0.66
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(158 + random() * 108)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(123 + random() * 83)
        ELSE floor(83 + random() * 63)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年8月 (夏休み・お盆)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-08-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.68
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.65
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.65
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.72
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.75
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.75
        ELSE (150000 + random() * 100000) * 0.65
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(145 + random() * 95)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(118 + random() * 78)
        ELSE floor(85 + random() * 65)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年9月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-09-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.75
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.72
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.73
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.68
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.72
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.65
        ELSE (150000 + random() * 100000) * 0.70
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(162 + random() * 112)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(128 + random() * 88)
        ELSE floor(88 + random() * 68)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2021年10月 (緊急事態解除、回復開始)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-10-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.80
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.78
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.78
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.72
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.78
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.68
        ELSE (150000 + random() * 100000) * 0.75
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(175 + random() * 125)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(138 + random() * 98)
        ELSE floor(95 + random() * 75)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2021年11月 (紅葉シーズン)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-11-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.83
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.85
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.80
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.75
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.82
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.70
        ELSE (150000 + random() * 100000) * 0.78
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(182 + random() * 132)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(148 + random() * 108)
        ELSE floor(100 + random() * 80)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2021年12月 (年末商戦)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2021-12-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.90
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.88
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.85
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.80
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.92
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.72
        ELSE (150000 + random() * 100000) * 0.83
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(200 + random() * 150)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(160 + random() * 120)
        ELSE floor(110 + random() * 90)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- =====================================================
-- 2022年 月次データ (回復期)
-- =====================================================

-- 2022年1月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-01-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.78
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.75
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.76
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.68
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.88
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.58
        ELSE (150000 + random() * 100000) * 0.72
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(170 + random() * 120)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(135 + random() * 95)
        ELSE floor(90 + random() * 70)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年2月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-02-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.76
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.73
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.74
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.66
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.90
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.56
        ELSE (150000 + random() * 100000) * 0.70
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(165 + random() * 115)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(130 + random() * 90)
        ELSE floor(85 + random() * 65)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年3月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-03-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.82
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.80
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.80
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.72
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.82
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.65
        ELSE (150000 + random() * 100000) * 0.76
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(180 + random() * 130)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(142 + random() * 102)
        ELSE floor(95 + random() * 75)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年4月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-04-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.84
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.82
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.82
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.74
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.78
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.72
        ELSE (150000 + random() * 100000) * 0.78
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(185 + random() * 135)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(145 + random() * 105)
        ELSE floor(98 + random() * 78)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年5月 (GW回復)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-05-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.88
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.86
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.85
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.80
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.80
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.82
        ELSE (150000 + random() * 100000) * 0.82
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(195 + random() * 145)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(152 + random() * 112)
        ELSE floor(105 + random() * 85)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年6月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-06-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.85
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.83
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.82
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.78
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.75
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.80
        ELSE (150000 + random() * 100000) * 0.80
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(188 + random() * 138)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(148 + random() * 108)
        ELSE floor(102 + random() * 82)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年7月 (夏本番)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-07-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.90
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.88
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.86
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.88
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.82
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.92
        ELSE (150000 + random() * 100000) * 0.84
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(200 + random() * 150)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(158 + random() * 118)
        ELSE floor(110 + random() * 90)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年8月 (お盆)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-08-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.85
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.83
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.82
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.90
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.92
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.95
        ELSE (150000 + random() * 100000) * 0.82
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(188 + random() * 138)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(148 + random() * 108)
        ELSE floor(115 + random() * 95)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年9月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-09-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.88
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.86
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.85
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.82
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.85
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.80
        ELSE (150000 + random() * 100000) * 0.83
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(195 + random() * 145)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(152 + random() * 112)
        ELSE floor(108 + random() * 88)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年10月 (インバウンド再開)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-10-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.92
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.92
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.88
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.85
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.90
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.85
        ELSE (150000 + random() * 100000) * 0.86
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(205 + random() * 155)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(165 + random() * 125)
        ELSE floor(112 + random() * 92)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年11月 (紅葉・インバウンド増加)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-11-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.95
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.98
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.90
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.88
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.92
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.82
        ELSE (150000 + random() * 100000) * 0.88
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(212 + random() * 162)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(175 + random() * 135)
        ELSE floor(115 + random() * 95)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2022年12月 (年末商戦好調)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2022-12-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.02
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.00
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.95
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.92
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.05
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.85
        ELSE (150000 + random() * 100000) * 0.92
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(228 + random() * 178)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(180 + random() * 140)
        ELSE floor(120 + random() * 100)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- =====================================================
-- 2023年 月次データ (成長鈍化期)
-- =====================================================

-- 2023年1月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-01-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.88
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.85
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.82
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.78
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.95
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.72
        ELSE (150000 + random() * 100000) * 0.80
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(195 + random() * 145)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(152 + random() * 112)
        ELSE floor(102 + random() * 82)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年2月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-02-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.85
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.82
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.80
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.75
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.98
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.70
        ELSE (150000 + random() * 100000) * 0.78
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(188 + random() * 138)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(145 + random() * 105)
        ELSE floor(98 + random() * 78)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年3月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-03-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.90
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.88
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.84
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.82
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.88
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.80
        ELSE (150000 + random() * 100000) * 0.83
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(200 + random() * 150)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(158 + random() * 118)
        ELSE floor(105 + random() * 85)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年4月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-04-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.88
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.86
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.82
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.80
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.82
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.85
        ELSE (150000 + random() * 100000) * 0.80
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(195 + random() * 145)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(152 + random() * 112)
        ELSE floor(102 + random() * 82)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年5月 (GW好調)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-05-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.92
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.90
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.86
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.88
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.85
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.95
        ELSE (150000 + random() * 100000) * 0.85
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(205 + random() * 155)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(162 + random() * 122)
        ELSE floor(110 + random() * 90)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年6月 (梅雨・中部苦戦開始)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-06-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.85
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.83
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.75
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.82
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.78
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.88
        ELSE (150000 + random() * 100000) * 0.78
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(188 + random() * 138)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(148 + random() * 108)
        ELSE floor(98 + random() * 78)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2023年7月 (猛暑・中部低迷)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-07-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.88
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.86
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.72
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.90
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.88
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.00
        ELSE (150000 + random() * 100000) * 0.80
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(195 + random() * 145)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(152 + random() * 112)
        ELSE floor(105 + random() * 85)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2023年8月 (お盆・九州沖縄好調)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-08-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.82
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.80
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.70
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.95
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.00
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.08
        ELSE (150000 + random() * 100000) * 0.78
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(182 + random() * 132)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(142 + random() * 102)
        ELSE floor(115 + random() * 95)
    END,
    floor(random() * 3)
FROM stores s WHERE s.status = 'active';

-- 2023年9月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-09-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.86
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.84
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.74
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.85
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.88
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.92
        ELSE (150000 + random() * 100000) * 0.80
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(190 + random() * 140)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(150 + random() * 110)
        ELSE floor(105 + random() * 85)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年10月 (インバウンド絶好調)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-10-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.95
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.98
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.78
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.88
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.95
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.90
        ELSE (150000 + random() * 100000) * 0.85
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(212 + random() * 162)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(175 + random() * 135)
        ELSE floor(110 + random() * 90)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年11月 (紅葉・京都最高潮)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-11-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.98
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.08
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.80
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.90
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.92
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.85
        ELSE (150000 + random() * 100000) * 0.88
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(218 + random() * 168)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(192 + random() * 152)
        ELSE floor(112 + random() * 92)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2023年12月 (年末・中部回復兆し)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2023-12-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.05
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.02
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.85
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.95
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.08
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.88
        ELSE (150000 + random() * 100000) * 0.92
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(235 + random() * 185)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(182 + random() * 142)
        ELSE floor(120 + random() * 100)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- =====================================================
-- 2024年 月次データ (V字回復期)
-- =====================================================

-- 2024年1月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-01-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.92
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.88
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.85
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.82
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.02
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.78
        ELSE (150000 + random() * 100000) * 0.85
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(205 + random() * 155)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(158 + random() * 118)
        ELSE floor(108 + random() * 88)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年2月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-02-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.90
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.86
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.88
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.80
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.05
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.76
        ELSE (150000 + random() * 100000) * 0.83
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(200 + random() * 150)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(152 + random() * 112)
        ELSE floor(105 + random() * 85)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年3月 (春の桜インバウンド)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-03-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.02
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.00
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.92
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.88
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.92
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.90
        ELSE (150000 + random() * 100000) * 0.90
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(228 + random() * 178)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(178 + random() * 138)
        ELSE floor(115 + random() * 95)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年4月 (桜満開・インバウンド最高)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-04-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.08
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.10
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.95
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.92
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.95
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.95
        ELSE (150000 + random() * 100000) * 0.95
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(242 + random() * 192)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(195 + random() * 155)
        ELSE floor(120 + random() * 100)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年5月 (GW絶好調)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-05-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.10
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.08
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.98
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.00
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.00
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.05
        ELSE (150000 + random() * 100000) * 0.98
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(248 + random() * 198)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(192 + random() * 152)
        ELSE floor(125 + random() * 105)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2024年6月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-06-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.02
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.00
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.95
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.95
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 0.92
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.02
        ELSE (150000 + random() * 100000) * 0.95
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(228 + random() * 178)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(178 + random() * 138)
        ELSE floor(118 + random() * 98)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年7月 (夏休み開始)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-07-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.05
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.02
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.00
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.05
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.05
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.15
        ELSE (150000 + random() * 100000) * 0.98
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(235 + random() * 185)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(182 + random() * 142)
        ELSE floor(125 + random() * 105)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年8月 (お盆ピーク)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-08-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 0.98
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.95
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 0.98
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.10
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.12
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.20
        ELSE (150000 + random() * 100000) * 0.95
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(218 + random() * 168)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(168 + random() * 128)
        ELSE floor(132 + random() * 112)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年9月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-09-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.02
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.00
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.02
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.00
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.02
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.05
        ELSE (150000 + random() * 100000) * 0.98
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(228 + random() * 178)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(178 + random() * 138)
        ELSE floor(125 + random() * 105)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2024年10月 (紅葉前・安定期)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-10-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.08
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.10
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.05
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.02
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.08
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.00
        ELSE (150000 + random() * 100000) * 1.02
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(242 + random() * 192)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(195 + random() * 155)
        ELSE floor(128 + random() * 108)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2024年11月 (紅葉ピーク・近畿最高)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-11-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.12
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.20
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.08
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.05
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.05
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.98
        ELSE (150000 + random() * 100000) * 1.05
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(252 + random() * 202)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(215 + random() * 175)
        ELSE floor(130 + random() * 110)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2024年12月 (年末商戦最高)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2024-12-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.18
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.15
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.12
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.10
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.18
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.02
        ELSE (150000 + random() * 100000) * 1.10
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(265 + random() * 215)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(205 + random() * 165)
        ELSE floor(138 + random() * 118)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- =====================================================
-- 2025年 月次データ (成長継続期)
-- =====================================================

-- 2025年1月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-01-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.05
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.00
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.02
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.95
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.15
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.92
        ELSE (150000 + random() * 100000) * 0.98
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(235 + random() * 185)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(178 + random() * 138)
        ELSE floor(122 + random() * 102)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2025年2月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-02-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.02
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 0.98
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.05
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 0.92
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.18
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 0.90
        ELSE (150000 + random() * 100000) * 0.96
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(228 + random() * 178)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(172 + random() * 132)
        ELSE floor(118 + random() * 98)
    END,
    floor(random() * 2)
FROM stores s WHERE s.status = 'active';

-- 2025年3月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-03-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.12
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.10
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.08
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.02
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.05
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.05
        ELSE (150000 + random() * 100000) * 1.05
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(252 + random() * 202)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(195 + random() * 155)
        ELSE floor(130 + random() * 110)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年4月 (桜シーズン)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-04-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.18
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.20
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.10
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.08
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.02
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.10
        ELSE (150000 + random() * 100000) * 1.10
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(265 + random() * 215)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(215 + random() * 175)
        ELSE floor(138 + random() * 118)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年5月 (GW最高記録)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-05-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.22
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.18
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.15
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.15
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.10
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.18
        ELSE (150000 + random() * 100000) * 1.12
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(275 + random() * 225)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(210 + random() * 170)
        ELSE floor(145 + random() * 125)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年6月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-06-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.12
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.10
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.10
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.08
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.02
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.15
        ELSE (150000 + random() * 100000) * 1.08
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(252 + random() * 202)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(195 + random() * 155)
        ELSE floor(135 + random() * 115)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年7月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-07-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.15
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.12
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.12
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.18
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.15
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.28
        ELSE (150000 + random() * 100000) * 1.10
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(258 + random() * 208)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(200 + random() * 160)
        ELSE floor(145 + random() * 125)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年8月 (お盆)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-08-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.08
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.05
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.10
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.22
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.25
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.35
        ELSE (150000 + random() * 100000) * 1.08
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(242 + random() * 192)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(188 + random() * 148)
        ELSE floor(152 + random() * 132)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年9月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-09-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.12
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.10
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.12
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.12
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.12
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.15
        ELSE (150000 + random() * 100000) * 1.08
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(252 + random() * 202)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(195 + random() * 155)
        ELSE floor(140 + random() * 120)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年10月
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-10-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.18
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.20
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.15
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.15
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.18
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.10
        ELSE (150000 + random() * 100000) * 1.12
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(265 + random() * 215)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(215 + random() * 175)
        ELSE floor(145 + random() * 125)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年11月 (紅葉絶頂)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-11-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.22
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.30
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.18
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.15
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.15
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.08
        ELSE (150000 + random() * 100000) * 1.15
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(275 + random() * 225)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(235 + random() * 195)
        ELSE floor(148 + random() * 128)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- 2025年12月 (年末商戦過去最高)
INSERT INTO store_metrics (store_id, ts, sales, customers, incidents_open)
SELECT
    s.id,
    '2025-12-15'::timestamp,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN (300000 + random() * 200000) * 1.28
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN (250000 + random() * 150000) * 1.25
        WHEN s.prefecture IN ('愛知県', '静岡県') THEN (220000 + random() * 130000) * 1.22
        WHEN s.prefecture IN ('福岡県', '熊本県', '鹿児島県') THEN (180000 + random() * 100000) * 1.20
        WHEN s.prefecture = '北海道' THEN (200000 + random() * 120000) * 1.28
        WHEN s.prefecture = '沖縄県' THEN (150000 + random() * 80000) * 1.12
        ELSE (150000 + random() * 100000) * 1.20
    END,
    CASE
        WHEN s.prefecture IN ('東京都', '神奈川県', '千葉県', '埼玉県') THEN floor(288 + random() * 238)
        WHEN s.prefecture IN ('大阪府', '京都府', '兵庫県') THEN floor(225 + random() * 185)
        ELSE floor(155 + random() * 135)
    END,
    floor(random() * 1)
FROM stores s WHERE s.status = 'active';

-- Verify data count
-- Expected: 94 active stores × 60 months = 5,640 records
SELECT 'Historical data inserted. Total records: ' || COUNT(*) FROM store_metrics WHERE ts < '2026-01-01';
