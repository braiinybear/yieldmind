import { PrismaClient, CourseType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@yieldmind.com',
      password: hashedPassword,
      phone: '+91-9876543210',
      role: 'ADMIN',
    },
  });

  const teacher = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh@yieldmind.com',
      password: hashedPassword,
      phone: '+91-9876543211',
      role: 'TEACHER',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: hashedPassword,
      phone: '+91-9876543212',
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Amit Verma',
      email: 'amit@example.com',
      password: hashedPassword,
      phone: '+91-9876543213',
      role: 'STUDENT',
    },
  });

  console.log(`✅ Created 4 users`);

  // Create Courses
  console.log('📚 Creating courses...');

  const graphicDesignCourse = await prisma.course.create({
    data: {
      title: 'Professional Graphic Design Masterclass',
      slug: 'graphic-design-masterclass',
      description: 'Master Adobe Photoshop, Illustrator, and InDesign. Learn typography, color theory, and brand identity design from industry professionals.',
      thumbnail: '/images/courses/graphic-design.jpg',
      price: 15000,
      type: CourseType.OFFLINE,
      venue: 'YieldMind Institute, Dehradun',
      startDate: new Date('2026-02-01'),
      batchSize: 25,
      duration: '6 months',
    },
  });

  const webDevCourse = await prisma.course.create({
    data: {
      title: 'Full-Stack Web Development with Next.js',
      slug: 'fullstack-web-development',
      description: 'Build modern web applications with Next.js, React, TypeScript, and PostgreSQL. Learn deployment, authentication, and best practices.',
      thumbnail: '/images/courses/web-dev.jpg',
      price: 20000,
      type: CourseType.HYBRID,
      venue: 'YieldMind Institute, Dehradun + Online',
      startDate: new Date('2026-02-15'),
      batchSize: 30,
      duration: '8 months',
    },
  });

  const videoEditingCourse = await prisma.course.create({
    data: {
      title: 'Video Editing & Motion Graphics',
      slug: 'video-editing-motion-graphics',
      description: 'Master Adobe Premiere Pro and After Effects. Create stunning videos, motion graphics, and visual effects for social media and film.',
      thumbnail: '/images/courses/video-editing.jpg',
      price: 12000,
      type: CourseType.OFFLINE,
      venue: 'YieldMind Institute, Dehradun',
      startDate: new Date('2026-03-01'),
      batchSize: 20,
      duration: '5 months',
    },
  });

  const aiCourse = await prisma.course.create({
    data: {
      title: 'Artificial Insemination (A.I.)',
      slug: 'artificial-insemination',
      description: `**Course Overview**
Artificial insemination is a scientific breeding technique in which high-quality semen is collected, preserved, and carefully introduced into a female animal to achieve pregnancy. It helps improve livestock quality and ensures disease-free breeding.

**Eligibility:** 10th Pass
**Certification:** The Dept. Of Animal Husbandry & Fisheries, Ministry of Agriculture & Farmer Welfare.

**Career Prospects:**
Completing this certified course can open prospects of earning up to ₹20k-25k per month. A certified A.I. worker can work in the field or assist in a Veterinarian's hospital.`,
      price: 40000,
      duration: '3 Months',
      type: CourseType.HYBRID,
      venue: 'BraiinyBear Center (Practicals) / Online (Theory)',
      startDate: new Date('2026-02-10'),
      batchSize: 15,
    },
  });

  console.log(`✅ Created 4 courses`);

  // Create Course Modules & Lessons for Graphic Design
  console.log('📖 Creating modules and lessons...');

  const gdModule1 = await prisma.courseModule.create({
    data: {
      title: 'Introduction to Design Fundamentals',
      order: 1,
      courseId: graphicDesignCourse.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'What is Graphic Design?',
        description: 'Understanding the role of graphic design in modern communication',
        moduleId: gdModule1.id,
        videoUrl: 'https://example.com/videos/gd-intro.mp4',
        isFree: true,
        order: 1,
      },
      {
        title: 'Design Principles: Balance, Contrast, Hierarchy',
        description: 'Core principles that make designs effective',
        moduleId: gdModule1.id,
        videoUrl: 'https://example.com/videos/gd-principles.mp4',
        isFree: true,
        order: 2,
      },
      {
        title: 'Color Theory Basics',
        description: 'Understanding color psychology and combinations',
        moduleId: gdModule1.id,
        videoUrl: 'https://example.com/videos/gd-color.mp4',
        isFree: false,
        order: 3,
      },
    ],
  });

  const gdModule2 = await prisma.courseModule.create({
    data: {
      title: 'Adobe Photoshop Mastery',
      order: 2,
      courseId: graphicDesignCourse.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Photoshop Interface & Tools',
        description: 'Getting started with Photoshop workspace',
        moduleId: gdModule2.id,
        videoUrl: 'https://example.com/videos/ps-interface.mp4',
        isFree: false,
        order: 1,
      },
      {
        title: 'Photo Manipulation Techniques',
        description: 'Advanced photo editing and compositing',
        moduleId: gdModule2.id,
        videoUrl: 'https://example.com/videos/ps-manipulation.mp4',
        isFree: false,
        order: 2,
      },
    ],
  });

  // Create Course Modules & Lessons for Web Development
  const webModule1 = await prisma.courseModule.create({
    data: {
      title: 'HTML, CSS & JavaScript Fundamentals',
      order: 1,
      courseId: webDevCourse.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'HTML5 Semantic Elements',
        description: 'Building structured, accessible web pages',
        moduleId: webModule1.id,
        videoUrl: 'https://example.com/videos/html5.mp4',
        isFree: true,
        order: 1,
      },
      {
        title: 'CSS Grid & Flexbox',
        description: 'Modern layout techniques for responsive design',
        moduleId: webModule1.id,
        videoUrl: 'https://example.com/videos/css-layout.mp4',
        isFree: true,
        order: 2,
      },
      {
        title: 'JavaScript ES6+ Features',
        description: 'Arrow functions, destructuring, async/await',
        moduleId: webModule1.id,
        videoUrl: 'https://example.com/videos/js-es6.mp4',
        isFree: false,
        order: 3,
      },
    ],
  });

  const webModule2 = await prisma.courseModule.create({
    data: {
      title: 'React & Next.js Development',
      order: 2,
      courseId: webDevCourse.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'React Components & Props',
        description: 'Building reusable UI components',
        moduleId: webModule2.id,
        videoUrl: 'https://example.com/videos/react-components.mp4',
        isFree: false,
        order: 1,
      },
      {
        title: 'Next.js App Router & Server Components',
        description: 'Modern Next.js architecture',
        moduleId: webModule2.id,
        videoUrl: 'https://example.com/videos/nextjs-app-router.mp4',
        isFree: false,
        order: 2,
      },
    ],
  });

  // Create modules for A.I. Course
  const aiModule1 = await prisma.courseModule.create({
    data: {
      title: 'Phase 1: Theory (2 Months)',
      order: 1,
      courseId: aiCourse.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Introduction to Artificial Insemination',
        order: 1,
        moduleId: aiModule1.id,
        isFree: true,
      },
      {
        title: 'Livestock Anatomy & Physiology',
        order: 2,
        moduleId: aiModule1.id,
      },
      {
        title: 'Semen Collection & Preservation',
        order: 3,
        moduleId: aiModule1.id,
      },
      {
        title: 'Disease Control & Breeding Hygiene',
        order: 4,
        moduleId: aiModule1.id,
      },
    ],
  });

  const aiModule2 = await prisma.courseModule.create({
    data: {
      title: 'Phase 2: Practical Training (1 Month)',
      order: 2,
      courseId: aiCourse.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'On-field Insemination Techniques',
        order: 1,
        moduleId: aiModule2.id,
      },
      {
        title: 'Handling Livestock Equipment',
        order: 2,
        moduleId: aiModule2.id,
      },
      {
        title: 'Pregnancy Diagnosis',
        order: 3,
        moduleId: aiModule2.id,
      },
      {
        title: 'Final Assessment & Certification',
        order: 4,
        moduleId: aiModule2.id,
      },
    ],
  });

  console.log(`✅ Created modules and lessons`);

  // Create Enrollments
  console.log('🎓 Creating enrollments...');

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: graphicDesignCourse.id,
      status: 'ACTIVE',
      amountPaid: 15000,
      razorpayOrderId: 'order_test_001',
      razorpayPaymentId: 'pay_test_001',
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      courseId: webDevCourse.id,
      status: 'ACTIVE',
      amountPaid: 20000,
      razorpayOrderId: 'order_test_002',
      razorpayPaymentId: 'pay_test_002',
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: videoEditingCourse.id,
      status: 'PENDING',
      amountPaid: 0,
    },
  });

  console.log(`✅ Created 3 enrollments`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 4 (1 Admin, 1 Teacher, 2 Students)`);
  console.log(`   - Courses: 4`);
  console.log(`   - Modules: 6`);
  console.log(`   - Lessons: 19`);
  console.log(`   - Enrollments: 3`);
  console.log('\n🔑 Test Credentials:');
  console.log(`   - Email: priya@example.com`);
  console.log(`   - Password: password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
