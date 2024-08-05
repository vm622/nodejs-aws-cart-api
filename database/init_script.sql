INSERT INTO carts (user_id, created_at, updated_at, status) values
('7f24bf07-8b6e-4377-b00f-7f68867316e3', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
('631259cd-fcb0-447d-b741-84e7eb0ecfde', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
('1f1783d2-8217-4c17-a3bd-216fefbfbca6', CURRENT_DATE, CURRENT_DATE, 'ORDERED'),
('ccd8b155-05a5-44ff-bb6b-a9261d8f47ff', CURRENT_DATE, CURRENT_DATE, 'ORDERED');

INSERT INTO cart_items (cart_id, product_id, count) values
('46cb89a0-c773-45b9-8f41-944e5d44cb3a', '49b1351f-4ac0-4a18-85ab-66d9f415f6f5', 5),
('dd8ee985-d269-4fd5-b918-50bbb82ed42c', 'ca515219-33b0-46ce-a6b3-4286ffb8884d', 1),
('d0b8ce9e-017e-4c14-8418-71df51fc0d29', '27191623-1040-4aa7-9aff-9ee889ae9b22', 3),
('b6956350-5aa5-4260-a731-4f81c53ef8a8', '7d1285e5-d520-4826-9e3c-57769f2184d9', 2);
