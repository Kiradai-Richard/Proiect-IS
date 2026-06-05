require('dotenv').config();
const mysql  = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function init() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
  });

  console.log('Conexiune MySQL stabilita...');

  // ── Creare baza de date ──────────────────────────────────────────────────────
  await conn.query(`CREATE DATABASE IF NOT EXISTS pc_garage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE pc_garage`);
  console.log('Baza de date pc_garage selectata.');

  // ── Tabele ───────────────────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      email       VARCHAR(100) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      role        ENUM('manager','employee','client') NOT NULL DEFAULT 'client',
      level       ENUM('senior','junior') NULL,
      department  VARCHAR(100) NULL,
      phone       VARCHAR(20)  NULL,
      address     TEXT NULL,
      start_date  DATE NULL,
      active      TINYINT(1) NOT NULL DEFAULT 1,
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id    INT AUTO_INCREMENT PRIMARY KEY,
      name  VARCHAR(100) NOT NULL,
      slug  VARCHAR(100) NOT NULL UNIQUE,
      icon  VARCHAR(10)  NULL,
      color VARCHAR(20)  NULL
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(200) NOT NULL,
      category_id  INT NOT NULL,
      product_type ENUM('system','component') NOT NULL DEFAULT 'component',
      price        DECIMAL(10,2) NOT NULL DEFAULT 0,
      stock        INT NOT NULL DEFAULT 0,
      description  TEXT NULL,
      specs        JSON NULL,
      image        VARCHAR(500) NULL,
      rating       TINYINT NOT NULL DEFAULT 4,
      active       TINYINT(1) NOT NULL DEFAULT 1,
      created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS promotions (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      name             VARCHAR(200) NOT NULL,
      product_id       INT NOT NULL,
      discount_percent INT NOT NULL DEFAULT 10,
      active           TINYINT(1) NOT NULL DEFAULT 1,
      created_by       INT NOT NULL,
      created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id)  REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by)  REFERENCES users(id)
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id                   INT AUTO_INCREMENT PRIMARY KEY,
      user_id              INT NOT NULL,
      order_type           ENUM('purchase','service') NOT NULL,
      customer_name        VARCHAR(100) NOT NULL,
      customer_email       VARCHAR(100) NOT NULL,
      customer_phone       VARCHAR(20)  NULL,
      customer_address     TEXT NULL,
      total                DECIMAL(10,2) NOT NULL DEFAULT 0,
      status               ENUM('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
      service_description  TEXT NULL,
      service_date         DATE NULL,
      handled_by           INT NULL,
      notes                TEXT NULL,
      created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id)    REFERENCES users(id),
      FOREIGN KEY (handled_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      order_id         INT NOT NULL,
      product_id       INT NULL,
      item_name        VARCHAR(200) NULL,
      quantity         INT NOT NULL DEFAULT 1,
      price            DECIMAL(10,2) NOT NULL,
      is_promo_discount TINYINT(1) NOT NULL DEFAULT 0,
      FOREIGN KEY (order_id)  REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    )
  `);
  console.log('Tabele create.');

  // ── Categorii ────────────────────────────────────────────────────────────────
  const [catRows] = await conn.query('SELECT COUNT(*) AS cnt FROM categories');
  if (catRows[0].cnt === 0) {
    await conn.query(`
      INSERT INTO categories (name, slug, icon, color) VALUES
      ('Sisteme Desktop PC', 'sisteme',     '🖥️', '#FF6B35'),
      ('Procesoare',         'procesoare',  '⚡', '#00B4D8'),
      ('Placi Video',        'placi-video', '🎮', '#7B2CBF'),
      ('Placi de Baza',      'placi-baza',  '🔲', '#2EC4B6')
    `);
    console.log('Categorii adaugate.');
  }

  // ── Useri default ────────────────────────────────────────────────────────────
  const [userRows] = await conn.query('SELECT COUNT(*) AS cnt FROM users');
  if (userRows[0].cnt === 0) {
    const adminHash  = await bcrypt.hash('admin123',  10);
    const clientHash = await bcrypt.hash('client123', 10);
    await conn.query(`
      INSERT INTO users (name, email, password, role, level, department, active) VALUES
      ('Admin PCG',    'admin@pcgarage.ro', ?, 'manager',  NULL,     'Management', 1),
      ('Maria Ionescu','maria@pcgarage.ro', ?, 'employee', 'senior', 'Vanzari',    1),
      ('Andrei Popa',  'andrei@pcgarage.ro',?, 'employee', 'junior', 'Depozit',    1),
      ('Client Test',  'client@test.ro',   ?, 'client',   NULL,     NULL,         1)
    `, [adminHash, adminHash, adminHash, clientHash]);
    console.log('Useri default creati.');
  }

  // ── Produse ──────────────────────────────────────────────────────────────────
  const [prodRows] = await conn.query('SELECT COUNT(*) AS cnt FROM products');
  if (prodRows[0].cnt === 0) {
    const [cats] = await conn.query('SELECT id, slug FROM categories');
    const catId = cats.reduce((acc, c) => { acc[c.slug] = c.id; return acc; }, {});

    // Sisteme Desktop PC (system)
    const systems = [
      { name: 'PC Gaming ZMEU Prime',                  price: 3499.99, image: '/images/sisteme/zmeu.png' },
      { name: 'PC Gaming BALAUR Epic MaxPlus',          price: 4299.99, image: '/images/sisteme/balaur.png' },
      { name: 'PC Gaming DRAGON Legendar MaxPlus',      price: 6199.99, image: '/images/sisteme/dragon.png' },
      { name: 'PC Gaming Arkay',                        price: 3599.99, image: '/images/sisteme/arkay.png' },
      { name: 'PC Gaming Sorcerer',                     price: 5499.99, image: '/images/sisteme/sorcerer.png' },
      { name: 'PC Gaming Serpent V2',                   price: 4199.99, image: '/images/sisteme/serpent-v2.png' },
      { name: 'PC Gaming Helix',                        price: 6499.99, image: '/images/sisteme/helix.png' },
      { name: 'PC Gaming Corvus',                       price: 1499.99, image: '/images/sisteme/corvus.png' },
      { name: 'PC Gaming Cerberus Powered by ASUS',     price: 7999.99, image: '/images/sisteme/cerberus.png' },
      { name: 'PC Gaming Viking Intel',                 price: 2199.99, image: '/images/sisteme/viking-intel.png' },
    ];

    // Procesoare (component)
    const processors = [
      { name: 'Procesor Intel Core i3 12100F 3.3GHz Box',   price: 459.99,  image: '/images/Corei312100F3.3GHz.png' },
      { name: 'Procesor AMD Ryzen 5 5500 3.6GHz Box',       price: 429.99,  image: '/images/ProcesorAMDRyzen555003.6GHz Box.png' },
      { name: 'Procesor Intel Core i3 13100F 3.4GHz Box',   price: 599.99,  image: '/images/Corei313100F3.4GHz.png' },
      { name: 'Procesor AMD Ryzen 5 5600 3.5GHz Box',       price: 650.99,  image: '/images/ProcesorAMDRyzen556003.5GHzBox.png' },
      { name: 'Procesor Intel Core i5 12400F 2.5GHz Box',   price: 689.99,  image: '/images/ProcesorIntelCorei512400F2.5GHzBox.png' },
      { name: 'Procesor AMD Ryzen 5 5600X 3.7GHz Box',      price: 790.99,  image: '/images/ProcesorAMDRyzen556003.5GHzBox.png' },
      { name: 'Procesor Intel Core i5 13400F 2.5GHz Box',   price: 1049.99, image: '/images/Corei513400F2.5GHz.png' },
      { name: 'Procesor AMD Ryzen 5 7600X 4.7GHz Box',      price: 1150.99, image: '/images/Ryzen57600X4.7GHz.png' },
      { name: 'Procesor Intel Core i5 14400F 2.5GHz Box',   price: 1149.99, image: '/images/Corei513400F2.5GHz.png' },
      { name: 'Procesor AMD Ryzen 7 5700X 3.4GHz Box',      price: 990.99,  image: '/images/Ryzen75700X3.4GHz.png' },
      { name: 'Procesor Intel Core i5 13600KF 3.5GHz Box',  price: 1429.99, image: '/images/intel-i5-13600kf.png' },
      { name: 'Procesor AMD Ryzen 7 5800X3D 3.4GHz Box',    price: 1450.99, image: '/images/Ryzen75800X3D3.4GHz.png' },
      { name: 'Procesor Intel Core i7 13700K 3.4GHz Box',   price: 1999.99, image: '/images/Corei713700K3.4GHz.png' },
      { name: 'Procesor AMD Ryzen 7 7700 3.8GHz Box',       price: 1550.99, image: '/images/Ryzen777003.8GHz.png' },
      { name: 'Procesor Intel Core i7 14700K 3.4GHz Box',   price: 2099.99, image: '/images/Corei714700K3.4GHz.png' },
      { name: 'Procesor AMD Ryzen 7 7700X 4.5GHz Box',      price: 1690.99, image: '/images/Ryzen77700X4.5GHz.png' },
      { name: 'Procesor Intel Core i9 14900KS 3.2GHz Box',  price: 3299.99, image: '/images/Corei914900KS3.2GHz.png' },
      { name: 'Procesor AMD Ryzen 7 7800X3D 4.2GHz Box',    price: 1999.99, image: '/images/Ryzen77800X3D4.2GHz.png' },
      { name: 'Procesor Intel Core Ultra 5 245K 4.2GHz Box', price: 1549.99, image: '/images/CoreUltra5245K4.2GHz.png' },
      { name: 'Procesor AMD Ryzen 9 7950X3D 4.2GHz Box',    price: 3100.99, image: '/images/Ryzen97950X3D4.2GHz.png' },
    ];

    // Placi Video (component)
    const gpus = [
      { name: 'Placa Video NVIDIA GeForce RTX 3060 12GB',      price: 1499.99, image: '/images/placi_vid/GeForceRTX306012GB.png' },
      { name: 'Placa Video AMD Radeon RX 6600 8GB',            price: 1099.99, image: '/images/placi_vid/RadeonRX66008GB.png' },
      { name: 'Placa Video NVIDIA GeForce RTX 4060 8GB',       price: 1649.99, image: '/images/placi_vid/GeForceRTX40608GB.png' },
      { name: 'Placa Video AMD Radeon RX 7600 8GB',            price: 1449.99, image: '/images/placi_vid/RadeonRX76008GB.png' },
      { name: 'Placa Video NVIDIA GeForce RTX 4070 SUPER 12GB',price: 3299.99, image: '/images/placi_vid/GeForceRTX4070SUPER12GB.png' },
      { name: 'Placa Video AMD Radeon RX 7700 XT 12GB',        price: 2399.99, image: '/images/placi_vid/RadeonRX7700XT12GB.png' },
      { name: 'Placa Video NVIDIA GeForce RTX 4080 SUPER 16GB',price: 5499.99, image: '/images/placi_vid/GeForceRTX4080SUPER16GB.png' },
      { name: 'Placa Video AMD Radeon RX 7800 XT 16GB',        price: 2799.99, image: '/images/placi_vid/RadeonRX7800XT16GB.png' },
      { name: 'Placa Video NVIDIA GeForce RTX 4090 24GB',      price: 9999.99, image: '/images/placi_vid/GeForceRTX409024GB.png' },
      { name: 'Placa Video AMD Radeon RX 7900 XTX 24GB',       price: 5199.99, image: '/images/placi_vid/RadeonRX7900XTX24GB.png' },
    ];

    // Placi de Baza (component)
    const motherboards = [
      { name: 'Placa de baza GIGABYTE B650 EAGLE AX',        price: 799.99,  image: '/images/placi_baza/GIGABYTEB650EAGLEAX.png' },
      { name: 'Placa de baza ASUS TUF GAMING B550-PLUS',     price: 659.99,  image: '/images/placi_baza/ASUSTUFGAMINGB550-PLUS.png' },
      { name: 'Placa de baza MSI MAG Z790 TOMAHAWK WIFI',    price: 1399.99, image: '/images/placi_baza/MSIMAGZ790TOMAHAWKWIFI.png' },
      { name: 'Placa de baza ASUS ROG STRIX B760-F GAMING',  price: 1099.99, image: '/images/placi_baza/ASUSROGSTRIXB760-FGAMING.png' },
      { name: 'Placa de baza GIGABYTE B760M DS3H',           price: 549.99,  image: '/images/placi_baza/GIGABYTEB760MDS3H.png' },
    ];

    const insertProduct = async (name, price, image, categorySlug, productType) => {
      await conn.query(
        `INSERT INTO products (name, category_id, product_type, price, stock, image, rating, active) VALUES (?,?,?,?,10,?,4,1)`,
        [name, catId[categorySlug], productType, price, image]
      );
    };

    for (const p of systems)      await insertProduct(p.name, p.price, p.image, 'sisteme',     'system');
    for (const p of processors)   await insertProduct(p.name, p.price, p.image, 'procesoare',  'component');
    for (const p of gpus)         await insertProduct(p.name, p.price, p.image, 'placi-video', 'component');
    for (const p of motherboards) await insertProduct(p.name, p.price, p.image, 'placi-baza',  'component');

    console.log(`${systems.length + processors.length + gpus.length + motherboards.length} produse adaugate.`);
  }

  await conn.end();
  console.log('\nInitializare completa! Porneste backend-ul cu: npm run dev');
}

init().catch(e => { console.error('Eroare init-db:', e.message); process.exit(1); });
