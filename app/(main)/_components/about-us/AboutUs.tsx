"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon } from "lucide-react";

export default function AboutUs() {
    return (
        <main>
            {/* Hero Section */}
            <section>
                <div className="container py-10 lg:py-24">
                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="text-start w-full">
                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Master Your Equipment. <br />
                                One Setup at a Time.
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                A searchable video library made by real users — to help you get the most out of your Bulletproof gear.
                            </p>

                            {/* Quick Overview Bullet Points */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">🎥</span>
                                    <span className="text-sm sm:text-base">Step-by-step setup videos by real customers</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">🔎</span>
                                    <span className="text-sm sm:text-base">Search by rack, height, movement, body part, or user</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">⭐</span>
                                    <span className="text-sm sm:text-base">Top-rated and founder-approved content</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">🧠</span>
                                    <span className="text-sm sm:text-base">Created to help you unlock the full potential of your equipment</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">🤝</span>
                                    <span className="text-sm sm:text-base">Built by the community. Powered by your experience.</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link href="/exercise-library">
                                <Button size="lg" className="text-lg px-8 py-4">
                                    Explore Pump by Numbers
                                </Button>
                            </Link>
                        </div>
                        <Image src="/assets/about-hero.jpg" alt="About Us" width={500} height={500} className="w-full h-auto rounded-lg object-cover" />
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/50 shadow-xl">
                            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                                Your Blueprint for Getting the Most from
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Bulletproof Equipment</span>
                            </h2>

                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                What if mastering your equipment was as simple as painting by numbers?
                            </p>

                            <p className="text-base sm:text-lg text-gray-900 leading-relaxed">
                                Introducing <strong>Pump by Numbers</strong> — a revolutionary platform from Bulletproof Fitness Equipment that's equal parts brilliant and badass. Inspired by the simplicity of the nostalgic "Paint by Numbers" kits, Pump by Numbers is our answer to one of the biggest challenges we never saw coming: our gear does so much, it overwhelmed people.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <Image src="/assets/problem.jpg" alt="Problem" width={500} height={500} className="w-full h-auto object-cover rounded-xl" />
                        <div className="w-full">
                            <div className="bg-blue-50 backdrop-blur-sm rounded-xl p-4 lg:p-8 border border-white/50 shadow-xl">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                                    <span>THE PROBLEM: <br /> TOO MUCH VERSATILITY, TOO LITTLE CLARITY</span>
                                </h3>

                                <div className="space-y-8 text-gray-900">
                                    <p className="text-base leading-relaxed">
                                        When we started Bulletproof, our mission was crystal clear:
                                    </p>

                                    <blockquote className="border-l-4 border-primary pl-8 italic text-xl font-medium bg-white p-8 rounded-lg shadow-sm">
                                        Bring commercial-grade gym power into smaller gyms and home setups — with a fraction of the cost and space.
                                    </blockquote>

                                    <p className="text-base leading-relaxed">
                                        We succeeded — maybe too well. Units like our Isolator became beasts of versatility, replacing racks full of machines. But something funny happened:
                                    </p>

                                    <p className="text-base leading-relaxed">
                                        People were only using them for one or two exercises — like preacher curls or leg extensions — because they didn't know what else was possible. Some got stuck. Others got overwhelmed. And many didn't have the training knowledge to unlock the magic.
                                    </p>

                                        <p className="text-lg leading-relaxed font-medium text-gray-900 mb-6">
                                            So we went back to the drawing board and created something the industry has never seen before…
                                        </p>
                                    <div className="text-base mt-10">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-10 lg:py-24 bg-violet-50">
                <div className="container">
                    <div className="space-y-8">
                        {/* Left Content */}
                        <div className="max-w-3xl mx-auto text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                THE SOLUTION: <br /> COMMUNITY-POWERED SETUP VIDEOS
                            </h3>

                            <div className="space-y-6 text-gray-900">
                                <p className="text-lg leading-relaxed">
                                    Pump by Numbers is more than a tutorial library — it's a living, evolving ecosystem of user-generated setups, all vetted and approved by Larry Nolan, Bulletproof's founder and lifelong trainer. It lets you:
                                </p>

                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mt-20">
                            <div className="max-w-xl space-y-4 w-full">
                                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-violet-200">
                                    <span className="text-2xl">🎥</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">Real User Content</h4>
                                        <p className="text-sm">Search real setups from real people, just like you.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-violet-200">
                                    <span className="text-2xl">🔍</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">Advanced Filtering</h4>
                                        <p className="text-sm">Filter by rack type, equipment, body part, height, movement style, and more.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-violet-200">
                                    <span className="text-2xl">🧠</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">Top-Rated Content</h4>
                                        <p className="text-sm">Explore top-rated videos, and even search by your favorite contributors.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-violet-200">
                                    <span className="text-2xl">🧍‍♂️</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">Personalized Content</h4>
                                        <p className="text-sm">View content that's relevant to your anatomy and your gear — not just a "one-size-fits-none" instruction manual.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative overflow-hidden rounded-xl shadow-lg w-full">
                                <Image
                                    src="/assets/solution.jpg"
                                    alt="Pump by Numbers video library interface showing community-generated workout setups"
                                    width={500}
                                    height={400}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Community Section */}
            <section className="py-10 lg:py-16">
                <div className="container">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 lg:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Image - Community/Diverse People */}
                            <div className="relative order-2 lg:order-1">
                                <div className="relative overflow-hidden rounded-xl shadow-lg">
                                    <Image
                                        src="/assets/contribution.jpg"
                                        alt="Diverse community of people using Bulletproof equipment - different heights, builds, and training styles"
                                        width={500}
                                        height={400}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="order-1 lg:order-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    WHY COMMUNITY CONTRIBUTION?
                                </h3>

                                <div className="space-y-6 text-gray-900">
                                    <p className="text-lg leading-relaxed">
                                        Sure, Larry could've made hundreds of videos himself. But here's the deal:
                                    </p>

                                    <blockquote className="border-l-4 border-primary pl-6 italic text-lg font-medium bg-green-50 p-6 rounded-lg shadow-sm">
                                        One man's height, build, rack, and goals can't cover all the infinite variations our customers bring to the table.
                                    </blockquote>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-white p-6 rounded-lg border border-purple-300">
                                            <h4 className="font-bold text-lg mb-3 text-purple-800">Diverse Perspectives</h4>
                                            <p className="leading-relaxed">
                                                By opening this up to our incredible community of Bulletproof users, we get the most diverse, most useful, and most creative setups imaginable — and YOU benefit from it.
                                            </p>
                                        </div>
                                        <div className="bg-white p-6 rounded-lg border border-purple-300">
                                            <h4 className="font-bold text-lg mb-3 text-purple-800">Perfect Match</h4>
                                            <p className="leading-relaxed">
                                                Tall? Short? Using a different brand rack? Want to isolate a very specific muscle? There's likely already a setup in Pump by Numbers tailored just for your situation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Game Changer Section */}
            <section className="py-10 lg:py-16 bg-white">
                <div className="container">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                            WHY THIS IS A GAME-CHANGER
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-6 text-gray-900">
                            <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                                <span className="bg-green-500 rounded-full p-1.5">
                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                </span>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Democratizes Knowledge</h4>
                                    <p className="text-base leading-relaxed">Everyone becomes both a student and a teacher. Share your discoveries and learn from others' innovations.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                                <span className="bg-green-500 rounded-full p-1.5">
                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                </span>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Eliminates Frustration</h4>
                                    <p className="text-base leading-relaxed">Stop scratching your head over how to set something up — just search and go. No more guesswork.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                                <span className="bg-green-500 rounded-full p-1.5">
                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                </span>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Unleashes Potential</h4>
                                    <p className="text-base leading-relaxed">Finally see everything your equipment can do — not just what you've already discovered on your own.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                                <span className="bg-green-500 rounded-full p-1.5">
                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                </span>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Evolves Over Time</h4>
                                    <p className="text-base leading-relaxed">This isn't a static database — it grows as our community grows, constantly adding new possibilities.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-10 lg:py-16">
                <div className="container">
                    <div className="text-center bg-white border border-gray-200 rounded-lg p-6 lg:p-12">
                        <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
                            JOIN THE MOVEMENT
                        </h3>

                        <p className="text-base md:text-lg text-gray-900 mb-8 leading-relaxed max-w-3xl mx-auto">
                            Pump by Numbers is where versatility meets accessibility, powered by you, approved by Larry, and built to make Bulletproof's legendary gear more powerful than ever.
                        </p>

                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-8 max-w-md mx-auto">
                            <p className="text-xl font-semibold text-gray-900 mb-1">Don't just train.</p>
                            <p className="text-2xl font-bold text-primary">Pump by Numbers.</p>
                        </div>

                        <Link href="/exercise-library">
                            <Button size="lg" className="text-xl px-10 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                                Start Exploring Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
