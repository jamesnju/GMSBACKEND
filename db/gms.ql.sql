-- 1. Create 'users' Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer', -- admin or customer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create 'services' Table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create 'appointments' Table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  service_id INT NOT NULL,
  appointment_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services(id)
);

-- 4. Create 'payments' Table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  appointment_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50), -- 'stripe' or 'vukadaraja'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_payment FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- 5. Create 'vehicles' Table
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INT,
  license_plate VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_vehicle FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6. Create 'reviews' Table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  service_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_review FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_service_review FOREIGN KEY (service_id) REFERENCES services(id)
);

-- 7. Create 'payment_transactions' Table
CREATE TABLE payment_transactions (
  id SERIAL PRIMARY KEY,
  payment_id INT NOT NULL,
  transaction_id VARCHAR(255),
  payment_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment FOREIGN KEY (payment_id) REFERENCES payments(id)
);

-- 8. Create 'service_categories' Table
CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create 'admin_logs' Table
CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES users(id)
);
