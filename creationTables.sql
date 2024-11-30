CREATE TABLE Farmer (
    farmer_id INT PRIMARY KEY,
    farmer_name VARCHAR(100) NOT NULL,
    farmer_surname VARCHAR(100) NOT NULL,
    farmer_email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    farm_location VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    gov_id VARCHAR(50) UNIQUE NOT NULL,
    crops TEXT,
    profile_image VARCHAR(255),
    farm_name VARCHAR(100) NOT NULL,
    farm_size NUMERIC CHECK (farm_size >= 0)
);

-- Create Farm table
CREATE TABLE Farm (
    farm_id INT PRIMARY KEY,
    farmer_id INT REFERENCES Farmer(farmer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    farm_name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    farm_size NUMERIC NOT NULL
);

-- Create Product table
CREATE TABLE Product (
    product_id INT PRIMARY KEY,
    farmer_id INT REFERENCES Farmer(farmer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    farm_id INT REFERENCES Farm(farm_id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_name VARCHAR(100) NOT NULL,
    product_category VARCHAR(50),
    product_price NUMERIC(10, 2) NOT NULL,
    product_quantity INT NOT NULL
);

-- Create Buyer table
CREATE TABLE Buyer (
    buyer_id INT PRIMARY KEY,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_surname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create Orders table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    buyer_id INT REFERENCES Buyer(buyer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    order_status VARCHAR(50) DEFAULT 'Pending'
);

-- Create OrderDetails table
CREATE TABLE OrderDetails (
    order_detail_id INT PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id INT REFERENCES Product(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
    quantity INT NOT NULL,
    total_price NUMERIC(10, 2)
);

-- Create Delivery table
CREATE TABLE Delivery (
    delivery_id INT PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    farmer_id INT REFERENCES Farmer(farmer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    delivery_method VARCHAR(50) NOT NULL,
    delivery_status VARCHAR(50) DEFAULT 'Processing',
    delivery_date DATE NOT NULL,
    delivery_cost NUMERIC(10, 2) NOT NULL
);

-- Create Payment table
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    total_cost NUMERIC(10, 2)
);

-- Trigger to calculate total_price in OrderDetails
CREATE OR REPLACE FUNCTION calculate_order_detail_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate total_price as quantity * product_price
    NEW.total_price := NEW.quantity * (
        SELECT product_price
        FROM Product
        WHERE product_id = NEW.product_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_order_detail_total_trigger
BEFORE INSERT OR UPDATE ON OrderDetails
FOR EACH ROW
EXECUTE FUNCTION calculate_order_detail_total();

-- Create View: OrderPaymentSummary
CREATE OR REPLACE VIEW OrderPaymentSummary AS
SELECT
    o.order_id,
    SUM(od.total_price) AS total_product_price,
    d.delivery_cost,
    (SUM(od.total_price) + d.delivery_cost) AS total_cost
FROM
    Orders o
JOIN
    OrderDetails od ON o.order_id = od.order_id
JOIN
    Delivery d ON o.order_id = d.order_id
GROUP BY
    o.order_id, d.delivery_cost;
