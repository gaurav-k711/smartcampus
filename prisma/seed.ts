import { PrismaClient, Role, ResourceStatus, BookingStatus, DemandLevel, NotificationType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing tables (order matters due to foreign keys)
  await prisma.notification.deleteMany();
  await prisma.demandPrediction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.resourceCategory.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing database records.");

  // 1. Create Users
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Campus Administrator",
      email: "admin@smartcampus.local",
      passwordHash,
      role: Role.ADMIN,
      department: "Administration",
    },
  });

  const faculty = await prisma.user.create({
    data: {
      name: "Dr. Evelyn Reed",
      email: "faculty@smartcampus.local",
      passwordHash,
      role: Role.FACULTY,
      department: "Computer Science",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "Alex Johnson",
      email: "student1@smartcampus.local",
      passwordHash,
      role: Role.STUDENT,
      department: "Computer Science",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Maya Patel",
      email: "student2@smartcampus.local",
      passwordHash,
      role: Role.STUDENT,
      department: "Electrical Engineering",
    },
  });

  console.log("👥 Seeded 4 Users (Admin, Faculty, Student1, Student2)");

  // 2. Create Categories
  const catLab = await prisma.resourceCategory.create({
    data: { name: "Computer Lab", description: "High-spec workstations with development environments" },
  });

  const catSeminar = await prisma.resourceCategory.create({
    data: { name: "Seminar Hall", description: "Large presentation halls with AV equipment & stage" },
  });

  const catClassroom = await prisma.resourceCategory.create({
    data: { name: "Classroom", description: "Equipped lecture halls and tutorial spaces" },
  });

  const catEquipment = await prisma.resourceCategory.create({
    data: { name: "AV Equipment", description: "Portable projectors, 4K cameras, and PA systems" },
  });

  const catSports = await prisma.resourceCategory.create({
    data: { name: "Sports Facility", description: "Badminton courts, gym spaces, and sports kits" },
  });

  const catMeeting = await prisma.resourceCategory.create({
    data: { name: "Meeting Room", description: "Conference rooms with video conferencing facilities" },
  });

  console.log("🏷️ Seeded 6 Resource Categories");

  // 3. Create Resources
  const lab1 = await prisma.resource.create({
    data: {
      name: "Computer Lab 1 (AI & Graphics)",
      categoryId: catLab.id,
      description: "Equipped with 45 RTX-enabled workstations, Dual Monitors, and high-speed internet.",
      location: "Science Block B, Room 201",
      capacity: 45,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: false,
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    },
  });

  const lab2 = await prisma.resource.create({
    data: {
      name: "Computer Lab 2 (Software Engineering)",
      categoryId: catLab.id,
      description: "General computing lab with 40 Linux/Windows dual-boot systems.",
      location: "Science Block B, Room 202",
      capacity: 40,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: false,
      imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    },
  });

  const lab3 = await prisma.resource.create({
    data: {
      name: "Computer Lab 3 (Cybersecurity Lab)",
      categoryId: catLab.id,
      description: "Isolated networked lab for network simulation, security, and cryptography practicals.",
      location: "Science Block B, Room 203",
      capacity: 35,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: false,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    },
  });

  const seminar1 = await prisma.resource.create({
    data: {
      name: "Main Auditorium Seminar Hall 1",
      categoryId: catSeminar.id,
      description: "Tiered auditorium seating with Dolby Surround, twin laser projectors, and podium mic.",
      location: "Main Auditorium Wing, Room 101",
      capacity: 150,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: true,
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    },
  });

  const seminar2 = await prisma.resource.create({
    data: {
      name: "Academic Block Seminar Hall 2",
      categoryId: catSeminar.id,
      description: "Modern acoustic hall suitable for guest lectures, symposiums, and thesis defenses.",
      location: "Academic Block C, Room 301",
      capacity: 120,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: true,
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    },
  });

  const class1 = await prisma.resource.create({
    data: {
      name: "Lecture Hall A101",
      categoryId: catClassroom.id,
      description: "Smart classroom with interactive digital board, speaker system, and ergonomic desks.",
      location: "Academic Block A, 1st Floor",
      capacity: 60,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: false,
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    },
  });

  const class2 = await prisma.resource.create({
    data: {
      name: "Lecture Hall A102",
      categoryId: catClassroom.id,
      description: "Spacious lecture hall with dual whiteboards and high-lumen ceiling projector.",
      location: "Academic Block A, 1st Floor",
      capacity: 60,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: false,
      imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    },
  });

  const proj1 = await prisma.resource.create({
    data: {
      name: "4K Laser Projector Kit 1",
      categoryId: catEquipment.id,
      description: "Ultra-bright 5000 lumens projector with HDMI wireless transmitter and tripod screen.",
      location: "AV Equipment Center, Desk A",
      capacity: 1,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: false,
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    },
  });

  const sports1 = await prisma.resource.create({
    data: {
      name: "Indoor Badminton Court & Kit",
      categoryId: catSports.id,
      description: "Synthetic court with tournament nets, racquets, and Yonex shuttlecocks.",
      location: "Sports Complex, Hall 2",
      capacity: 8,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: false,
      imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    },
  });

  const meeting1 = await prisma.resource.create({
    data: {
      name: "Executive Boardroom 1",
      categoryId: catMeeting.id,
      description: "Executive conference room with Polycom video conferencing bar and 75-inch display.",
      location: "Administration Block, 4th Floor",
      capacity: 16,
      status: ResourceStatus.AVAILABLE,
      requiresApproval: true,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    },
  });

  console.log("🏫 Seeded 10 Campus Resources");

  // Helper date function for generating realistic historical & future dates
  const getTodayISO = (offsetDays: number = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  // 4. Create Historical and Upcoming Bookings for Real Analytics and Predictions
  // Notice: High demand slots created deliberately on Lab 1 at 10:00-12:00 to train demand prediction!
  const bookingData = [
    // Past bookings for analytics
    {
      userId: student1.id,
      resourceId: lab1.id,
      date: getTodayISO(-6),
      startTime: "10:00",
      endTime: "12:00",
      purpose: "Machine Learning Model Training Workshop",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: faculty.id,
      resourceId: lab1.id,
      date: getTodayISO(-5),
      startTime: "10:00",
      endTime: "12:00",
      purpose: "CS301 Distributed Systems Practical",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: student2.id,
      resourceId: lab1.id,
      date: getTodayISO(-4),
      startTime: "10:00",
      endTime: "12:00",
      purpose: "Deep Learning Hackathon preparation",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: student1.id,
      resourceId: lab1.id,
      date: getTodayISO(-3),
      startTime: "10:00",
      endTime: "12:00",
      purpose: "Computer Vision Project Sprint",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: faculty.id,
      resourceId: lab1.id,
      date: getTodayISO(-2),
      startTime: "10:00",
      endTime: "12:00",
      purpose: "AI Capstone Project Evaluation",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: student2.id,
      resourceId: lab1.id,
      date: getTodayISO(-1),
      startTime: "14:00",
      endTime: "16:00",
      purpose: "Robotics Club Programming Session",
      status: BookingStatus.COMPLETED,
    },
    // Lab 2 moderate demand
    {
      userId: student1.id,
      resourceId: lab2.id,
      date: getTodayISO(-4),
      startTime: "14:00",
      endTime: "16:00",
      purpose: "Full Stack Web Dev Laboratory",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: faculty.id,
      resourceId: lab2.id,
      date: getTodayISO(-2),
      startTime: "11:00",
      endTime: "13:00",
      purpose: "Database Systems Query Tuning Lab",
      status: BookingStatus.COMPLETED,
    },
    // Seminar Hall bookings
    {
      userId: faculty.id,
      resourceId: seminar1.id,
      date: getTodayISO(-5),
      startTime: "09:00",
      endTime: "12:00",
      purpose: "Annual Tech Symposium Keynote",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: faculty.id,
      resourceId: seminar2.id,
      date: getTodayISO(-3),
      startTime: "14:00",
      endTime: "17:00",
      purpose: "Faculty Academic Senate Meet",
      status: BookingStatus.COMPLETED,
    },
    // Classrooms
    {
      userId: faculty.id,
      resourceId: class1.id,
      date: getTodayISO(-2),
      startTime: "09:00",
      endTime: "11:00",
      purpose: "Discrete Mathematics Tutorial",
      status: BookingStatus.COMPLETED,
    },
    {
      userId: faculty.id,
      resourceId: class2.id,
      date: getTodayISO(-1),
      startTime: "11:00",
      endTime: "13:00",
      purpose: "Signals and Systems Mid-term Review",
      status: BookingStatus.COMPLETED,
    },
    // Sports facility
    {
      userId: student1.id,
      resourceId: sports1.id,
      date: getTodayISO(-1),
      startTime: "17:00",
      endTime: "19:00",
      purpose: "Inter-college Tournament Practice",
      status: BookingStatus.COMPLETED,
    },

    // TODAY'S BOOKINGS
    {
      userId: student1.id,
      resourceId: lab1.id,
      date: getTodayISO(0),
      startTime: "10:00",
      endTime: "12:00",
      purpose: "Thesis Benchmarking & GPU Run",
      status: BookingStatus.APPROVED,
    },
    {
      userId: faculty.id,
      resourceId: class1.id,
      date: getTodayISO(0),
      startTime: "13:00",
      endTime: "15:00",
      purpose: "Guest Lecture on Cloud Infrastructure",
      status: BookingStatus.APPROVED,
    },

    // UPCOMING BOOKINGS (Next days)
    {
      userId: student2.id,
      resourceId: lab2.id,
      date: getTodayISO(1),
      startTime: "10:00",
      endTime: "12:00",
      purpose: "Competitive Programming Contest Practice",
      status: BookingStatus.APPROVED,
    },
    {
      userId: faculty.id,
      resourceId: seminar1.id,
      date: getTodayISO(2),
      startTime: "10:00",
      endTime: "13:00",
      purpose: "International Research Symposium 2026",
      status: BookingStatus.PENDING, // Pending approval for admin demo!
    },
    {
      userId: student1.id,
      resourceId: meeting1.id,
      date: getTodayISO(3),
      startTime: "15:00",
      endTime: "17:00",
      purpose: "Student Council Executive Strategy Meet",
      status: BookingStatus.PENDING, // Pending approval for admin demo!
    },
  ];

  for (const b of bookingData) {
    await prisma.booking.create({ data: b });
  }

  console.log(`📅 Seeded ${bookingData.length} Bookings (Historical, Today, and Upcoming)`);

  // 5. Create Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        title: "Booking Confirmed",
        message: `Your booking for Computer Lab 1 on ${getTodayISO(0)} (10:00 - 12:00) has been approved.`,
        type: NotificationType.SUCCESS,
        read: false,
      },
      {
        userId: student1.id,
        title: "High Demand Notice",
        message: "Computer Lab 1 is experiencing peak demand slots this week.",
        type: NotificationType.INFO,
        read: true,
      },
      {
        userId: faculty.id,
        title: "Approval Pending",
        message: "Your reservation request for Seminar Hall 1 requires Administrator sign-off.",
        type: NotificationType.WARNING,
        read: false,
      },
      {
        userId: admin.id,
        title: "New Approval Required",
        message: `Dr. Evelyn Reed requested Main Auditorium Seminar Hall 1 for ${getTodayISO(2)}.`,
        type: NotificationType.ALERT,
        read: false,
      },
    ],
  });

  console.log("🔔 Seeded initial User & Admin Notifications");

  // 6. Pre-calculate Seed Demand Predictions for Demo Speed
  await prisma.demandPrediction.createMany({
    data: [
      {
        resourceId: lab1.id,
        date: getTodayISO(0),
        timeSlot: "10:00-12:00",
        demandScore: 88,
        demandLevel: DemandLevel.HIGH,
        confidence: 92,
      },
      {
        resourceId: lab2.id,
        date: getTodayISO(0),
        timeSlot: "10:00-12:00",
        demandScore: 48,
        demandLevel: DemandLevel.MEDIUM,
        confidence: 85,
      },
      {
        resourceId: lab3.id,
        date: getTodayISO(0),
        timeSlot: "10:00-12:00",
        demandScore: 18,
        demandLevel: DemandLevel.LOW,
        confidence: 80,
      },
      {
        resourceId: seminar1.id,
        date: getTodayISO(0),
        timeSlot: "10:00-12:00",
        demandScore: 78,
        demandLevel: DemandLevel.HIGH,
        confidence: 87,
      },
    ],
  });

  console.log("📈 Seeded Initial Demand Predictions");
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
