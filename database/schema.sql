-- initial schema and seed for expense management
DROP DATABASE IF EXISTS expense_mgmt;
CREATE DATABASE expense_mgmt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expense_mgmt;

-- Companies
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  default_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('EMPLOYEE','MANAGER','ADMIN') NOT NULL DEFAULT 'EMPLOYEE',
  manager_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Approval rules (basic, extendable)
CREATE TABLE approval_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  level INT NOT NULL,
  role_required ENUM('MANAGER','ADMIN') NOT NULL,
  amount_threshold DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  approver_user_id INT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (approver_user_id) REFERENCES users(id)
);

-- Expenses
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  receipt_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Approvals
CREATE TABLE approvals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL,
  approver_id INT NOT NULL,
  level INT NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  comment VARCHAR(255) NULL,
  decided_at TIMESTAMP NULL,
  FOREIGN KEY (expense_id) REFERENCES expenses(id),
  FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- Seed
INSERT INTO companies (name, default_currency) VALUES ('Acme Corp', 'USD');

-- Passwords are bcrypt hashes of:
-- admin123, manager123, user123
-- For demo simplicity, we provide precomputed hashes (bcrypt salt rounds 10)
-- admin123 -> $2b$10$6Pcz.Rv6H2Y/2tK2vZyPUe7tI7g8JmWcQ8Lx7s9wYzqvQ3aM8U3jK
-- manager123 -> $2b$10$7f9x8oM/2Wixr5Xv4qgp7uIQk1uKp7m8oL8pQ1rX4a4pB5o5y8Uay
-- user123 -> $2b$10$e0O3p7mP/0c4pWm8W8nGte5mKp7s7s2k3oG3L4z9yTgZVg3hZy0zO

INSERT INTO users (company_id, name, email, password_hash, role)
VALUES
(1, 'Admin User', 'admin@acme.com', '$2b$10$6Pcz.Rv6H2Y/2tK2vZyPUe7tI7g8JmWcQ8Lx7s9wYzqvQ3aM8U3jK', 'ADMIN'),
(1, 'Jane Manager', 'manager@acme.com', '$2b$10$7f9x8oM/2Wixr5Xv4qgp7uIQk1uKp7m8oL8pQ1rX4a4pB5o5y8Uay', 'MANAGER'),
(1, 'Evan Employee', 'emp1@acme.com', '$2b$10$e0O3p7mP/0c4pWm8W8nGte5mKp7s7s2k3oG3L4z9yTgZVg3hZy0zO', 'EMPLOYEE');

-- Assign manager to employee
UPDATE users SET manager_id = 2 WHERE email = 'emp1@acme.com';

-- Rules: Level 1 -> MANAGER for all amounts; Level 2 -> ADMIN for all amounts (hierarchical approval)
INSERT INTO approval_rules (company_id, level, role_required, amount_threshold) VALUES
(1, 1, 'MANAGER', 0.00),
(1, 2, 'ADMIN', 0.00);
