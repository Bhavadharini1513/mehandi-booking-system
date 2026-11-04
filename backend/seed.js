const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const {
  User,
  ArtistProfile,
  DesignCatalog,
  Booking,
  SlotLock,
  Message,
} = require("./models");

const seedDatabase = async () => {
  try {
    console.log("==================================================");
    console.log("  MARUTHANI WORLD — PRODUCTION DATABASE SEEDER    ");
    console.log("==================================================");

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from environment variables!");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.\n");

    // 1. CLEAR EXISTING COLLECTIONS
    console.log("Purging existing data collections...");
    await Promise.all([
      User.deleteMany({}),
      ArtistProfile.deleteMany({}),
      DesignCatalog.deleteMany({}),
      Booking.deleteMany({}),
      SlotLock.deleteMany({}),
      Message.deleteMany({}),
    ]);
    console.log("Existing data cleared successfully.\n");

    // 2. PASSWORDS
    const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
    const userPasswordHash = await bcrypt.hash("Password@123", 10);

    // 3. SEED ADMIN USER
    console.log("Creating System Administrator...");
    const adminUser = await User.create({
      name: "Jeeva Admin",
      email: "admin@mehandi.com",
      password: adminPasswordHash,
      role: "admin",
      phone: "+91 9876543210",
      city: "Chennai",
      address: "Administrative Suite, Anna Nagar",
      isVerified: true,
    });
    console.log(`Created Admin: ${adminUser.name} (${adminUser.email})`);

    // 4. SEED APPROVED ARTISTS
    console.log("\nCreating Approved Master Artists & Profiles...");
    const priyaUser = await User.create({
      name: "Priya Sundaram",
      email: "priya.bridal@mehandi.com",
      password: userPasswordHash,
      role: "artist",
      phone: "+91 9444123456",
      city: "Chennai",
      address: "12 Cathedral Road, Gopalapuram",
      isVerified: true,
    });

    const priyaProfile = await ArtistProfile.create({
      userId: priyaUser._id, user: priyaUser._id,
      bio: "Specialized in Royal Marwari & Grand Bridal Henna with intricate figures and storytelling motifs.",
      experienceYears: 6,
      serviceRadiusKm: 15,
      location: {
        city: "Chennai",
        address: "Gopalapuram, Chennai",
        pincode: "600086",
      },
      payoutUpiId: "priya.mehandi@okicici",
      approvalStatus: "approved", status: "approved",
      specialization: "Royal Marwari & Grand Bridal",
      services: ["Bridal Mehndi", "Royal Marwari", "Figure Henna", "Sangeet Event"],
      pricePerHour: 800,
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      rating: 5,
      totalReviews: 48,
    });

    const ananyaUser = await User.create({
      name: "Ananya Sharma",
      email: "ananya.henna@mehandi.com",
      password: userPasswordHash,
      role: "artist",
      phone: "+91 9884011223",
      city: "Chennai",
      address: "45 Besant Avenue, Adyar",
      isVerified: true,
    });

    const ananyaProfile = await ArtistProfile.create({
      userId: ananyaUser._id, user: ananyaUser._id,
      bio: "Expert in contemporary Arabic, Minimalist Wrist & Indo-Western fusion patterns with rapid execution.",
      experienceYears: 4,
      serviceRadiusKm: 12,
      location: {
        city: "Chennai",
        address: "Adyar, Chennai",
        pincode: "600020",
      },
      payoutUpiId: "ananya.henna@upi",
      approvalStatus: "approved", status: "approved",
      specialization: "Contemporary Arabic & Minimalist",
      services: ["Arabic Design", "Indo-Western Fusion", "Minimalist Wrist", "Party Henna"],
      pricePerHour: 600,
      profileImage:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      totalReviews: 34,
    });

    const kavithaUser = await User.create({
      name: "Kavitha Rajan",
      email: "kavitha.arts@mehandi.com",
      password: userPasswordHash,
      role: "artist",
      phone: "+91 9176098765",
      city: "Chennai",
      address: "88 T. Nagar Main Road",
      isVerified: true,
    });

    const kavithaProfile = await ArtistProfile.create({
      userId: kavithaUser._id, user: kavithaUser._id,
      bio: "Master artist for grand wedding events, sangeet parties, and bespoke custom portrait designs.",
      experienceYears: 8,
      serviceRadiusKm: 25,
      location: {
        city: "Chennai",
        address: "T. Nagar, Chennai",
        pincode: "600017",
      },
      payoutUpiId: "kavitha.mehandi@ybl",
      approvalStatus: "approved", status: "approved",
      specialization: "Grand Wedding & Custom Portraits",
      services: ["Bridal Mehndi", "Custom Portrait Henna", "Sangeet Event", "Traditional Mehndi"],
      pricePerHour: 1000,
      profileImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      rating: 5,
      totalReviews: 62,
    });

    console.log("Created 3 Approved Artists (Priya, Ananya, Kavitha).");

    // 5. SEED PENDING ARTIST APPLICANTS
    console.log("\nCreating Pending Artist Applications...");
    const meeraUser = await User.create({
      name: "Meera Patel",
      email: "meera.designs@gmail.com",
      password: userPasswordHash,
      role: "artist",
      phone: "+91 9842109876",
      city: "Coimbatore",
      address: "14 R.S. Puram West",
      isVerified: true,
    });

    await ArtistProfile.create({
      userId: meeraUser._id, user: meeraUser._id,
      bio: "Traditional Gujarati and Rajasthani intricate bridal designs using 100% natural herbal henna paste.",
      experienceYears: 3,
      serviceRadiusKm: 15,
      location: {
        city: "Coimbatore",
        address: "R.S. Puram, Coimbatore",
        pincode: "641002",
      },
      payoutUpiId: "meera@okaxis",
      approvalStatus: "pending", status: "pending",
      specialization: "Gujarati & Rajasthani Bridal",
      services: ["Bridal Mehndi", "Gujarati Henna", "Traditional Mehndi"],
      pricePerHour: 500,
    });

    const rituUser = await User.create({
      name: "Ritu Verma",
      email: "ritu.henna.art@gmail.com",
      password: userPasswordHash,
      role: "artist",
      phone: "+91 9443210987",
      city: "Madurai",
      address: "28 K.K. Nagar East",
      isVerified: true,
    });

    await ArtistProfile.create({
      userId: rituUser._id, user: rituUser._id,
      bio: "Specializing in fast festive mehndi, modern botanical patterns, and group sangeet arrangements.",
      experienceYears: 2,
      serviceRadiusKm: 10,
      location: {
        city: "Madurai",
        address: "K.K. Nagar, Madurai",
        pincode: "625020",
      },
      payoutUpiId: "ritu.verma@upi",
      approvalStatus: "pending", status: "pending",
      specialization: "Festive & Party Henna",
      services: ["Festive Mehndi", "Party Henna", "Arabic Design"],
      pricePerHour: 450,
    });

    console.log("Created 2 Pending Artist Applications (Meera, Ritu).");

    // 6. SEED CUSTOMERS
    console.log("\nCreating Customer Accounts...");
    const customers = await User.create([
      {
        name: "Sneha Reddy",
        email: "sneha@gmail.com",
        password: userPasswordHash,
        role: "customer",
        phone: "+91 9840198401",
        city: "Chennai",
        address: "Flat 4B, Nungambakkam High Road, Chennai",
        isVerified: true,
      },
      {
        name: "Deepika Nair",
        email: "deepika@gmail.com",
        password: userPasswordHash,
        role: "customer",
        phone: "+91 9790197901",
        city: "Chennai",
        address: "18 Gandhi Road, Velachery, Chennai",
        isVerified: true,
      },
      {
        name: "Aarthi Ramachandran",
        email: "aarthi@gmail.com",
        password: userPasswordHash,
        role: "customer",
        phone: "+91 9884198841",
        city: "Coimbatore",
        address: "7 Avinashi Road, Peelamedu, Coimbatore",
        isVerified: true,
      },
      {
        name: "Pooja Hegde",
        email: "pooja@gmail.com",
        password: userPasswordHash,
        role: "customer",
        phone: "+91 9940199401",
        city: "Madurai",
        address: "23 Palace Road, Simmakkal, Madurai",
        isVerified: true,
      },
    ]);
    console.log(`Created ${customers.length} Client Accounts (Sneha, Deepika, Aarthi, Pooja).`);

    // 7. SEED DESIGN CATALOG
    console.log("\nSeeding High-Resolution Mehandi Design Catalog...");
    const designs = await DesignCatalog.create([
      {
        artistId: priyaUser._id,
        title: "Royal Dulhan Full Bridal Set",
        description: "Elaborate traditional royal wedding henna featuring Radha-Krishna portrait motifs, elephant processions, and intricate kalash patterns.",
        category: "Bridal",
        price: 6500,
        durationMinutes: 240,
        images: [
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
      {
        artistId: ananyaUser._id,
        title: "Exquisite Arabic Palm & Cuff",
        description: "Free-flowing shaded floral trail extending from palm to wrist with modern negative space accents.",
        category: "Arabic",
        price: 1800,
        durationMinutes: 90,
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
      {
        artistId: ananyaUser._id,
        title: "Minimalist Floral Wrist Band",
        description: "Delicate botanical bracelet bracelet design ideal for modern bridesmaid festivities or intimate ceremonies.",
        category: "Minimal",
        price: 800,
        durationMinutes: 45,
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
      {
        artistId: kavithaUser._id,
        title: "Festive Sangeet Party Special",
        description: "Vibrant and symmetric celebration patterns designed for both front and back hands with jaal work.",
        category: "Party",
        price: 2200,
        durationMinutes: 120,
        images: [
          "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
      {
        artistId: priyaUser._id,
        title: "Traditional Peacock & Motif Full Arm",
        description: "Majestic peacock figures, classic paisleys, and fine netting detailing reaching the mid-forearm.",
        category: "Bridal",
        price: 4500,
        durationMinutes: 180,
        images: [
          "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
      {
        artistId: ananyaUser._id,
        title: "Modern Geometry & Mandala Combination",
        description: "Contemporary concentric sacred mandala centerpiece framed with razor-sharp geometric lace cuffs.",
        category: "Custom",
        price: 2800,
        durationMinutes: 110,
        images: [
          "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
      {
        artistId: priyaUser._id,
        title: "Intricate Lotus Bloom Palms",
        description: "Classic South Indian lotus blossoms centered in bold dark shading with delicate finger creepers.",
        category: "Minimal",
        price: 1200,
        durationMinutes: 60,
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
      {
        artistId: kavithaUser._id,
        title: "Bespoke Royal Portrait Wedding Package",
        description: "Custom hand-drawn bride and groom portraits embedded in royal jharokha architectural arches.",
        category: "Bridal",
        price: 8500,
        durationMinutes: 300,
        images: [
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
        ],
        isActive: true,
      },
    ]);
    console.log(`Created ${designs.length} Haute Couture Mehandi Designs.`);

    // 8. SEED REALISTIC BOOKINGS
    console.log("\nSeeding Platform Bookings & Transaction Records...");

    const today = new Date();
    const formatDateKey = (d) => d.toISOString().slice(0, 10);

    const pastDate1 = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    const pastDate2 = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
    const futureDate1 = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    const futureDate2 = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);
    const futureDate3 = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const bookingsToCreate = [
      // 1. Completed & Paid (₹6,500)
      {
        customer: customers[0]._id, // Sneha
        artist: priyaUser._id,
        artistProfile: priyaProfile._id,
        design: designs[0]._id,
        bookingDate: pastDate1,
        dateKey: formatDateKey(pastDate1),
        startTime: "10:00",
        endTime: "14:00",
        hours: 4,
        service: "Bridal Mehndi",
        serviceType: "home",
        timeSlot: "10:00 - 14:00",
        address: {
          street: customers[0].address,
          city: customers[0].city,
          pincode: "600034",
          landmark: "Near Taj Coromandel",
        },
        venue: customers[0].address,
        amount: 6500,
        status: "completed",
        bookingStatus: "completed",
        paymentStatus: "paid",
        paymentDetails: {
          utrNumber: "430291827364",
          receiptUrl: "https://razorpay.com/receipts/rec_9421",
          verifiedAt: pastDate1,
          verifiedBy: adminUser._id,
        },
        paidAt: pastDate1,
        paymentId: "pay_live_430291827364",
        completionOtp: "4829",
      },

      // 2. Completed & Paid (₹1,800)
      {
        customer: customers[1]._id, // Deepika
        artist: ananyaUser._id,
        artistProfile: ananyaProfile._id,
        design: designs[1]._id,
        bookingDate: pastDate2,
        dateKey: formatDateKey(pastDate2),
        startTime: "14:00",
        endTime: "16:00",
        hours: 2,
        service: "Arabic Design",
        serviceType: "home",
        timeSlot: "14:00 - 16:00",
        address: {
          street: customers[1].address,
          city: customers[1].city,
          pincode: "600042",
          landmark: "Opposite Grand Mall",
        },
        venue: customers[1].address,
        amount: 1800,
        status: "completed",
        bookingStatus: "completed",
        paymentStatus: "paid",
        paymentDetails: {
          utrNumber: "430291827365",
          receiptUrl: "https://razorpay.com/receipts/rec_9422",
          verifiedAt: pastDate2,
          verifiedBy: adminUser._id,
        },
        paidAt: pastDate2,
        paymentId: "pay_live_430291827365",
        completionOtp: "8194",
      },

      // 3. Confirmed & Verification Pending (₹4,500)
      {
        customer: customers[2]._id, // Aarthi
        artist: priyaUser._id,
        artistProfile: priyaProfile._id,
        design: designs[4]._id,
        bookingDate: futureDate1,
        dateKey: formatDateKey(futureDate1),
        startTime: "11:00",
        endTime: "14:00",
        hours: 3,
        service: "Bridal Mehndi",
        serviceType: "home",
        timeSlot: "11:00 - 14:00",
        address: {
          street: customers[2].address,
          city: customers[2].city,
          pincode: "641004",
          landmark: "Near PSG Tech",
        },
        venue: customers[2].address,
        amount: 4500,
        status: "confirmed",
        bookingStatus: "confirmed",
        paymentStatus: "verification_pending",
        paymentDetails: {
          utrNumber: "430291827399",
          receiptUrl: "https://maruthani.com/receipts/pending_399.jpg",
        },
        completionOtp: "3291",
      },

      // 4. Confirmed & Verification Pending (₹2,800)
      {
        customer: customers[3]._id, // Pooja
        artist: ananyaUser._id,
        artistProfile: ananyaProfile._id,
        design: designs[5]._id,
        bookingDate: futureDate2,
        dateKey: formatDateKey(futureDate2),
        startTime: "16:00",
        endTime: "18:00",
        hours: 2,
        service: "Custom Mehndi",
        serviceType: "home",
        timeSlot: "16:00 - 18:00",
        address: {
          street: customers[3].address,
          city: customers[3].city,
          pincode: "625001",
          landmark: "Near Meenakshi Temple",
        },
        venue: customers[3].address,
        amount: 2800,
        status: "confirmed",
        bookingStatus: "confirmed",
        paymentStatus: "verification_pending",
        paymentDetails: {
          utrNumber: "430291827400",
          receiptUrl: "https://maruthani.com/receipts/pending_400.jpg",
        },
        completionOtp: "7721",
      },

      // 5. Requested / Pending (₹8,500)
      {
        customer: customers[0]._id, // Sneha
        artist: kavithaUser._id,
        artistProfile: kavithaProfile._id,
        design: designs[7]._id,
        bookingDate: futureDate3,
        dateKey: formatDateKey(futureDate3),
        startTime: "09:00",
        endTime: "14:00",
        hours: 5,
        service: "Bridal Mehndi",
        serviceType: "home",
        timeSlot: "09:00 - 14:00",
        address: {
          street: customers[0].address,
          city: customers[0].city,
          pincode: "600034",
          landmark: "Near Taj Coromandel",
        },
        venue: customers[0].address,
        amount: 8500,
        status: "pending",
        bookingStatus: "requested",
        paymentStatus: "unpaid",
        completionOtp: "9042",
      },

      // 6. Requested / Pending (₹1,200)
      {
        customer: customers[1]._id, // Deepika
        artist: priyaUser._id,
        artistProfile: priyaProfile._id,
        design: designs[6]._id,
        bookingDate: futureDate3,
        dateKey: formatDateKey(futureDate3),
        startTime: "15:00",
        endTime: "16:00",
        hours: 1,
        service: "Minimal Mehndi",
        serviceType: "home",
        timeSlot: "15:00 - 16:00",
        address: {
          street: customers[1].address,
          city: customers[1].city,
          pincode: "600042",
          landmark: "Opposite Grand Mall",
        },
        venue: customers[1].address,
        amount: 1200,
        status: "pending",
        bookingStatus: "requested",
        paymentStatus: "unpaid",
        completionOtp: "5510",
      },

      // 7. Cancelled & Refunded (₹2,200)
      {
        customer: customers[3]._id, // Pooja
        artist: kavithaUser._id,
        artistProfile: kavithaProfile._id,
        design: designs[3]._id,
        bookingDate: pastDate1,
        dateKey: formatDateKey(pastDate1),
        startTime: "17:00",
        endTime: "19:00",
        hours: 2,
        service: "Party Henna",
        serviceType: "home",
        timeSlot: "17:00 - 19:00",
        address: {
          street: customers[3].address,
          city: customers[3].city,
          pincode: "625001",
          landmark: "Near Meenakshi Temple",
        },
        venue: customers[3].address,
        amount: 2200,
        status: "cancelled",
        bookingStatus: "cancelled",
        statusReason: "Client rescheduled wedding family dates",
        paymentStatus: "refunded",
        paymentDetails: {
          utrNumber: "430291827301",
          receiptUrl: "https://razorpay.com/refunds/rfnd_101",
        },
        completionOtp: "1198",
      },
    ];

    const seededBookings = await Booking.create(bookingsToCreate);

    // Seed SlotLocks for confirmed & pending bookings so availability checking locks these hours
    const locksToInsert = [];
    for (const b of seededBookings) {
      if (["confirmed", "pending", "accepted"].includes(b.status)) {
        const startHour = parseInt(b.startTime.split(":")[0], 10);
        const endHour = parseInt(b.endTime.split(":")[0], 10);
        for (let h = startHour; h < endHour; h++) {
          locksToInsert.push({
            artist: b.artist,
            dateKey: b.dateKey,
            hour: h,
            booking: b._id,
          });
        }
      }
    }

    if (locksToInsert.length > 0) {
      await SlotLock.insertMany(locksToInsert);
      console.log(`Initialized ${locksToInsert.length} calendar slot locks for active bookings.`);
    }

    console.log(`Created ${seededBookings.length} Realistic Bookings across all operational statuses.`);

    console.log("\n==================================================");
    console.log("       DATABASE SEEDING COMPLETED SUCCESSFULLY!   ");
    console.log("==================================================");
    console.log("Summary of Seeded Data:");
    console.log(`- Administrators      : 1 (${adminUser.email})`);
    console.log("- Approved Artists    : 3 (Priya, Ananya, Kavitha)");
    console.log("- Pending Applicants  : 2 (Meera, Ritu)");
    console.log(`- Clientele Accounts  : ${customers.length}`);
    console.log(`- Design Catalog      : ${designs.length} Haute Couture designs`);
    console.log(`- Bookings / Orders   : ${seededBookings.length} bookings`);
    console.log("  * Completed & Paid  : 2 (₹6,500 + ₹1,800)");
    console.log("  * Verification Req. : 2 (₹4,500 + ₹2,800)");
    console.log("  * Requested/Pending : 2 (₹8,500 + ₹1,200)");
    console.log("  * Cancelled/Refunded: 1 (₹2,200)");
    console.log("--------------------------------------------------");
    console.log("Default Login Credentials:");
    console.log("  Admin   : admin@mehandi.com / Admin@123");
    console.log("  Artist  : priya.bridal@mehandi.com / Password@123");
    console.log("  Client  : sneha@gmail.com / Password@123");
    console.log("==================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ SEEDING FAILED WITH ERROR:");
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();

