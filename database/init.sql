CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    user_id UUID NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    status cart_status NOT NULL
);

CREATE TABLE cart_items (
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    count INTEGER NOT NULL CHECK (count > 0),
    FOREIGN KEY (cart_id) REFERENCES carts(id)
);

INSERT INTO carts (id, user_id, created_at, updated_at, status) values
('5ea43e97-b4a5-4067-8669-41fdce041e3e', '7f24bf07-8b6e-4377-b00f-7f68867316e3', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
('e97ecf63-d9af-462e-b39a-0fbcc19cb89a', '631259cd-fcb0-447d-b741-84e7eb0ecfde', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
('b4211df3-3796-4051-9fb6-0cba7e2aa230', '1f1783d2-8217-4c17-a3bd-216fefbfbca6', CURRENT_DATE, CURRENT_DATE, 'ORDERED'),
('eed70e0d-7220-44a3-b4b9-47a987f987ab', 'ccd8b155-05a5-44ff-bb6b-a9261d8f47ff', CURRENT_DATE, CURRENT_DATE, 'ORDERED');

INSERT INTO cart_items (cart_id, product_id, count) values
('5ea43e97-b4a5-4067-8669-41fdce041e3e', '49b1351f-4ac0-4a18-85ab-66d9f415f6f5', 5),
('e97ecf63-d9af-462e-b39a-0fbcc19cb89a', 'ca515219-33b0-46ce-a6b3-4286ffb8884d', 1),
('b4211df3-3796-4051-9fb6-0cba7e2aa230', '27191623-1040-4aa7-9aff-9ee889ae9b22', 3),
('eed70e0d-7220-44a3-b4b9-47a987f987ab', '7d1285e5-d520-4826-9e3c-57769f2184d9', 2);
