/**
 * seedData.js  –  Realistic mock data for Mehandi Management System
 *
 * Run:  node seedData.js
 *
 * What it does:
 *   1. Clears ALL existing documents from every collection
 *   2. Creates 1 admin, 8 artists (approved/pending/rejected mix), 15 customers
 *   3. Creates 3 designs per artist  → 24 designs total
 *   4. Creates 30 bookings spread across all statuses
 *   5. Creates SlotLock rows for every accepted/confirmed/completed booking
 *   6. Creates realistic chat messages for each booking
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const User          = require("./models/User");
const ArtistProfile = require("./models/ArtistProfile");
const Booking       = require("./models/Booking");
const Design        = require("./models/Design");
const Message       = require("./models/Message");
const SlotLock      = require("./models/SlotLock");

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const hash    = (pw) => bcrypt.hashSync(pw, 10);
const pick    = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function dateKey(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}
function bookingDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/* ------------------------------------------------------------------ */
/*  Static seed data                                                    */
/* ------------------------------------------------------------------ */

/* ---------- CUSTOMERS (15) ---------------------------------------- */
const CUSTOMER_DATA = [
  { name: "Priya Sharma",       email: "priya.sharma@gmail.com",      phone: "9876543210", address: "12, Rose Garden Colony", city: "Chennai" },
  { name: "Ananya Krishnan",    email: "ananya.k@outlook.com",        phone: "9845612378", address: "34, Velachery Main Road",  city: "Chennai" },
  { name: "Meena Rajan",        email: "meena.rajan@yahoo.com",       phone: "9123456789", address: "7, Besant Nagar 3rd St",   city: "Chennai" },
  { name: "Divya Nair",         email: "divya.nair@gmail.com",        phone: "9000123456", address: "88, Adyar Flats",          city: "Chennai" },
  { name: "Lakshmi Venkat",     email: "lakshmi.v@gmail.com",         phone: "9988776655", address: "21, Anna Nagar West",      city: "Chennai" },
  { name: "Sowmya Balaji",      email: "sowmya.balaji@gmail.com",     phone: "9876012345", address: "5, Mylapore Tank St",      city: "Chennai" },
  { name: "Revathi Sundaram",   email: "revathi.sun@hotmail.com",     phone: "9444555666", address: "9, T Nagar 2nd Lane",      city: "Chennai" },
  { name: "Kavitha Murali",     email: "kavitha.m@gmail.com",         phone: "9654321098", address: "3, Saidapet High Road",    city: "Chennai" },
  { name: "Saranya Pillai",     email: "saranya.pillai@gmail.com",    phone: "9765432109", address: "14, Tambaram West",        city: "Tambaram" },
  { name: "Nithya Gopal",       email: "nithya.gopal@gmail.com",      phone: "9876543001", address: "67, Sholinganallur",       city: "Chennai" },
  { name: "Pavithra Rajan",     email: "pavithra.r@gmail.com",        phone: "9345678901", address: "11, Chromepet Street 4",   city: "Chennai" },
  { name: "Aarthy Senthil",     email: "aarthy.s@gmail.com",          phone: "9234567890", address: "2, Velachery Lake Road",   city: "Chennai" },
  { name: "Sudha Balasubramanian", email: "sudha.bala@gmail.com",     phone: "9887766554", address: "88, Kodambakkam High Rd",  city: "Chennai" },
  { name: "Geetha Ramachandran",email: "geetha.rc@gmail.com",         phone: "9123498765", address: "55, Perambur Barracks Rd", city: "Chennai" },
  { name: "Vasantha Kumar",     email: "vasantha.k@outlook.com",      phone: "9009988776", address: "39, Nungambakkam High Rd", city: "Chennai" },
];

/* ---------- ARTISTS (8) ------------------------------------------- */
const ARTIST_DATA = [
  {
    name: "Deepa Mehandi Arts",
    email: "deepa.mehandi@gmail.com",
    phone: "9876500001",
    address: "23, Pondy Bazaar",
    city: "Chennai",
    profile: {
      experience: 8,
      specialization: "Bridal Mehandi",
      location: "Chennai",
      availableLocations: ["Chennai", "Tambaram", "Kanchipuram"],
      availableTime: "9 AM – 7 PM",
      services: ["Bridal Full Hand", "Arabic Pattern", "Rajasthani Bridal", "Feet Mehandi"],
      bio: "With over 8 years of experience, I specialise in intricate bridal mehandi designs that blend traditional Rajasthani motifs with modern Arabic patterns. I have served 500+ brides across Tamil Nadu.",
      pricePerHour: 1200,
      rating: 4.8,
      totalReviews: 143,
      status: "approved",
    },
  },
  {
    name: "Lavanya Bridal Studio",
    email: "lavanya.bridal@gmail.com",
    phone: "9876500002",
    address: "45, Anna Salai",
    city: "Chennai",
    profile: {
      experience: 5,
      specialization: "Arabic Mehandi",
      location: "Chennai",
      availableLocations: ["Chennai", "Velachery", "OMR"],
      availableTime: "10 AM – 8 PM",
      services: ["Arabic Full Hand", "Indo-Arabic", "Pakistani Bridal", "Feet & Leg Mehandi"],
      bio: "Passionate about contemporary Arabic mehandi art with delicate floral flows and geometric precision. 5 years serving Chennai brides with 400+ satisfied customers.",
      pricePerHour: 900,
      rating: 4.6,
      totalReviews: 98,
      status: "approved",
    },
  },
  {
    name: "Preethi Henna Creations",
    email: "preethi.henna@gmail.com",
    phone: "9876500003",
    address: "7, Mylapore",
    city: "Chennai",
    profile: {
      experience: 12,
      specialization: "Rajasthani Mehandi",
      location: "Chennai",
      availableLocations: ["Chennai", "Mylapore", "Alwarpet", "Triplicane"],
      availableTime: "8 AM – 6 PM",
      services: ["Rajasthani Bridal", "Traditional Tamil", "Full Sleeve", "Bridal Feet"],
      bio: "A veteran mehandi artist with 12 years experience and trained in Jaipur's traditional Rajasthani bridal style. Known for ultra-fine cone work and long-lasting deep colour.",
      pricePerHour: 1500,
      rating: 4.9,
      totalReviews: 220,
      status: "approved",
    },
  },
  {
    name: "Sindhu Mehandi & Art",
    email: "sindhu.mehandi@gmail.com",
    phone: "9876500004",
    address: "12, Tambaram West",
    city: "Tambaram",
    profile: {
      experience: 3,
      specialization: "Indo-Arabic Fusion",
      location: "Tambaram",
      availableLocations: ["Tambaram", "Pallavaram", "Chrompet"],
      availableTime: "10 AM – 7 PM",
      services: ["Indo-Arabic", "Simple Party Mehandi", "Bridal Hands", "Kids Tattoo Mehandi"],
      bio: "Young and passionate mehandi artist specialising in fusion designs that marry Indo-Arabic styles. Affordable, creative, and reliable for functions and parties.",
      pricePerHour: 600,
      rating: 4.3,
      totalReviews: 54,
      status: "approved",
    },
  },
  {
    name: "Kamala Traditional Arts",
    email: "kamala.trad@gmail.com",
    phone: "9876500005",
    address: "88, West Mambalam",
    city: "Chennai",
    profile: {
      experience: 15,
      specialization: "Traditional Tamil Mehandi",
      location: "Chennai",
      availableLocations: ["Chennai", "Kanchipuram", "Vellore"],
      availableTime: "7 AM – 5 PM",
      services: ["Traditional Tamil Bridal", "Temple Pattern", "South Indian Bridal", "Leg Full Design"],
      bio: "15+ years of experience with deep roots in South Indian traditional mehandi patterns. I bring authenticity and timeless elegance to every bride's hands.",
      pricePerHour: 800,
      rating: 4.7,
      totalReviews: 312,
      status: "approved",
    },
  },
  {
    name: "Renu Contemporary Henna",
    email: "renu.henna@gmail.com",
    phone: "9876500006",
    address: "34, Adyar",
    city: "Chennai",
    profile: {
      experience: 4,
      specialization: "Modern Minimalist Mehandi",
      location: "Chennai",
      availableLocations: ["Chennai", "Besant Nagar", "ECR"],
      availableTime: "11 AM – 9 PM",
      services: ["Minimalist Bridal", "Single Stroke Arabic", "Geometric Henna", "Glitter Mehandi"],
      bio: "Specialising in modern and minimalist henna for the contemporary bride. Perfect for receptions and parties where a clean, stylish look is key.",
      pricePerHour: 700,
      rating: 4.4,
      totalReviews: 67,
      status: "approved",
    },
  },
  {
    name: "Shalini Mehandi House",
    email: "shalini.mehandi@gmail.com",
    phone: "9876500007",
    address: "19, Anna Nagar East",
    city: "Chennai",
    profile: {
      experience: 2,
      specialization: "Bridal & Party Mehandi",
      location: "Chennai",
      availableLocations: ["Chennai", "Ambattur"],
      availableTime: "9 AM – 7 PM",
      services: ["Bridal Hands", "Party Mehandi", "Arabic Design", "Front Hand Design"],
      bio: "Enthusiastic new-generation mehandi artist with fresh creative designs. Completed 150+ bookings in 2 years and committed to making every occasion special.",
      pricePerHour: 500,
      rating: 4.1,
      totalReviews: 38,
      status: "pending",
    },
  },
  {
    name: "Hemalatha Henna Studio",
    email: "hemalatha.henna@gmail.com",
    phone: "9876500008",
    address: "5, Vadapalani",
    city: "Chennai",
    profile: {
      experience: 6,
      specialization: "Pakistani Bridal Mehandi",
      location: "Chennai",
      availableLocations: ["Chennai", "Porur", "Poonamallee"],
      availableTime: "10 AM – 6 PM",
      services: ["Pakistani Bridal", "Gulf Arabic", "Dulhan Mehandi", "Feet Mehandi"],
      bio: "Trained under master Pakistani mehandi artists with 6 years creating intricate dulhan designs. Known for precision cone control and exceptionally long-lasting colour.",
      pricePerHour: 1100,
      rating: 4.5,
      totalReviews: 89,
      status: "rejected",
    },
  },
];

/* ---------- DESIGNS (3 per artist) --------------------------------- */
const DESIGN_POOL = [
  // Deepa
  [
    { name: "Royal Rajasthani Bridal Set", description: "Full-hand Rajasthani pattern with peacock motif, fine mesh work and intricate border. Ideal for wedding day.", price: 3500, category: "Bridal", image: "https://i.pinimg.com/736x/bridal-rajasthani-1.jpg" },
    { name: "Arabic Floral Sleeve",         description: "Flowing Arabic floral design from wrist to elbow with vine and teardrop elements.", price: 1200, category: "Arabic", image: "https://i.pinimg.com/736x/arabic-sleeve-1.jpg" },
    { name: "Lotus Feet Mehandi",           description: "Traditional lotus and paisley design for the feet, commonly used for South Indian brides.", price: 900, category: "Feet", image: "https://i.pinimg.com/736x/feet-lotus-1.jpg" },
  ],
  // Lavanya
  [
    { name: "Contemporary Arabic Full Hand", description: "Modern Arabic design with bold floral clusters and open spaces for a clean, premium look.", price: 1800, category: "Arabic", image: "https://i.pinimg.com/736x/arabic-fullhand-1.jpg" },
    { name: "Indo-Arabic Fusion Bridal",    description: "A seamless fusion of Indo and Arabic patterns tailored for the modern bride.", price: 2800, category: "Bridal", image: "https://i.pinimg.com/736x/indo-arabic-bridal-1.jpg" },
    { name: "Pakistani Bridal Dulhan",      description: "Dense Pakistani bridal mehandi covering hands and forearms with groom's name hidden inside.", price: 4000, category: "Pakistani", image: "https://i.pinimg.com/736x/pakistani-bridal-1.jpg" },
  ],
  // Preethi
  [
    { name: "Rajasthani Heritage Bridal",   description: "Classic full-hand design with elephant, peacock and jaal patterns sourced from authentic Jaipur tradition.", price: 5000, category: "Bridal", image: "https://i.pinimg.com/736x/rajasthani-heritage-1.jpg" },
    { name: "Full Sleeve Rajasthani",       description: "Elaborate full sleeve pattern with intricate border, fine details and bold motifs up to the shoulder.", price: 3200, category: "Full Sleeve", image: "https://i.pinimg.com/736x/full-sleeve-raj-1.jpg" },
    { name: "Tamil Traditional Bridal",    description: "South Indian traditional design featuring temple motifs, sun and moon symbols and fine lace work.", price: 2500, category: "Traditional", image: "https://i.pinimg.com/736x/tamil-bridal-1.jpg" },
  ],
  // Sindhu
  [
    { name: "Simple Arabic Party Design",   description: "Elegant yet simple Arabic design perfect for receptions and sangeet ceremonies.", price: 500, category: "Party", image: "https://i.pinimg.com/736x/simple-arabic-1.jpg" },
    { name: "Kids Glitter Tattoo Mehandi", description: "Colourful glitter mehandi tattoo designs perfect for kids at weddings and festivals.", price: 300, category: "Kids", image: "https://i.pinimg.com/736x/kids-glitter-1.jpg" },
    { name: "Front Hand Indo-Arabic",      description: "Attractive front-hand design combining Indo-Arabic elements, great for functions.", price: 800, category: "Arabic", image: "https://i.pinimg.com/736x/front-indo-arabic-1.jpg" },
  ],
  // Kamala
  [
    { name: "South Indian Temple Bridal",   description: "Intricate temple-pattern bridal mehandi featuring deity motifs, deepam and kolam-inspired designs.", price: 3000, category: "Bridal", image: "https://i.pinimg.com/736x/south-temple-bridal-1.jpg" },
    { name: "Traditional Tamil Half Hand", description: "Classic Tamil half-hand pattern for ceremonies like baby shower and puberty function.", price: 700, category: "Traditional", image: "https://i.pinimg.com/736x/tamil-halfhand-1.jpg" },
    { name: "Full Leg Bridal Design",      description: "Gorgeous full-leg mehandi from toes to knees with peacock and floral lace work.", price: 2200, category: "Feet", image: "https://i.pinimg.com/736x/fullleg-bridal-1.jpg" },
  ],
  // Renu
  [
    { name: "Minimalist Single Stroke Bridal", description: "Clean, modern single-stroke design for the minimalist bride who prefers subtle elegance.", price: 1500, category: "Minimalist", image: "https://i.pinimg.com/736x/minimalist-bridal-1.jpg" },
    { name: "Geometric Henna Art",          description: "Bold geometric patterns with clean lines, great for receptions and cocktail parties.", price: 900, category: "Modern", image: "https://i.pinimg.com/736x/geometric-henna-1.jpg" },
    { name: "Glitter Mehandi Reception",   description: "Gold glitter mehandi design layered over traditional patterns for a dazzling reception look.", price: 1100, category: "Glitter", image: "https://i.pinimg.com/736x/glitter-reception-1.jpg" },
  ],
  // Shalini (pending)
  [
    { name: "Arabic Front Hand Special",    description: "Attractive front-hand Arabic special for festivals and weddings at an affordable price.", price: 600, category: "Arabic", image: "https://i.pinimg.com/736x/arabic-front-1.jpg" },
    { name: "Party Mehandi Quick Set",     description: "Quick and beautiful party mehandi design done in 30 minutes. Perfect for large groups.", price: 400, category: "Party", image: "https://i.pinimg.com/736x/party-quick-1.jpg" },
    { name: "Bridal Hands Basic",          description: "Simple bridal hand design for the budget-conscious bride, neatly done with good colour.", price: 1200, category: "Bridal", image: "https://i.pinimg.com/736x/bridal-basic-1.jpg" },
  ],
  // Hemalatha (rejected)
  [
    { name: "Pakistani Dulhan Full Set",    description: "Complete dulhan package covering both hands and both feet with gulf Arabic influence.", price: 6000, category: "Pakistani", image: "https://i.pinimg.com/736x/dulhan-fullset-1.jpg" },
    { name: "Gulf Arabic Dense Pattern",   description: "Dense Gulf Arabic pattern with heavy floral clusters popular among Muslim brides.", price: 2000, category: "Arabic", image: "https://i.pinimg.com/736x/gulf-arabic-1.jpg" },
    { name: "Dulhan Feet & Ankles",        description: "Intricate feet and ankle mehandi with anklet patterns, perfectly matching the full dulhan look.", price: 1400, category: "Feet", image: "https://i.pinimg.com/736x/dulhan-feet-1.jpg" },
  ],
];

/* ------------------------------------------------------------------ */
/*  Booking scenarios: mix of statuses for a realistic dashboard       */
/* ------------------------------------------------------------------ */
//  We'll build these after inserting users so we can reference real IDs.

/* ================================================================== */
/*  MAIN SEED FUNCTION                                                  */
/* ================================================================== */
async function seed() {
  const uri = process.argv[2] || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment or arguments");
  }
  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB:", uri.includes("@") ? uri.split("@")[1] : uri);

  /* ----- wipe everything ----- */
  await Promise.all([
    User.deleteMany({}),
    ArtistProfile.deleteMany({}),
    Booking.deleteMany({}),
    Design.deleteMany({}),
    Message.deleteMany({}),
    SlotLock.deleteMany({}),
  ]);
  console.log("🗑️  Cleared all collections");

  /* ================================================================
     1. ADMIN
  ================================================================ */
  const admin = await User.create({
    name:     "Admin Mehandi",
    email:    process.env.ADMIN_EMAIL || "admin@mehandi.com",
    phone:    "9000000001",
    address:  "1, Admin HQ, T Nagar",
    city:     "Chennai",
    password: hash(process.env.ADMIN_PASSWORD || "Admin@123"),
    role:     "admin",
  });
  console.log(`👑 Admin created: ${admin.email}`);

  /* ================================================================
     2. CUSTOMERS
  ================================================================ */
  const customers = await User.insertMany(
    CUSTOMER_DATA.map((c) => ({
      ...c,
      password: hash("Customer@123"),
      role: "customer",
    }))
  );
  console.log(`👥 ${customers.length} customers created`);

  /* ================================================================
     3. ARTISTS  +  ARTIST PROFILES  +  DESIGNS
  ================================================================ */
  const artistUsers    = [];
  const artistProfiles = [];

  for (let i = 0; i < ARTIST_DATA.length; i++) {
    const a = ARTIST_DATA[i];
    const user = await User.create({
      name:     a.name,
      email:    a.email,
      phone:    a.phone,
      address:  a.address,
      city:     a.city,
      password: hash("Artist@123"),
      role:     "artist",
    });

    const profile = await ArtistProfile.create({
      user:               user._id,
      experience:         a.profile.experience,
      specialization:     a.profile.specialization,
      location:           a.profile.location,
      availableLocations: a.profile.availableLocations,
      availableTime:      a.profile.availableTime,
      services:           a.profile.services,
      bio:                a.profile.bio,
      pricePerHour:       a.profile.pricePerHour,
      rating:             a.profile.rating,
      totalReviews:       a.profile.totalReviews,
      status:             a.profile.status,
      profileImage:       `https://randomuser.me/api/portraits/women/${i + 10}.jpg`,
    });

    // 3 designs per artist
    const designs = DESIGN_POOL[i].map((d) => ({
      ...d,
      artist:      user._id,
      isAvailable: a.profile.status === "approved",
    }));
    await Design.insertMany(designs);

    artistUsers.push(user);
    artistProfiles.push(profile);
  }
  console.log(`🎨 ${artistUsers.length} artists + profiles + ${artistUsers.length * 3} designs created`);

  /* ================================================================
     4. BOOKINGS  –  rich realistic mix
  ================================================================ */
  /*
    We use only APPROVED artists (indices 0-5) for bookings.
    Status spread:
      completed  × 8   (past bookings, paid)
      confirmed  × 5   (future bookings, paid)
      accepted   × 4   (future bookings, awaiting payment)
      pending    × 7   (future bookings, awaiting artist response)
      info_needed× 2
      cancelled  × 2
      rejected   × 2
  */

  const approvedArtists   = artistUsers.slice(0, 6);
  const approvedProfiles  = artistProfiles.slice(0, 6);

  const BOOKING_SCENARIOS = [
    // --- COMPLETED (past, paid) ---
    { cIdx:0, aIdx:0, daysAgo:-30, sh:10, eh:14, service:"Bridal Full Hand",        venue:"12, Rose Garden Colony, Chennai",        notes:"Please bring natural henna cone",    status:"completed", paymentStatus:"paid",   amount:4800 },
    { cIdx:1, aIdx:2, daysAgo:-25, sh:9,  eh:12, service:"Rajasthani Bridal",       venue:"34, Velachery Main Road, Chennai",       notes:"Full set – both hands and feet",     status:"completed", paymentStatus:"paid",   amount:4500 },
    { cIdx:2, aIdx:4, daysAgo:-20, sh:11, eh:14, service:"South Indian Temple Bridal", venue:"7, Besant Nagar 3rd St, Chennai",     notes:"Traditional style only",             status:"completed", paymentStatus:"paid",   amount:2400 },
    { cIdx:3, aIdx:1, daysAgo:-18, sh:14, eh:17, service:"Indo-Arabic Fusion Bridal",  venue:"88, Adyar Flats, Chennai",             notes:"Bride prefers open space patterns",  status:"completed", paymentStatus:"paid",   amount:2700 },
    { cIdx:4, aIdx:0, daysAgo:-15, sh:9,  eh:11, service:"Arabic Pattern",          venue:"21, Anna Nagar West, Chennai",           notes:"Simple Arabic for reception",        status:"completed", paymentStatus:"paid",   amount:2400 },
    { cIdx:5, aIdx:3, daysAgo:-12, sh:16, eh:18, service:"Indo-Arabic Fusion",      venue:"5, Mylapore Tank St, Chennai",           notes:"Party mehandi for 2 people",         status:"completed", paymentStatus:"paid",   amount:1200 },
    { cIdx:6, aIdx:5, daysAgo:-10, sh:13, eh:15, service:"Minimalist Bridal",       venue:"9, T Nagar 2nd Lane, Chennai",           notes:"Minimal design, light colour ok",    status:"completed", paymentStatus:"paid",   amount:1400 },
    { cIdx:7, aIdx:2, daysAgo:-7,  sh:10, eh:13, service:"Full Sleeve Rajasthani",  venue:"3, Saidapet High Road, Chennai",         notes:"Intricate fine mesh required",       status:"completed", paymentStatus:"paid",   amount:4500 },

    // --- CONFIRMED (future, paid) ---
    { cIdx:8, aIdx:0, daysAgo:3,   sh:9,  eh:13, service:"Bridal Full Hand",        venue:"14, Tambaram West",                     notes:"Wedding on 7th Nov. Full set.",      status:"confirmed", paymentStatus:"paid",   amount:4800 },
    { cIdx:9, aIdx:2, daysAgo:5,   sh:10, eh:14, service:"Rajasthani Heritage Bridal", venue:"67, Sholinganallur, Chennai",         notes:"Jaal pattern preferred",             status:"confirmed", paymentStatus:"paid",   amount:6000 },
    { cIdx:10,aIdx:1, daysAgo:7,   sh:11, eh:13, service:"Pakistani Bridal Dulhan", venue:"11, Chromepet Street 4, Chennai",       notes:"Include groom's name in design",     status:"confirmed", paymentStatus:"paid",   amount:1800 },
    { cIdx:11,aIdx:4, daysAgo:10,  sh:9,  eh:11, service:"Traditional Tamil Bridal",venue:"2, Velachery Lake Road, Chennai",        notes:"South Indian temple style",          status:"confirmed", paymentStatus:"paid",   amount:1600 },
    { cIdx:12,aIdx:5, daysAgo:12,  sh:14, eh:16, service:"Glitter Mehandi Reception",venue:"88, Kodambakkam High Rd, Chennai",     notes:"Add gold glitter on top",            status:"confirmed", paymentStatus:"paid",   amount:1400 },

    // --- ACCEPTED (future, awaiting payment) ---
    { cIdx:13,aIdx:0, daysAgo:15,  sh:10, eh:12, service:"Feet Mehandi",            venue:"55, Perambur Barracks Rd, Chennai",     notes:"Lotus design preferred",             status:"accepted",  paymentStatus:"unpaid",  amount:2400 },
    { cIdx:14,aIdx:3, daysAgo:16,  sh:15, eh:17, service:"Simple Party Mehandi",    venue:"39, Nungambakkam High Rd, Chennai",     notes:"Quick party design for 3 ladies",    status:"accepted",  paymentStatus:"unpaid",  amount:1200 },
    { cIdx:0, aIdx:1, daysAgo:18,  sh:9,  eh:11, service:"Arabic Full Hand",        venue:"12, Rose Garden Colony, Chennai",        notes:"Open space modern style",            status:"accepted",  paymentStatus:"unpaid",  amount:1800 },
    { cIdx:1, aIdx:5, daysAgo:20,  sh:11, eh:13, service:"Geometric Henna Art",     venue:"34, Velachery Main Road, Chennai",      notes:"Bold geometric, no flowers",         status:"accepted",  paymentStatus:"unpaid",  amount:1400 },

    // --- PENDING (awaiting artist response) ---
    { cIdx:2, aIdx:0, daysAgo:22,  sh:9,  eh:13, service:"Bridal Full Hand",        venue:"7, Besant Nagar 3rd St, Chennai",       notes:"Full bridal set, please confirm ASAP", status:"pending", paymentStatus:"unpaid",  amount:4800 },
    { cIdx:3, aIdx:2, daysAgo:25,  sh:14, eh:16, service:"Rajasthani Bridal",       venue:"88, Adyar Flats, Chennai",              notes:"Peacock motif is a must",            status:"pending",  paymentStatus:"unpaid",  amount:3000 },
    { cIdx:4, aIdx:4, daysAgo:28,  sh:9,  eh:11, service:"Traditional Tamil Bridal",venue:"21, Anna Nagar West, Chennai",           notes:"Prefer morning slot",                status:"pending",  paymentStatus:"unpaid",  amount:1600 },
    { cIdx:5, aIdx:1, daysAgo:30,  sh:10, eh:12, service:"Indo-Arabic Fusion Bridal",venue:"5, Mylapore Tank St, Chennai",         notes:"",                                   status:"pending",  paymentStatus:"unpaid",  amount:2800 },
    { cIdx:6, aIdx:3, daysAgo:32,  sh:11, eh:13, service:"Indo-Arabic Fusion",      venue:"9, T Nagar 2nd Lane, Chennai",           notes:"Simple design",                      status:"pending",  paymentStatus:"unpaid",  amount:1200 },
    { cIdx:7, aIdx:5, daysAgo:35,  sh:15, eh:17, service:"Minimalist Bridal",       venue:"3, Saidapet High Road, Chennai",         notes:"No heavy patterns please",           status:"pending",  paymentStatus:"unpaid",  amount:1400 },
    { cIdx:8, aIdx:0, daysAgo:40,  sh:9,  eh:11, service:"Arabic Pattern",          venue:"14, Tambaram West",                     notes:"Sangeet function design",            status:"pending",  paymentStatus:"unpaid",  amount:2400 },

    // --- INFO_NEEDED ---
    { cIdx:9, aIdx:2, daysAgo:45,  sh:10, eh:14, service:"Rajasthani Heritage Bridal", venue:"67, Sholinganallur, Chennai",        notes:"",                                   status:"info_needed", paymentStatus:"unpaid", amount:6000 },
    { cIdx:10,aIdx:4, daysAgo:50,  sh:9,  eh:11, service:"Full Leg Bridal Design",  venue:"11, Chromepet Street 4, Chennai",       notes:"Please clarify pattern type",        status:"info_needed", paymentStatus:"unpaid", amount:4400 },

    // --- CANCELLED ---
    { cIdx:11,aIdx:1, daysAgo:55,  sh:14, eh:16, service:"Arabic Full Hand",        venue:"2, Velachery Lake Road, Chennai",       notes:"",                                   status:"cancelled", paymentStatus:"unpaid",  amount:1800 },
    { cIdx:12,aIdx:0, daysAgo:60,  sh:9,  eh:11, service:"Feet Mehandi",            venue:"88, Kodambakkam High Rd, Chennai",      notes:"",                                   status:"cancelled", paymentStatus:"unpaid",  amount:2400 },

    // --- REJECTED ---
    { cIdx:13,aIdx:3, daysAgo:65,  sh:11, eh:13, service:"Simple Party Mehandi",    venue:"55, Perambur Barracks Rd, Chennai",    notes:"",                                   status:"rejected",  paymentStatus:"unpaid",  amount:600  },
    { cIdx:14,aIdx:5, daysAgo:70,  sh:14, eh:16, service:"Geometric Henna Art",     venue:"39, Nungambakkam High Rd, Chennai",    notes:"",                                   status:"rejected",  paymentStatus:"unpaid",  amount:900  },
  ];

  /* ---- message template banks ---- */
  const customerMsgs = [
    "Hi! I am so excited about my booking. Please let me know if you need anything from my side.",
    "Could you please bring natural organic henna? I have a mild skin allergy.",
    "My wedding is at 7 PM. How early should we start the mehandi session?",
    "Can I see some recent bridal work samples before confirming?",
    "Please ensure fine-tip cone is used for the intricate portions.",
    "I will also need a simple design for my mother – is that possible in the same slot?",
  ];
  const artistMsgs = [
    "Thank you for booking! I will arrive 15 minutes early to set up. Please have good lighting available.",
    "I will bring my own organic henna paste – no chemicals. Rest assured.",
    "For a full bridal set it usually takes 3–4 hours. Please plan accordingly.",
    "I have noted your preference. The peacock motif will be the centrepiece of the design.",
    "Payment will be collected after the session is complete.",
    "I am happy to do a small design for your mother within the same slot at an extra ₹300.",
  ];
  const systemMsgs = [
    "Artist has accepted your booking. Please complete payment within 24 hours to confirm.",
    "Booking status changed to Confirmed. See you on the day!",
    "Artist has requested more information regarding your booking.",
    "Booking has been completed successfully. Thank you!",
    "Booking was cancelled. The slot has been released.",
    "Artist has rejected this booking. No charges apply.",
  ];

  const bookings = [];
  for (const sc of BOOKING_SCENARIOS) {
    const customer      = customers[sc.cIdx];
    const artistUser    = approvedArtists[sc.aIdx];
    const artistProfile = approvedProfiles[sc.aIdx];

    const dk      = dateKey(sc.daysAgo);
    const bDate   = bookingDate(sc.daysAgo);
    const hours   = sc.eh - sc.sh;
    const startHr = `${String(sc.sh).padStart(2,"0")}:00`;
    const endHr   = `${String(sc.eh).padStart(2,"0")}:00`;

    let paymentDueAt = null;
    let paidAt       = null;
    let paymentOrderId = "";
    let paymentId      = "";

    if (sc.paymentStatus === "paid") {
      paidAt         = new Date(bDate.getTime() - 86400000); // paid day before
      paymentOrderId = `order_${Math.random().toString(36).substr(2, 14).toUpperCase()}`;
      paymentId      = `pay_${Math.random().toString(36).substr(2, 14).toUpperCase()}`;
    }
    if (sc.status === "accepted") {
      paymentDueAt = new Date(Date.now() + 24 * 3600 * 1000);
    }

    const statusReason =
      sc.status === "rejected"   ? "Artist's schedule is fully booked for the requested date."  :
      sc.status === "cancelled"  ? "Customer requested cancellation due to change in plans."     :
      sc.status === "info_needed"? "Please share the preferred design style and colour depth."   : "";

    const booking = await Booking.create({
      customer:       customer._id,
      artist:         artistUser._id,
      artistProfile:  artistProfile._id,
      bookingDate:    bDate,
      dateKey:        dk,
      startTime:      startHr,
      endTime:        endHr,
      hours,
      service:        sc.service,
      venue:          sc.venue,
      notes:          sc.notes,
      amount:         sc.amount,
      status:         sc.status,
      statusReason,
      paymentStatus:  sc.paymentStatus,
      paymentOrderId,
      paymentId,
      paidAt,
      paymentDueAt,
    });
    bookings.push(booking);

    /* ---- SlotLocks for non-released statuses ---- */
    const lockStatuses = ["pending","info_needed","accepted","confirmed","completed"];
    if (lockStatuses.includes(sc.status)) {
      for (let h = sc.sh; h < sc.eh; h++) {
        try {
          await SlotLock.create({
            artist:  artistUser._id,
            dateKey: dk,
            hour:    h,
            booking: booking._id,
          });
        } catch (_) {
          // duplicate slot – skip silently
        }
      }
    }

    /* ---- Chat messages ---- */
    const msgDocs = [];
    // system status message
    if (["accepted","confirmed","completed","info_needed","cancelled","rejected"].includes(sc.status)) {
      const sysText =
        sc.status === "accepted"    ? systemMsgs[0] :
        sc.status === "confirmed"   ? systemMsgs[1] :
        sc.status === "info_needed" ? systemMsgs[2] :
        sc.status === "completed"   ? systemMsgs[3] :
        sc.status === "cancelled"   ? systemMsgs[4] : systemMsgs[5];
      msgDocs.push({ booking: booking._id, sender: artistUser._id, text: sysText,                     type: "system" });
    }
    // customer message
    msgDocs.push({ booking: booking._id, sender: customer._id,   text: pick(customerMsgs), type: "user" });
    // artist reply (if not purely pending)
    if (sc.status !== "pending") {
      msgDocs.push({ booking: booking._id, sender: artistUser._id, text: pick(artistMsgs), type: "user" });
    }
    // extra back-and-forth for completed/confirmed
    if (["completed","confirmed"].includes(sc.status)) {
      msgDocs.push({ booking: booking._id, sender: customer._id,   text: pick(customerMsgs), type: "user" });
      msgDocs.push({ booking: booking._id, sender: artistUser._id, text: pick(artistMsgs),   type: "user" });
    }
    await Message.insertMany(msgDocs);
  }

  console.log(`📅 ${bookings.length} bookings created`);

  /* ---- summary ---- */
  const counts = {
    completed:   BOOKING_SCENARIOS.filter(s=>s.status==="completed").length,
    confirmed:   BOOKING_SCENARIOS.filter(s=>s.status==="confirmed").length,
    accepted:    BOOKING_SCENARIOS.filter(s=>s.status==="accepted").length,
    pending:     BOOKING_SCENARIOS.filter(s=>s.status==="pending").length,
    info_needed: BOOKING_SCENARIOS.filter(s=>s.status==="info_needed").length,
    cancelled:   BOOKING_SCENARIOS.filter(s=>s.status==="cancelled").length,
    rejected:    BOOKING_SCENARIOS.filter(s=>s.status==="rejected").length,
  };

  const totalRevenue = BOOKING_SCENARIOS
    .filter(s => s.paymentStatus === "paid")
    .reduce((sum,s) => sum + s.amount, 0);

  console.log("\n📊 Dashboard summary (expected values):");
  console.log(`   Total Customers       : ${customers.length}`);
  console.log(`   Approved Artists      : ${ARTIST_DATA.filter(a=>a.profile.status==="approved").length}`);
  console.log(`   Pending Applications  : ${ARTIST_DATA.filter(a=>a.profile.status==="pending").length}`);
  console.log(`   Rejected Applications : ${ARTIST_DATA.filter(a=>a.profile.status==="rejected").length}`);
  console.log(`   Total Bookings        : ${bookings.length}`);
  console.log(`   Completed Bookings    : ${counts.completed}`);
  console.log(`   Confirmed Bookings    : ${counts.confirmed}`);
  console.log(`   Accepted Bookings     : ${counts.accepted}`);
  console.log(`   Pending Bookings      : ${counts.pending}`);
  console.log(`   Info-Needed           : ${counts.info_needed}`);
  console.log(`   Cancelled             : ${counts.cancelled}`);
  console.log(`   Rejected              : ${counts.rejected}`);
  console.log(`   Paid Bookings         : ${BOOKING_SCENARIOS.filter(s=>s.paymentStatus==="paid").length}`);
  console.log(`   Total Revenue (₹)     : ₹${totalRevenue.toLocaleString("en-IN")}`);

  console.log("\n🔑 Login credentials:");
  console.log(`   Admin    → ${process.env.ADMIN_EMAIL || "admin@mehandi.com"}  /  ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
  console.log("   Customer → priya.sharma@gmail.com   /  Customer@123");
  console.log("   Artist   → deepa.mehandi@gmail.com  /  Artist@123");

  await mongoose.disconnect();
  console.log("\n✅ Seed complete! Disconnected.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});

