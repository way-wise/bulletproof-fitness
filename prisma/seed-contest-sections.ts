import prisma from "../lib/prisma";

async function seedContest() {
  console.log("🌱 Seeding contest with sections...");

  // First, clean up existing data
  await prisma.contestCard.deleteMany();
  await prisma.contestSection.deleteMany();
  await prisma.contest.deleteMany();

  // Create the main contest
  const contest = await prisma.contest.create({
    data: {
      isActive: true,
      startDate: new Date("2024-12-01T00:00:00Z"),
      endDate: new Date("2025-02-28T23:59:59Z"),
    },
  });

  console.log("✅ Created contest:", contest.id);

  // Define all sections with your original content
  const sections = [
    {
      sectionType: "hero",
      title: "💥 PUMP BY NUMBERS AND DEMO CENTER CONTEST",
      subtitle: "Build the Library. Grow the Network. Win Big.",
      description: `<p>Welcome to the Pump by Numbers Contest — where our community comes together to teach, connect, and inspire through real-world setups and authentic Bulletproof experiences.</p>
      <p>Whether you're uploading a killer new exercise setup or hosting a demo center in your city — your contribution moves the entire Bulletproof community forward.</p>`,
      ctaText: "🚀 Join the Contest — Become a Demo Center or Upload a Video",
      ctaUrl: "/exercise-setup",
      order: 1,
    },
    {
      sectionType: "main",
      title: "💥 PUMP BY NUMBERS & DEMO CENTER CONTEST",
      subtitle: "Be the Face of Bulletproof in Your City. Teach. Connect. Win.",
      description: `<p>This is more than a contest — it's a movement.</p>
      <p>We're searching for the most passionate, most creative, and most connected members of the Bulletproof community to step up, stand out, and shape the future of fitness.</p>`,
      order: 2,
    },
    {
      sectionType: "demo_center",
      title: "🏠 Become a Demo Center Host.",
      description: `<p>Be the reason someone falls in love with Bulletproof. When you open your doors — whether it's a home gym, studio, or training space — you become a hub for your city's athletes to test real Bulletproof gear, learn how it feels, and connect with others who live and breathe this lifestyle.</p>`,
      order: 3,
    },
    {
      sectionType: "pump_numbers",
      title: "🎥 Upload to Pump by Numbers.",
      description: `<p>Show the world how you move. Film your setups, perfect your form, and share creative ways to use Bulletproof equipment. Every approved video helps others unlock new possibilities — and earns you serious points toward incredible prizes.</p>
      <p>Together, Demo Centers and Pump by Numbers form the heartbeat of the Bulletproof community: a hands-on, user-driven ecosystem where fitness meets innovation, and real people lead the charge.</p>`,
      order: 4,
    },
    {
      sectionType: "mission",
      title: "🔥 Your mission:",
      description: `<ul>
        <li>Inspire others by showcasing your setups and knowledge</li>
        <li>Help local lifters experience Bulletproof equipment in person</li>
        <li>Grow your following, earn rewards, and compete for massive prizes</li>
      </ul>
      <p>Because the future of fitness isn't happening in corporate showrooms — it's happening in your garage, your gym, and your videos.</p>`,
      order: 5,
    },
    {
      sectionType: "why_matters",
      title: "🧠 WHY THIS CONTEST MATTERS",
      description: `<p>We've built something no other fitness brand has: A community-powered movement that combines real-world gear access and real-user education.</p>
      <ul>
        <li>🎥 Pump by Numbers helps people learn what's possible.</li>
        <li>🏠 Demo Centers help people experience it in person.</li>
      </ul>
      <p>Together, they create the ultimate ecosystem for mastering Bulletproof equipment — powered by you.</p>`,
      order: 6,
    },
    {
      sectionType: "getting_started",
      title: "🚀 GETTING STARTED IS EASY",
      description: `<p>All you need to do is create your Bulletproof account — that's it!</p>
      <p>Once you're in, you'll unlock access to upload your Pump by Numbers videos, register as a Demo Center, track your points, and climb the leaderboard. No long forms, no complicated setup — just sign up, start sharing, and join the movement.</p>
      <p>Every video you post and every demo you host brings you one step closer to the top of the leaderboard — and to some seriously epic prizes.</p>`,
      ctaText: "🔥 Create Your Account to Get Started",
      ctaUrl: "/auth/sign-up",
      order: 7,
    },
    {
      sectionType: "your_mission",
      title: "🏁 YOUR MISSION",
      description: `<h3>1️⃣ Upload Setup Videos to Pump by Numbers</h3>
      <p>Show the world how you use your Bulletproof gear. Each approved upload expands our library, helping others discover new exercises and perfect their form.</p>
      
      <h4>🎥 Requirements for Approval:</h4>
      <ul>
        <li>Clear, accurate form</li>
        <li>Proper setup and demonstration</li>
        <li>Good lighting and camera angle</li>
        <li>Educational or creative contribution</li>
      </ul>
      <p>✅ Approved videos earn points, visibility, and prizes.</p>

      <h3>2️⃣ Become a Bulletproof Demo Center</h3>
      <p>Host. Connect. Inspire.</p>
      <p>By registering as a Demo Center, you make it possible for people in your area to:</p>
      <ul>
        <li>💪 Test Bulletproof equipment in real gyms and home setups</li>
        <li>🤝 Meet other fitness enthusiasts and training partners</li>
        <li>💸 Earn affiliate rewards when visitors buy — no sales or inventory required</li>
      </ul>
      <p>Demo Centers aren't showrooms — they're community hubs. You're not just hosting — you're helping people find their next favorite piece of gear and possibly their next training partner.</p>`,
      ctaText: "🔗 Become a Demo Center",
      ctaUrl: "/upload-demo-center",
      order: 8,
    },
    {
      sectionType: "prizes",
      title: "🏆 THE PRIZES",
      subtitle: "We're rewarding accuracy, authenticity, and creativity. The more you contribute — the more chances you have to win.",
      description: `<div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
          🏆 Amazing Prizes Await!
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Total Prize Pool: $15,000+
        </p>
      </div>`,
      order: 9,
    },
    {
      sectionType: "how_to_win",
      title: "📈 HOW TO WIN",
      description: `<h3>Step 1 → Upload Videos</h3>
      <p>Each approved Pump by Numbers video = points. The better your content (form, creativity, clarity), the higher your score.</p>
      
      <h3>Step 2 → Engage</h3>
      <p>Like and rate videos, support others — earn engagement points.</p>
      
      <h3>Step 3 → Connect Locally</h3>
      <p>Register to be a Demo Center to unlock 100 points for community impact.</p>
      
      <p><strong>🔥 Pro Tip:</strong> Upload consistently — each approved upload earns points and leaderboard boosts.</p>`,
      order: 10,
    },
    {
      sectionType: "fair_transparent",
      title: "🔍 FAIR. FUN. TRANSPARENT.",
      description: `<p>We keep everything clear and competitive — in the best way.</p>
      <ul>
        <li><strong>Leaderboard:</strong> Shows top users points.</li>
        <li><strong>Dashboard:</strong> Track your videos and points in one place.</li>
        <li><strong>Public Winners:</strong> Announced via email and social with highlight reels.</li>
      </ul>`,
      order: 11,
    },
    {
      sectionType: "why_join",
      title: "💬 WHY YOU SHOULD JOIN",
      description: `<p>This isn't about going viral — it's about building something lasting.</p>
      <p>Every video uploaded and every demo hosted helps:</p>
      <ul>
        <li>A new customer find the perfect setup</li>
        <li>A lifter discover a movement they didn't know existed</li>
        <li>A future friend train just a few miles away</li>
      </ul>
      <p>You're not just entering a contest — you're building the foundation of the Bulletproof Network.</p>`,
      order: 12,
    },
    {
      sectionType: "timeline",
      title: "📅 TIMELINE",
      description: `<table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">Phase</th>
            <th class="border border-gray-300 px-4 py-2">Duration</th>
            <th class="border border-gray-300 px-4 py-2">What Happens</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 px-4 py-2">Pre-Launch</td>
            <td class="border border-gray-300 px-4 py-2">1 week</td>
            <td class="border border-gray-300 px-4 py-2">Teasers, early bird entries</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-2">Live Contest</td>
            <td class="border border-gray-300 px-4 py-2">4–6 weeks</td>
            <td class="border border-gray-300 px-4 py-2">Uploads, demo hosting, points rolling</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-2">Winners Announced</td>
            <td class="border border-gray-300 px-4 py-2">-</td>
            <td class="border border-gray-300 px-4 py-2">Public reveal + celebration</td>
          </tr>
        </tbody>
      </table>`,
      order: 13,
    },
    {
      sectionType: "ready_to_join",
      title: "⚡ READY TO JOIN THE MOVEMENT?",
      description: `<p>Whether you're behind the camera filming setups or opening your doors as a demo host — this is your moment to help shape the future of Bulletproof.</p>
      <p><strong>Join the movement. Inspire others. And maybe win a new gym while you're at it.</strong></p>`,
      ctaText: "🔥 Join the Contest — Upload a Video or Become a Demo Center",
      ctaUrl: "/exercise-setup",
      order: 14,
    },
  ];

  // Create all sections
  for (const sectionData of sections) {
    const section = await prisma.contestSection.create({
      data: {
        contestId: contest.id,
        ...sectionData,
      },
    });

    console.log(`✅ Created section: ${sectionData.sectionType}`);

    // Create prize cards for the prizes section
    if (sectionData.sectionType === "prizes") {
      const prizeCards = [
        {
          title: "🏆 1st Place: $5,000+ Home Gym Makeover",
          description: `<p><strong>Choose any Bulletproof gear up to $5K retail</strong></p>
          <p>Transform your entire training space with the best equipment in the industry.</p>`,
          backgroundColor: "#FFD700", // Gold
          order: 1,
          cardType: "grand",
        },
        {
          title: "🥈 2nd Place: VTS Bundle + Feather Barbell",
          description: `<p><strong>$2,000+ value</strong></p>
          <p>Get the complete VTS system plus our revolutionary Feather Barbell for the ultimate training experience.</p>`,
          backgroundColor: "#C0C0C0", // Silver
          order: 2,
          cardType: "second",
        },
        {
          title: "🥉 3rd Place: Full Isolator + Attachments Setup",
          description: `<p><strong>$1,200+ value</strong></p>
          <p>Master isolation training with our complete Isolator system and all essential attachments.</p>`,
          backgroundColor: "#CD7F32", // Bronze
          order: 3,
          cardType: "third",
        },
        {
          title: "🎁 Monthly Rewards",
          description: `<p><strong>Top-rated video of the month: $150 store credit</strong></p>
          <p>Consistent excellence gets rewarded every single month.</p>`,
          backgroundColor: "#4F46E5", // Indigo
          order: 4,
          cardType: "monthly",
        },
        {
          title: "🎖️ Upload 5+ Approved Videos",
          description: `<p><strong>$20 store credit</strong></p>
          <p>Show your commitment to the community and get rewarded for your contributions.</p>`,
          backgroundColor: "#059669", // Green
          order: 5,
          cardType: "participant",
        },
        {
          title: "🏢 Register as Demo Center",
          description: `<p><strong>100 points</strong></p>
          <p>Open your doors to the community and earn instant points toward the leaderboard.</p>`,
          backgroundColor: "#0891B2", // Cyan
          order: 6,
          cardType: "participant",
        },
      ];

      for (const cardData of prizeCards) {
        await prisma.contestCard.create({
          data: {
            sectionId: section.id,
            ...cardData,
          },
        });
      }

      console.log(`✅ Created ${prizeCards.length} prize cards`);
    }
  }

  console.log("🎉 Contest seeding completed successfully!");
}

// Run the seed function
seedContest()
  .catch((e) => {
    console.error("❌ Error seeding contest:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
