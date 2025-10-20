import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedContest() {
  try {
    // Create sample contest
    const contest = await prisma.contest.create({
      data: {
        title: "💥 PUMP BY NUMBERS AND DEMO CENTER CONTEST",
        subtitle: "Show Your Strength, Win Amazing Prizes!",
        description: "Join our exciting fitness contest and compete with athletes worldwide. Upload your best exercise setups and demo center videos to win incredible prizes!",
        content: `
          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-blue-600">🏆 Welcome to the Ultimate Fitness Challenge!</h2>
            
            <p class="text-lg">
              Are you ready to showcase your fitness skills and compete with the best? Our <strong>Pump by Numbers and Demo Center Contest</strong> is here to challenge athletes of all levels!
            </p>
            
            <h3 class="text-xl font-semibold text-green-600">🎯 What is Pump by Numbers?</h3>
            <p>
              Pump by Numbers is our revolutionary color-coded system that helps you track and optimize your workout intensity. Each color represents different resistance levels:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li><span class="font-semibold text-yellow-600">Yellow</span> - Light resistance, perfect for warm-up</li>
              <li><span class="font-semibold text-green-600">Green</span> - Moderate resistance for endurance</li>
              <li><span class="font-semibold text-blue-600">Blue</span> - Medium-high resistance for strength</li>
              <li><span class="font-semibold text-red-600">Red</span> - High resistance for power</li>
              <li><span class="font-semibold text-purple-600">Purple</span> - Maximum resistance for elite athletes</li>
              <li><span class="font-semibold text-orange-600">Orange</span> - Variable resistance for dynamic training</li>
            </ul>
            
            <h3 class="text-xl font-semibold text-blue-600">🏋️ How to Participate</h3>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Create your exercise setup using our Pump by Numbers system</li>
              <li>Record a high-quality video of your workout</li>
              <li>Upload your video with detailed setup information</li>
              <li>Include your isolator hole settings and color combinations</li>
              <li>Share your demo center experience (if applicable)</li>
            </ol>
            
            <h3 class="text-xl font-semibold text-purple-600">🌟 Demo Center Challenge</h3>
            <p>
              If you're a demo center owner or have access to one, showcase your facility! Upload videos of:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Your complete equipment setup</li>
              <li>Training sessions in action</li>
              <li>Before and after transformations</li>
              <li>Community workout events</li>
            </ul>
            
            <div class="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg">
              <h3 class="text-xl font-semibold text-indigo-600 mb-3">🚀 Ready to Get Started?</h3>
              <p class="mb-4">
                Don't wait! Start uploading your exercise setups and demo center content today. Every submission counts towards your chance to win amazing prizes!
              </p>
              <p class="text-sm text-gray-600">
                <strong>Pro Tip:</strong> The more detailed your setup information and the higher quality your video, the better your chances of winning!
              </p>
            </div>
          </div>
        `,
        rules: `
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-red-600">📋 Contest Rules & Guidelines</h2>
            
            <h3 class="text-lg font-semibold">🎯 Eligibility</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>Open to all registered users aged 18 and above</li>
              <li>Must have a verified account on our platform</li>
              <li>Professional athletes and fitness instructors welcome</li>
              <li>Demo center owners can participate in both categories</li>
            </ul>
            
            <h3 class="text-lg font-semibold">📹 Video Requirements</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>Minimum resolution: 1080p HD</li>
              <li>Duration: 30 seconds to 5 minutes</li>
              <li>Clear audio (if commentary included)</li>
              <li>Good lighting and stable camera work</li>
              <li>Must show complete exercise setup and execution</li>
            </ul>
            
            <h3 class="text-lg font-semibold">🏋️ Exercise Setup Requirements</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>Must include isolator hole settings</li>
              <li>Specify all color combinations used</li>
              <li>Include body parts targeted</li>
              <li>List equipment used</li>
              <li>Provide difficulty level and height settings</li>
            </ul>
            
            <h3 class="text-lg font-semibold">🏢 Demo Center Requirements</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>Must be a registered demo center</li>
              <li>Show complete facility overview</li>
              <li>Include equipment inventory</li>
              <li>Demonstrate safety protocols</li>
              <li>Showcase community engagement</li>
            </ul>
            
            <h3 class="text-lg font-semibold">⚖️ Judging Criteria</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li><strong>Technical Excellence (30%)</strong> - Proper form and technique</li>
              <li><strong>Creativity (25%)</strong> - Innovative use of equipment and colors</li>
              <li><strong>Video Quality (20%)</strong> - Production value and clarity</li>
              <li><strong>Educational Value (15%)</strong> - How well it teaches others</li>
              <li><strong>Community Impact (10%)</strong> - Engagement and inspiration</li>
            </ul>
            
            <h3 class="text-lg font-semibold">🚫 Prohibited Content</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>Unsafe or dangerous exercises</li>
              <li>Inappropriate clothing or behavior</li>
              <li>Copyrighted music without permission</li>
              <li>False or misleading information</li>
              <li>Content promoting other brands/competitors</li>
            </ul>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p class="text-sm">
                <strong>Important:</strong> All submissions will be reviewed for compliance. 
                Non-compliant entries will be disqualified. Decisions by the judging panel are final.
              </p>
            </div>
          </div>
        `,
        prizes: `
          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-green-600">🏆 Amazing Prizes Await!</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-300">
                <h3 class="text-xl font-bold text-yellow-800 mb-3">🥇 GRAND PRIZE</h3>
                <ul class="space-y-2 text-yellow-700">
                  <li>• Complete Home Gym Setup ($5,000 value)</li>
                  <li>• 1-Year Premium Membership</li>
                  <li>• Personal Training Sessions (10 sessions)</li>
                  <li>• Exclusive Champion Trophy</li>
                  <li>• Feature in our Success Stories</li>
                </ul>
              </div>
              
              <div class="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg border-2 border-gray-300">
                <h3 class="text-xl font-bold text-gray-800 mb-3">🥈 SECOND PLACE</h3>
                <ul class="space-y-2 text-gray-700">
                  <li>• Premium Equipment Package ($2,500 value)</li>
                  <li>• 6-Month Premium Membership</li>
                  <li>• Personal Training Sessions (5 sessions)</li>
                  <li>• Silver Medal & Certificate</li>
                  <li>• Social Media Feature</li>
                </ul>
              </div>
              
              <div class="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-lg border-2 border-orange-300">
                <h3 class="text-xl font-bold text-orange-800 mb-3">🥉 THIRD PLACE</h3>
                <ul class="space-y-2 text-orange-700">
                  <li>• Starter Equipment Kit ($1,000 value)</li>
                  <li>• 3-Month Premium Membership</li>
                  <li>• Personal Training Sessions (3 sessions)</li>
                  <li>• Bronze Medal & Certificate</li>
                  <li>• Platform Recognition</li>
                </ul>
              </div>
              
              <div class="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-300">
                <h3 class="text-xl font-bold text-blue-800 mb-3">🏢 BEST DEMO CENTER</h3>
                <ul class="space-y-2 text-blue-700">
                  <li>• Equipment Upgrade Package ($3,000 value)</li>
                  <li>• Marketing Support & Promotion</li>
                  <li>• Featured Demo Center Status</li>
                  <li>• Special Recognition Plaque</li>
                  <li>• Priority Customer Referrals</li>
                </ul>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
              <h3 class="text-xl font-bold text-purple-800 mb-3">🌟 SPECIAL CATEGORY PRIZES</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 class="font-semibold text-purple-700">Most Creative Setup</h4>
                  <p class="text-sm text-purple-600">$500 Equipment Voucher + Recognition</p>
                </div>
                <div>
                  <h4 class="font-semibold text-purple-700">Best Beginner Video</h4>
                  <p class="text-sm text-purple-600">$300 Starter Kit + 1-Month Membership</p>
                </div>
                <div>
                  <h4 class="font-semibold text-purple-700">Community Favorite</h4>
                  <p class="text-sm text-purple-600">$400 Gear Package + Social Media Feature</p>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 border-l-4 border-green-400 p-4">
              <h3 class="text-lg font-semibold text-green-800 mb-2">🎁 Participation Rewards</h3>
              <p class="text-green-700">
                Every qualified submission receives a <strong>10% discount code</strong> for our equipment store 
                and a <strong>digital certificate of participation</strong>. Plus, all participants get entered 
                into our monthly equipment giveaway!
              </p>
            </div>
            
            <div class="text-center bg-indigo-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold text-indigo-800 mb-2">Total Prize Pool: $15,000+</h3>
              <p class="text-indigo-600">
                Don't miss your chance to win big! Start creating your contest entry today.
              </p>
            </div>
          </div>
        `,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        bannerImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
    });

    console.log("✅ Sample contest created successfully:", contest.title);
    return contest;
  } catch (error) {
    console.error("❌ Error creating sample contest:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedContest();
    console.log("🎉 Contest seeding completed successfully!");
  } catch (error) {
    console.error("💥 Contest seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedContest };
