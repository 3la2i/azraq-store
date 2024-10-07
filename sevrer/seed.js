const mongoose = require('mongoose');

// MongoDB Atlas connection URI
const uri = 'mongodb+srv://alaaata25:alaaata87@cluster0.6hmfl.mongodb.net/azraqStore?retryWrites=true&w=majority';

// Define schemas
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  address: {
    street: String,
    neighborhood: String,
    state: String,
    zipCode: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  cuisine: [String],
  rating: { type: Number, default: 0 },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  image: String,
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const Category = mongoose.model('Category', categorySchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Product = mongoose.model('Product', productSchema);

// Seed data
const categories = [
  { name: "شاورما", description: "لحم ملفوف في خبز عربي مع خضروات وصلصات" },
  { name: "فلافل", description: "كرات مقلية من الحمص أو الفول" },
  { name: "مناقيش", description: "فطائر مخبوزة مع زعتر أو جبنة" },
  { name: "كباب", description: "أسياخ من اللحم المشوي" },
  { name: "حمص", description: "معجون الحمص الكريمي" },
  { name: "فتة", description: "طبق من الخبز المحمص والحمص واللبن" },
  { name: "مشاوي", description: "لحوم مشوية متنوعة" },
  { name: "سلطات", description: "خضروات طازجة مع تتبيلات مختلفة" },
  { name: "عصائر طازجة", description: "مشروبات منعشة من الفواكه الطازجة" },
  { name: "حلويات", description: "حلويات عربية تقليدية" }
];

const restaurants = [
  {
    name: "شاورما الملك",
    description: "أشهى أنواع الشاورما في عمان",
    image: "https://example.com/shawarma-king.jpg",
    address: {
      street: "شارع الرينبو",
      neighborhood: "الدوار السابع",
      state: "عمان",
      zipCode: "11183"
    },
    location: {
      type: "Point",
      coordinates: [35.8969, 31.9539]
    },
    cuisine: ["شاورما", "مشاوي", "سلطات"],
    rating: 4.7,
    openingHours: {
      monday: { open: "11:00", close: "23:00" },
      tuesday: { open: "11:00", close: "23:00" },
      wednesday: { open: "11:00", close: "23:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "13:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "11:00", close: "23:00" }
    }
  },
  {
    name: "فلافل الحارة",
    description: "فلافل طازجة وساخنة على مدار الساعة",
    image: "https://example.com/falafel-alhara.jpg",
    address: {
      street: "شارع الجامعة",
      neighborhood: "الجبيهة",
      state: "عمان",
      zipCode: "11942"
    },
    location: {
      type: "Point",
      coordinates: [35.8712, 32.0178]
    },
    cuisine: ["فلافل", "حمص", "فتة"],
    rating: 4.5,
    openingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "13:00", close: "22:00" },
      saturday: { open: "08:00", close: "22:00" },
      sunday: { open: "08:00", close: "22:00" }
    }
  },
  {
    name: "مناقيش وزعتر",
    description: "مناقيش طازجة مخبوزة على الطريقة التقليدية",
    image: "https://example.com/manakish-zaatar.jpg",
    address: {
      street: "شارع مكة",
      neighborhood: "العبدلي",
      state: "عمان",
      zipCode: "11181"
    },
    location: {
      type: "Point",
      coordinates: [35.9104, 31.9565]
    },
    cuisine: ["مناقيش", "فطائر", "معجنات"],
    rating: 4.6,
    openingHours: {
      monday: { open: "07:00", close: "19:00" },
      tuesday: { open: "07:00", close: "19:00" },
      wednesday: { open: "07:00", close: "19:00" },
      thursday: { open: "07:00", close: "19:00" },
      friday: { open: "07:00", close: "19:00" },
      saturday: { open: "07:00", close: "19:00" },
      sunday: { open: "07:00", close: "19:00" }
    }
  }
];

const products = [
  {
    name: "شاورما دجاج",
    description: "شاورما دجاج مشوية مع خضار وصوص خاص",
    price: 3.5,
    category: "شاورما",
    restaurant: "شاورما الملك",
    image: "https://example.com/chicken-shawarma.jpg",
    isAvailable: true
  },
  {
    name: "شاورما لحم",
    description: "شاورما لحم بقري مشوي مع خضار وصوص طحينة",
    price: 4.0,
    category: "شاورما",
    restaurant: "شاورما الملك",
    image: "https://example.com/beef-shawarma.jpg",
    isAvailable: true
  },
  {
    name: "طبق مشاوي مشكل",
    description: "تشكيلة من اللحوم المشوية مع الأرز والسلطة",
    price: 12.0,
    category: "مشاوي",
    restaurant: "شاورما الملك",
    image: "https://example.com/mixed-grill.jpg",
    isAvailable: true
  },
  {
    name: "ساندويش فلافل",
    description: "فلافل مقرمشة مع خضار وطحينة في خبز عربي",
    price: 1.5,
    category: "فلافل",
    restaurant: "فلافل الحارة",
    image: "https://example.com/falafel-sandwich.jpg",
    isAvailable: true
  },
  {
    name: "حمص بالصنوبر",
    description: "طبق حمص كريمي مزين بحبات الصنوبر المحمص",
    price: 3.0,
    category: "حمص",
    restaurant: "فلافل الحارة",
    image: "https://example.com/hummus-pine-nuts.jpg",
    isAvailable: true
  },
  {
    name: "فتة حمص",
    description: "طبقات من الخبز المحمص والحمص واللبن والصنوبر",
    price: 4.5,
    category: "فتة",
    restaurant: "فلافل الحارة",
    image: "https://example.com/fatteh-hummus.jpg",
    isAvailable: true
  },
  {
    name: "مناقيش زعتر",
    description: "عجين مخبوز مع خلطة الزعتر الخاصة",
    price: 1.0,
    category: "مناقيش",
    restaurant: "مناقيش وزعتر",
    image: "https://example.com/zaatar-manakish.jpg",
    isAvailable: true
  },
  {
    name: "مناقيش جبنة",
    description: "عجين مخبوز مع الجبنة البيضاء الطرية",
    price: 1.5,
    category: "مناقيش",
    restaurant: "مناقيش وزعتر",
    image: "https://example.com/cheese-manakish.jpg",
    isAvailable: true
  },
  {
    name: "فطيرة سبانخ",
    description: "فطيرة محشوة بالسبانخ والبصل والسماق",
    price: 2.0,
    category: "فطائر",
    restaurant: "مناقيش وزعتر",
    image: "https://example.com/spinach-pie.jpg",
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected successfully to MongoDB Atlas');

    // Clear existing data
    await Category.deleteMany({});
    await Restaurant.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`${insertedCategories.length} categories inserted`);

    // Insert restaurants
    const insertedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`${insertedRestaurants.length} restaurants inserted`);

    // Insert products
    for (let product of products) {
      const category = await Category.findOne({ name: product.category });
      const restaurant = await Restaurant.findOne({ name: product.restaurant });
      
      if (category && restaurant) {
        product.category = category._id;
        product.restaurant = restaurant._id;
        await Product.create(product);
      }
    }
    console.log(`${products.length} products inserted`);

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

// Run the seeding function
seedDatabase();