BEGIN TRANSACTION;
--if something failed, dont bother to create the table at all
CREATE TABLE users
(
  id serial PRIMARY KEY,
  --id is serial and primary
  name VARCHAR(100),
  --name max 100 char
  email text UNIQUE NOT NULL,
  --email is text, unique and not bull
  entries BIGINT DEFAULT 0,
  -- entries big number and start as 0
  joined TIMESTAMP NOT NULL
  -- joined is timestamp and cannot be null
);
COMMIT;--create the table if nothing failed, this is paired with begin transaction