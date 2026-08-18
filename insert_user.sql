DELETE FROM users WHERE username IN ('rayen', 'admin');

INSERT INTO users (username, email, password, role_id, enabled, must_change_password) 
VALUES (
  'rayen', 
  'rayen@crm.com', 
  '$2b$10$TK7SKaxjH3m9/1xNQgAD/OkjNMftg2ZZ4kE4s9mfe.3sXpwlWIWxa',
  1, 
  true, 
  false
);

SELECT id, username, email, LENGTH(password) as hash_length FROM users;
