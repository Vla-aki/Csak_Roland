CREATE DATABASE IF NOT EXISTS dronsag_db;
USE dronsag_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'driver') NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    availability VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role, phone, location, verified) VALUES
('Kovács János', 'janos@example.com', '$2a$10$YourHashedPasswordHere', 'customer', '+36 30 123 4567', 'Budapest', TRUE);