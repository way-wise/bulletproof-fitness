"use client";

import { Button } from "@/components/ui/button";
import { CircleArrowRight, Dumbbell, Home, MessageCircle, DollarSign, Users, Search, MapPin, Calendar, Star, TrendingUp, Heart, Zap, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DemoCentersPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-100">

        <div className="container relative mx-auto max-w-7xl px-4 py-20 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Main Headline */}
              <span className="inline-block mb-6 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-700 text-white">
                Bulletproof Demo Centers
              </span>

              {/* headline */}
              <h1 className="mb-8 text-xl font-semibold text-foreground/80 md:text-3xl">
                Try <span className="inline-block">Bulletproof Equipment</span> in Your City.
                <br />
                <span>No Showroom Required.</span>
              </h1>

              {/* Description */}
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0">
                Visit or host a demo center to test our gear in real gyms and home setups —
                <span className="font-semibold text-foreground"> no pressure, no sales pitch.</span>
              </p>

              {/* Key Benefits List */}
              <div className="mb-8 space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Try real Bulletproof setups near you</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Get honest feedback from real users</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Earn money hosting demos at your location</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-start">
                <Link href="/demo-centers-list">
                  <Button size="lg" className="group relative w-full overflow-hidden bg-primary px-8 py-4 text-lg font-semibold transition-all hover:bg-primary/90 hover:scale-105 sm:w-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <Search className="relative mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="relative">Find a Demo Center</span>
                  </Button>
                </Link>
                <Link href="/demo-center-form">
                  <Button size="lg" variant="outline" className="group w-full border-2 px-8 py-4 text-lg font-semibold transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 sm:w-auto">
                    <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Become a Host
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/assets/demo-center-1.jpg"
                  alt="Bulletproof Demo Center - Real gym setup"
                  width={600}
                  height={400}
                  className="h-[400px] w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 rounded-lg bg-card p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-xs text-muted-foreground">Demo Centers</div>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 rounded-lg bg-card p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-xs text-muted-foreground">Authentic</div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="h-12 w-full fill-muted/20 md:h-20">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Try It. Feel It. Know It's Right Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Try It. Feel It. Know It's Right.
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Before dropping thousands on a home gym, wouldn't it be great to actually try the equipment?
            </p>
            <p>
              At Bulletproof Fitness Equipment, we heard the calls (literally) from across the country — people ready to fly in just to get their hands on our gear. Why? Because what we make is different.
            </p>
            <p className="font-semibold text-foreground">
              Not just a little different — game-changing, category-defining, no-comparison different.
            </p>
            <p>
              So we created something just as unique to match.
            </p>
          </div>
        </div>
      </section>

      {/* The "Uber" of Gym Demos Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            🚘 THE "UBER" OF GYM DEMOS IS HERE
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Introducing Bulletproof Demo Centers — a first-of-its-kind way to experience our equipment in person, without a showroom, warehouse, or waitlist.
            </p>
            <p>
              Whether you're just curious or gearing up to make a serious investment in your gym, this is your try-before-you-buy, real-world test drive — right in your city.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              💡 HOW IT WORKS
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Simple, straightforward process for both visitors and hosts
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Want to try - Left Side */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="mb-6 text-2xl font-bold">Want to try our equipment?</h3>
              </div>

              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Find a Demo Center</h4>
                  <p className="text-muted-foreground">Search by location, equipment type, or facility style to find the perfect demo center near you.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Schedule Your Visit</h4>
                  <p className="text-muted-foreground">Book a convenient time slot and connect directly with the host to plan your demo session.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Experience Bulletproof</h4>
                  <p className="text-muted-foreground">Try the equipment, ask questions, and get honest feedback from real users in a no-pressure environment.</p>
                </div>
              </div>

              {/* Equipment Image */}
              <div className="relative mt-8 overflow-hidden rounded-xl">
                <Image
                  src="/assets/lever-arm-pbn-1-1.webp"
                  alt="Bulletproof equipment in action"
                  width={400}
                  height={250}
                  className="h-[250px] w-full object-cover"
                />
              </div>
            </div>

            {/* Want to be a demo center - Right Side */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="mb-6 text-2xl font-bold">Want to be a demo center?</h3>
              </div>

              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Register Your Space</h4>
                  <p className="text-muted-foreground">Submit your gym details, location, and available Bulletproof equipment through our simple application.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Set Your Availability</h4>
                  <p className="text-muted-foreground">Choose when you're available for demos and set your preferences for visitor scheduling.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Start Earning</h4>
                  <p className="text-muted-foreground">Host visitors, share your experience, and earn affiliate commissions on any equipment sales.</p>
                </div>
              </div>

              {/* Home Gym Image */}
              <div className="relative mt-8 overflow-hidden rounded-xl">
                <Image
                  src="/assets/exercise-setup.webp"
                  alt="Home gym demo center setup"
                  width={400}
                  height={250}
                  className="h-[250px] w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex gap-4">
              <Link href="/demo-centers-list">
                <Button className="group">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Demo Centers
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/demo-center-form">
                <Button variant="outline" className="group">
                  <Home className="mr-2 h-4 w-4" />
                  Apply to Host
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why It's Different Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            🤝 WHY IT'S DIFFERENT
          </h2>
          <p className="mb-8 text-center text-lg text-muted-foreground">
            Unlike traditional showrooms, our demo centers are:
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">🧍‍♂️ Real Customers, Real Feedback</h3>
              <p className="text-muted-foreground">
                You're not talking to a polished salesperson — you're meeting fellow gym enthusiasts who actually use the gear. That means no fluff, no pressure, and honest conversations.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <MessageCircle className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">💬 Casual & Authentic</h3>
              <p className="text-muted-foreground">
                Demo hosts know their setups inside and out, but they're not expected to memorize manuals. It's a low-key, authentic environment where you can see, touch, and feel the difference.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">🌍 Built for Connection</h3>
              <p className="text-muted-foreground">
                By registering or visiting a demo center, you're joining a like-minded community. This creates opportunities for live local workouts, events, collaborations, and new friendships in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earn Money Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Earn Money by Doing What You Love
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
              If you register your space:
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Affiliate Commissions</h3>
                    <p className="text-muted-foreground">You earn affiliate commissions on any equipment sold through your demo.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Zero Overhead</h3>
                    <p className="text-muted-foreground">You don’t need to handle inventory or sales — we do that.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Build Community</h3>
                    <p className="text-muted-foreground">You just share your honest experience, which you’re probably already doing anyway.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-primary/5 p-6">
                <p className="text-lg font-semibold text-foreground">
                  "Let's be real: fitness folks love talking about their gear — now you can actually get paid for it."
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/assets/exercise-library.webp"
                  alt="Fitness enthusiast earning money as demo center host"
                  width={500}
                  height={400}
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
          <Image src="/assets/why-we-build.jpg" alt="Why We Built This" width={500} height={400} className="w-full h-auto rounded-lg" />
          <div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Why We Built This
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                At Bulletproof, we've never followed the crowd. Our products are unique — which means our solutions need to be, too.
              </p>
              <p>
                And we'd rather someone realize it's not the right fit than feel pressured into buying something that doesn't serve them. Because when it is the right fit, they'll feel it the second they touch it.
              </p>
              <p className="font-semibold text-black">
                Demo Centers are about empowering smarter decisions in a way no one else in the fitness industry is doing.
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16">
        <div className="container text-center bg-gradient-to-r from-gray-200 to-purple-100 p-12 rounded-2xl">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Search. Schedule. Sweat.
          </h2>
          <p className="mb-8 text-lg max-w-3xl mx-auto text-gray-800">
            Whether you're looking to try before you buy, or ready to be your city's go-to spot for experiencing Bulletproof gear, the Demo Center program is open and growing fast.
          </p>
          <ul className="mb-8 flex flex-col gap-1 text-lg font-semibold max-w-max mx-auto">
            <li className="flex items-center gap-2">
              <CircleArrowRight className="h-5 w-5 text-primary" />
              Try the equipment.
            </li>
            <li className="flex items-center gap-2">
              <CircleArrowRight className="h-5 w-5 text-primary" />
              Meet the community.
            </li>
            <li className="flex items-center gap-2">
              <CircleArrowRight className="h-5 w-5 text-primary" />
              Be part of the movement.
            </li>
          </ul>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/demo-centers-list">
              <Button size="lg" className="w-full bg-primary px-4 py-3 text-lg font-semibold sm:w-auto">
                🚀 Find a Demo Center
              </Button>
            </Link>
            <Link href="/demo-center-form">
              <Button size="lg" variant="outline" className="w-full px-4 py-3 text-lg font-semibold sm:w-auto">
                🏡 Become a Demo Center
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
