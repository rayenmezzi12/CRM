-- 1. Supprimer l'utilisateur superadmin 'rayen' et anciens tests
DELETE FROM employees WHERE email IN ('employee@crm.com', 'rayen@crm.com');
DELETE FROM users WHERE username IN ('rayen', 'admin', 'employee', 'client', 'superadmin');

-- 2. Insérer les 4 comptes pour chaque acteur du Cahier des Charges

-- Acteur 1: Super Administrateur (ROLE_SUPER_ADMIN, id = 1)
INSERT INTO users (username, email, password, role_id, enabled, must_change_password)
VALUES ('superadmin', 'superadmin@domain.com', '$2b$10$k3fczyWR1eO5jj1573qvJu/zJr85dlFaqxF3I.xTu327bOTrf4tJi', 1, true, false);

-- Acteur 2: Administrateur (ROLE_ADMIN, id = 2)
INSERT INTO users (username, email, password, role_id, enabled, must_change_password)
VALUES ('admin', 'admin@crm.com', '$2b$10$pkV3mLDyh7GYm0TS.rX1iuGx6znA/wFUKLOD3whNkzEK5QBnjXZlG', 2, true, false);

-- Acteur 3: Employé (ROLE_EMPLOYEE, id = 3) - Mot de passe temporaire -> must_change_password = true
INSERT INTO users (username, email, password, role_id, enabled, must_change_password)
VALUES ('employee', 'employee@crm.com', '$2b$10$DYhs3YZ.37ZwVeY6tSPSq.t1e4cgK3YO.RZJqpkyw2hwMNgsk5nwG', 3, true, true);

-- Acteur 4: Client (ROLE_CLIENT, id = 4)
INSERT INTO users (username, email, password, role_id, enabled, must_change_password)
VALUES ('client', 'client@crm.com', '$2b$10$P7PJ56Mw8Gj95AT/K3f0Ve6Y/lv5ZIkDNArhifku6J1JH3LjfRDam', 4, true, false);

-- 3. Créer la fiche employé correspondante pour le compte 'employee' afin qu'il puisse consulter son profil ("Mon Profil")
INSERT INTO employees (first_name, last_name, email, department, position, hire_date, user_id)
SELECT 'Jean', 'Dupont', 'employee@crm.com', 'Informatique', 'Développeur Fullstack', '2024-01-15', id
FROM users WHERE username = 'employee';

-- 4. Vérification
SELECT u.id, u.username, u.email, r.name AS role, u.must_change_password FROM users u JOIN roles r ON u.role_id = r.id;
