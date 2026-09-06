-- ShopEase Seed Data
USE shopease;

INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Gadgets, devices and accessories'),
('Fashion', 'fashion', 'Clothing, footwear and accessories'),
('Home & Kitchen', 'home-kitchen', 'Furniture, decor and kitchenware'),
('Books', 'books', 'Fiction, non-fiction and academic titles'),
('Sports & Fitness', 'sports-fitness', 'Equipment and gear for an active lifestyle');

INSERT INTO products (category_id, name, description, price, stock, image_url) VALUES
(1, 'Wireless Bluetooth Headphones', 'Over-ear headphones with active noise cancellation and 30-hour battery life.', 2499.00, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
(1, 'Smartwatch Series 5', 'Fitness tracking smartwatch with heart-rate monitor and AMOLED display.', 3999.00, 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
(1, '65W Fast Charger', 'Compact GaN fast charger compatible with laptops and phones.', 1299.00, 100, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'),
(1, 'Portable Bluetooth Speaker', 'Waterproof speaker with 12-hour playtime and deep bass.', 1799.00, 60, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'),
(1, '27-inch 4K Monitor', 'Ultra HD IPS monitor ideal for work and creative tasks.', 18999.00, 15, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'),

(2, 'Men Casual Cotton Shirt', 'Breathable slim-fit cotton shirt available in multiple colors.', 899.00, 80, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'),
(2, 'Women Running Shoes', 'Lightweight cushioned running shoes for daily training.', 2199.00, 50, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'),
(2, 'Denim Jacket', 'Classic unisex denim jacket with a comfortable regular fit.', 1599.00, 40, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'),
(2, 'Leather Wallet', 'Genuine leather bi-fold wallet with card slots.', 699.00, 90, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'),

(3, 'Non-Stick Cookware Set', '5-piece non-stick cookware set suitable for all stovetops.', 2999.00, 25, 'https://images.unsplash.com/photo-1584990347449-a2d4c0d5b7e9?w=600'),
(3, 'Memory Foam Pillow', 'Ergonomic cervical pillow for better neck support and sleep.', 999.00, 70, 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4a9?w=600'),
(3, 'LED Desk Lamp', 'Adjustable LED lamp with touch control and USB charging port.', 1199.00, 55, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'),

(4, 'Atomic Habits', 'Bestselling book on building good habits and breaking bad ones.', 499.00, 120, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'),
(4, 'The Pragmatic Programmer', 'Classic guide to becoming a better, more effective software developer.', 899.00, 40, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'),
(4, 'Sapiens: A Brief History of Humankind', 'A thought-provoking exploration of human history and society.', 599.00, 65, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'),

(5, 'Yoga Mat', 'Non-slip 6mm yoga mat with carry strap.', 799.00, 85, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'),
(5, 'Adjustable Dumbbell Set', 'Space-saving adjustable dumbbells, 2.5kg to 20kg per hand.', 5999.00, 20, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'),
(5, 'Resistance Bands Set', 'Set of 5 resistance bands for strength and mobility training.', 599.00, 100, 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=600');
