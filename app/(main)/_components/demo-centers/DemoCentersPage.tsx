"use client";

import { Button } from "@/components/ui/button";
import { CircleArrowRight, Dumbbell, Home, MessageCircle, DollarSign, Users, Search, MapPin, Calendar, Star, TrendingUp, Heart, Zap, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DemoCentersPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 px-4 py-2 text-sm font-semibold text-black shadow-lg">

                Bulletproof Demo Centers
              </div>

              {/* Main Headline */}
              <h1 className="mb-8 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                Try Bulletproof Equipment in Your City.
                <br />
                <span className="text-gray-900 text-xl md:text-2xl">No Showroom Required</span>
              </h1>

              {/* Description */}
              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600 lg:mx-0">
                Visit or host a demo center to test our gear in real gyms and home setups —
                <span className="font-semibold text-gray-900"> no pressure, no sales pitch.</span>
              </p>

              {/* Key Benefits List */}
              <div className="mb-10 space-y-3">
                <div className="inline-flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-800">Try real Bulletproof setups near you</span>
                </div>
                <div className="inline-flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-800">Host with your home gym or training studio</span>
                </div>
                <div className="inline-flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-800">Get authentic, honest feedback — not sales talk</span>
                </div>
                <div className="inline-flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-800">Hosts earn money when visitors buy — no inventory needed</span>
                </div>
                <div className="inline-flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-800">Connect with like-minded fitness fans in your area</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-start">
                <Link href="/demo-centers-list">
                  <Button size="lg" className="group relative w-full overflow-hidden bg-black cursor-pointer px-4 py-2 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 sm:w-auto">
                    <Search className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Find a Demo Center
                  </Button>
                </Link>
                <Link href="/demo-center-form">
                  <Button size="lg" variant="outline" className="group w-full bg-white cursor-pointer px-4 py-2 text-lg font-semibold text-gray-800 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl hover:scale-105 sm:w-auto">
                    <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Become a Host
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-gray-200">
                <Image
                  src="/assets/demo-center-1.jpg"
                  alt="Bulletproof Demo Center - Real gym setup"
                  width={600}
                  height={400}
                  className="h-[500px] w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-8 -left-8 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">50+</div>
                  <div className="text-sm font-medium text-gray-600">Demo Centers</div>
                </div>
              </div>
              <div className="absolute -right-8 -top-8 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm font-medium text-gray-600">Authentic</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="h-16 w-full fill-white md:h-20">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Try It. Feel It. Know It's Right Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-3xl">
              Try It. Feel It. Know It's Right.
            </h2>
            <div className="mx-auto max-w-3xl space-y-8 text-lg leading-relaxed text-gray-600">
              <p className="text-xl font-medium text-gray-800">
                Before dropping thousands on a home gym, <br /> wouldn't it be great to actually try the equipment?
              </p>
              <p>
                At Bulletproof Fitness Equipment, we heard the calls (literally) from across the country — people ready to fly in just to get their hands on our gear. Why? Because what we make is different.
              </p>
              <p className="text-2xl font-bold text-gray-900 text-start">
                Not just a little different — game-changing,  category-defining, no-comparison different.
              </p>
              <p>
                So we created something just as unique to match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The "Uber" of Gym Demos Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-white shadow-lg">
              <span className="text-2xl">🚘</span>
              <span className="font-semibold">THE "UBER" OF GYM DEMOS IS HERE</span>
            </div>
            <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-5xl">
              A Revolutionary Way to Try Equipment
            </h2>
            <div className="mx-auto max-w-4xl space-y-8 text-xl leading-relaxed text-gray-600">
              <p className="text-2xl font-medium text-gray-800">
                Introducing Bulletproof Demo Centers — a first-of-its-kind way to experience our equipment in person, without a showroom, warehouse, or waitlist.
              </p>
              <p>
                Whether you're just curious or gearing up to make a serious investment in your gym, this is your try-before-you-buy, real-world test drive — right in your city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white shadow-lg">
              <span className="text-xl">💡</span>
              <span className="font-semibold">HOW IT WORKS</span>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Simple, Straightforward Process
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Whether you want to try equipment or host demos, we've made it incredibly easy
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* Want to try - Left Side */}
            <div className="space-y-10">
              <div className="text-center lg:text-left">
                <h3 className="mb-6 text-3xl font-bold text-gray-900">Want to try our equipment?</h3>
              </div>

              {/* Step 1 */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 ring-1 ring-blue-100 transition-all hover:shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div>
                    <h4 className="mb-3 text-xl font-bold text-gray-900">Find a Demo Center</h4>
                    <p className="text-gray-600 leading-relaxed">Find a demo center near you by searching based on location, type (home, studio, gym), or gear availability.</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 ring-1 ring-green-100 transition-all hover:shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div>
                    <h4 className="mb-3 text-xl font-bold text-gray-900">Schedule Your Visit</h4>
                    <p className="text-gray-600 leading-relaxed">Then simply schedule a visit, show up, and experience Bulletproof in action.</p>
                  </div>
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
                  <h4 className="mb-1 font-semibold">Register Your Space</h4>
                  <p className="text-muted-foreground">Register your location — whether it’s a home gym, PT studio, or commercial facility. Just enter your setup details, choose your availability, and you’re in.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Hassle-Free</h4>
                  <p className="text-muted-foreground">No sales experience needed. No inventory. No strings attached.</p>
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
      <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 text-white shadow-lg">
              <span className="text-xl">🤝</span>
              <span className="font-semibold">WHY IT'S DIFFERENT</span>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Unlike Traditional Showrooms
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Our demo centers offer something completely different from the typical sales experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:scale-105">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Real Customers, Real Feedback</h3>
              <p className="text-gray-600 leading-relaxed">
                You're not talking to a polished salesperson — you're meeting fellow gym enthusiasts who actually use the gear. That means no fluff, no pressure, and honest conversations.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:scale-105">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Casual & Authentic</h3>
              <p className="text-gray-600 leading-relaxed">
                Demo hosts know their setups inside and out, but they're not expected to memorize manuals. It's a low-key, authentic environment where you can see, touch, and feel the difference.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:scale-105">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Built for Connection</h3>
              <p className="text-gray-600 leading-relaxed">
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
      <section className="py-16 container rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="px-6">
          <div className="text-center max-w-4xl mx-auto text-white">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm text-sm">
              <span className="font-medium">SEARCH. SCHEDULE. SWEAT.</span>
            </div>

            <h2 className="mb-8 text-4xl font-bold md:text-5xl">
              Ready to Get Started?
            </h2>

            <p className="mb-12 text-lg leading-relaxed text-indigo-100 md:text-xl">
              Whether you're looking to try before you buy, or ready to be your city's go-to spot for experiencing Bulletproof gear, the Demo Center program is open and growing fast.
            </p>

            <div className="mb-12 flex flex-col items-center gap-3">
              <div className="inline-flex items-center justify-center gap-3 rounded-md bg-white/10 px-3 py-2 backdrop-blur-sm">
                <CircleArrowRight className="h-6 w-6 text-green-400" />
                <span className="text-lg font-semibold">Try the equipment.</span>
              </div>
              <div className="inline-flex items-center justify-center gap-3 rounded-md bg-white/10 px-3 py-2 backdrop-blur-sm">
                <CircleArrowRight className="h-6 w-6 text-green-400" />
                <span className="text-lg font-semibold">Meet the community.</span>
              </div>
              <div className="inline-flex items-center justify-center gap-3 rounded-md bg-white/10 px-3 py-2 backdrop-blur-sm">
                <CircleArrowRight className="h-6 w-6 text-green-400" />
                <span className="text-lg font-semibold">Be part of the movement.</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
              <Link href="/demo-centers-list">
                <Button size="lg" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-xl font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105 sm:w-auto">
                  🚀 Find a Demo Center
                </Button>
              </Link>
              <Link href="/demo-center-form">
                <Button size="lg" className="w-full bg-white px-8 py-4 text-xl font-bold text-gray-900 shadow-xl transition-all hover:bg-gray-100 hover:shadow-2xl hover:scale-105 sm:w-auto">
                  🏡 Become a Demo Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
