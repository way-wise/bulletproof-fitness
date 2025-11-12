"use client";

import {
  Calendar,
  Trophy,
  FileText,
  ArrowRight,
  Star,
  Zap,
  Target,
  Users,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useActiveContest } from "@/hooks/useContest";

interface ContestCard {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  order: number;
  cardType?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContestSection {
  id: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  isVisible: boolean;
  cards?: ContestCard[];
  createdAt: string;
  updatedAt: string;
}

export default function ContestMain() {
  const { contest, isLoading, isError } = useActiveContest();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="animate-pulse space-y-8">
              <div className="mx-auto h-12 w-3/4 rounded bg-gray-300"></div>
              <div className="mx-auto h-6 w-1/2 rounded bg-gray-300"></div>
              <div className="h-64 rounded bg-gray-300"></div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 rounded bg-gray-300"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !contest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Trophy className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            No Active Contest
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            There are currently no active contests. Check back soon for exciting
            competitions!
          </p>
          <Button onClick={() => (window.location.href = "/")} size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isContestActive = () => {
    if (!contest.startDate && !contest.endDate) return contest.isActive;
    const now = new Date();
    const start = contest.startDate ? new Date(contest.startDate) : null;
    const end = contest.endDate ? new Date(contest.endDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return contest.isActive;
  };

  const getContestStatus = () => {
    if (!contest.startDate && !contest.endDate) {
      return contest.isActive ? "Active" : "Inactive";
    }
    const now = new Date();
    const start = contest.startDate ? new Date(contest.startDate) : null;
    const end = contest.endDate ? new Date(contest.endDate) : null;
    if (start && now < start) return "Coming Soon";
    if (end && now > end) return "Ended";
    if (contest.isActive) return "Active";
    return "Inactive";
  };

  // Helper function to determine text color based on background
  const getTextColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  // Get sections by type
  const heroSection = contest.sections?.find((s) => s.sectionType === "hero");
  const mainSection = contest.sections?.find((s) => s.sectionType === "main");
  const demoCenterSection = contest.sections?.find(
    (s) => s.sectionType === "demo_center",
  );
  const pumpNumbersSection = contest.sections?.find(
    (s) => s.sectionType === "pump_numbers",
  );
  const missionSection = contest.sections?.find(
    (s) => s.sectionType === "mission",
  );
  const whyMattersSection = contest.sections?.find(
    (s) => s.sectionType === "why_matters",
  );
  const gettingStartedSection = contest.sections?.find(
    (s) => s.sectionType === "getting_started",
  );
  const yourMissionSection = contest.sections?.find(
    (s) => s.sectionType === "your_mission",
  );
  const prizesSection = contest.sections?.find(
    (s) => s.sectionType === "prizes",
  );
  const howToWinSection = contest.sections?.find(
    (s) => s.sectionType === "how_to_win",
  );
  const fairTransparentSection = contest.sections?.find(
    (s) => s.sectionType === "fair_transparent",
  );
  const whyJoinSection = contest.sections?.find(
    (s) => s.sectionType === "why_join",
  );
  const timelineSection = contest.sections?.find(
    (s) => s.sectionType === "timeline",
  );
  const readyToJoinSection = contest.sections?.find(
    (s) => s.sectionType === "ready_to_join",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section - Full Screen with Gradient */}
      {heroSection && (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Fitness gym background"
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-800/20"></div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl"></div>
            <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-yellow-300 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-pink-300 blur-3xl"></div>
          </div>
          <div className="container flex items-center justify-center">
            <div className="relative z-10 w-full px-4 md:w-1/2">
              <div className="mb-8 flex items-center justify-center gap-4">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                  <Trophy className="h-8 w-8 text-yellow-300" />
                </div>
                {/* <Badge variant={getStatusVariant() as any} className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
                  {getContestStatus()}
                </Badge> */}
              </div>

              <h1 className="mb-6 text-5xl leading-tight font-black md:text-4xl">
                {heroSection.title}
              </h1>

              {heroSection.subtitle && (
                <p className="mb-8 text-2xl font-medium text-gray-50 md:text-xl">
                  {heroSection.subtitle}
                </p>
              )}

              {heroSection.description && (
                <div
                  className="mx-auto mb-12 max-w-3xl text-base leading-relaxed text-gray-50"
                  dangerouslySetInnerHTML={{ __html: heroSection.description }}
                />
              )}

              {heroSection.ctaText && heroSection.ctaUrl && (
                <Button
                  size="lg"
                  onClick={() => (window.location.href = heroSection.ctaUrl!)}
                  className="transform rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-orange-600 hover:shadow-yellow-500/25"
                >
                  {heroSection.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="relative z-20 w-full md:w-1/2">
              <video
                src="/assets/promo.mp4"
                className="h-full w-full rounded-lg object-cover"
                autoPlay
                muted
                loop
                controls={true}
              />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
            <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/50">
              <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white/70"></div>
            </div>
          </div>
        </section>
      )}

      {/* Contest Timeline - Floating Card */}
      {(contest.startDate || contest.endDate) && (
        <section className="relative z-10 -mt-20 px-4">
          <div className="mx-auto max-w-4xl">
            <Card className="border-0 bg-white/90 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center justify-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Contest Timeline
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {contest.startDate && (
                    <div className="text-center">
                      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Star className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-green-600">
                        Contest Starts
                      </h4>
                      <p className="text-xl font-bold text-gray-900">
                        {format(new Date(contest.startDate), "MMMM dd, yyyy")}
                      </p>
                      <p className="text-gray-600">
                        {format(new Date(contest.startDate), "h:mm a")}
                      </p>
                    </div>
                  )}
                  {contest.endDate && (
                    <div className="text-center">
                      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <Clock className="h-8 w-8 text-red-600" />
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-red-600">
                        Contest Ends
                      </h4>
                      <p className="text-xl font-bold text-gray-900">
                        {format(new Date(contest.endDate), "MMMM dd, yyyy")}
                      </p>
                      <p className="text-gray-600">
                        {format(new Date(contest.endDate), "h:mm a")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl space-y-32 px-4 py-20">
        {/* Main Contest Section - Split Layout */}
        {mainSection && (
          <section className="grid grid-cols-1 items-center gap-16 lg:grid-cols-3">
            <div className="col-span-2">
              <h2 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
                {mainSection.title}
              </h2>
              {mainSection.subtitle && (
                <p className="mb-8 text-xl font-medium text-blue-600">
                  {mainSection.subtitle}
                </p>
              )}
              {mainSection.description && (
                <div
                  className="text-lg leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ __html: mainSection.description }}
                />
              )}
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white shadow-2xl">
                {/* <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Fitness community"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                /> */}
                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-full bg-white/20 p-3">
                      <Users className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Join the Movement</h3>
                      <p className="text-gray-50">
                        Be part of something bigger
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-50">
                    Connect with fitness enthusiasts, share your expertise, and
                    help build the future of fitness training.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Demo Center & Pump Numbers - Side by Side Cards */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {demoCenterSection && (
            <Card className="group relative overflow-hidden border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Home gym"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="relative z-10 p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 transition-colors group-hover:bg-orange-200">
                    <Trophy className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {demoCenterSection.title}
                    </h3>
                    {demoCenterSection.subtitle && (
                      <p className="mt-1 text-lg font-medium text-orange-600">
                        {demoCenterSection.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                {demoCenterSection.description && (
                  <div
                    className="leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: demoCenterSection.description,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {pumpNumbersSection && (
            <Card className="group relative overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <img
                  src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Video recording"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="relative z-10 p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {pumpNumbersSection.title}
                    </h3>
                    {pumpNumbersSection.subtitle && (
                      <p className="mt-1 text-lg font-medium text-blue-600">
                        {pumpNumbersSection.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                {pumpNumbersSection.description && (
                  <div
                    className="leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: pumpNumbersSection.description,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Mission Section - Centered with Icons */}
        {missionSection && (
          <section className="text-center">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 inline-flex items-center gap-3">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Target className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">
                    {missionSection.title}
                  </h2>
                  {missionSection.subtitle && (
                    <p className="mt-2 text-xl font-medium text-yellow-600">
                      {missionSection.subtitle}
                    </p>
                  )}
                </div>
              </div>
              {missionSection.description && (
                <div
                  className="rounded-2xl bg-white p-8 text-lg leading-relaxed text-gray-700 shadow-lg"
                  dangerouslySetInnerHTML={{
                    __html: missionSection.description,
                  }}
                />
              )}
            </div>
          </section>
        )}

        {/* Why This Matters - Feature Highlight */}
        {whyMattersSection && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-12 text-white">
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Fitness community working out"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 rounded-full bg-white/10"></div>
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h2 className="mb-4 text-4xl font-bold">
                {whyMattersSection.title}
              </h2>
              {whyMattersSection.subtitle && (
                <p className="mb-8 text-xl font-medium text-purple-100">
                  {whyMattersSection.subtitle}
                </p>
              )}
              {whyMattersSection.description && (
                <div
                  className="text-xl leading-relaxed text-purple-100"
                  dangerouslySetInnerHTML={{
                    __html: whyMattersSection.description,
                  }}
                />
              )}
            </div>
          </section>
        )}

        {/* Getting Started - Step by Step */}
        {gettingStartedSection && (
          <section className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {gettingStartedSection.title}
            </h2>
            {gettingStartedSection.subtitle && (
              <p className="mb-8 text-xl font-medium text-gray-600">
                {gettingStartedSection.subtitle}
              </p>
            )}
            {gettingStartedSection.description && (
              <div className="mx-auto mb-12 max-w-3xl">
                <div
                  className="text-lg leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: gettingStartedSection.description,
                  }}
                />
              </div>
            )}
            {gettingStartedSection.ctaText && gettingStartedSection.ctaUrl && (
              <Button
                size="lg"
                onClick={() =>
                  (window.location.href = gettingStartedSection.ctaUrl!)
                }
                className="rounded-full bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-blue-600 hover:shadow-xl"
              >
                {gettingStartedSection.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </section>
        )}

        {/* Your Mission - Detailed Breakdown */}
        {yourMissionSection && (
          <section>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {yourMissionSection.title}
              </h2>
              {yourMissionSection.subtitle && (
                <p className="mb-8 text-xl font-medium text-gray-600">
                  {yourMissionSection.subtitle}
                </p>
              )}
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-white p-12 shadow-2xl">
              {/* <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
                <img 
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Fitness equipment"
                  className="w-full h-full object-cover"
                />
              </div> */}
              <div className="relative z-10">
                {yourMissionSection.description && (
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: yourMissionSection.description,
                    }}
                  />
                )}
                {yourMissionSection.ctaText && yourMissionSection.ctaUrl && (
                  <div className="mt-12 text-center">
                    <Button
                      size="lg"
                      onClick={() =>
                        (window.location.href = yourMissionSection.ctaUrl!)
                      }
                      className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-bold text-white hover:from-purple-600 hover:to-pink-600"
                    >
                      {yourMissionSection.ctaText}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Prizes Section - Showcase Grid */}
        {prizesSection && (
          <section>
            <div className="mb-16 text-center">
              <div className="mb-6 inline-flex items-center gap-3">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  {prizesSection.title}
                </h2>
              </div>
              {prizesSection.subtitle && (
                <p className="mb-8 text-xl text-gray-600">
                  {prizesSection.subtitle}
                </p>
              )}
              {prizesSection.description && (
                <div
                  className="text-lg text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: prizesSection.description,
                  }}
                />
              )}
            </div>

            {prizesSection.cards && prizesSection.cards.length > 0 && (
              <div className="grid grid-cols-1 gap-8 rounded-3xl bg-white p-12 md:grid-cols-2 lg:grid-cols-3">
                {prizesSection.cards.map((card, index) => {
                  const textColor = getTextColor(card.backgroundColor);
                  const isGrandPrize = index === 0;

                  return (
                    <Card
                      key={card.id}
                      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                        isGrandPrize ? "md:col-span-2 lg:col-span-1" : ""
                      }`}
                      style={{
                        backgroundColor: card.backgroundColor,
                        borderColor: card.backgroundColor,
                      }}
                    >
                      {isGrandPrize && (
                        <div className="absolute top-4 right-4 z-20 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-black">
                          GRAND PRIZE
                        </div>
                      )}
                      <CardContent
                        className={`relative z-10 p-8 ${isGrandPrize ? "pb-12" : ""}`}
                      >
                        <h3
                          className={`mb-4 text-xl font-bold ${isGrandPrize ? "text-2xl" : ""}`}
                          style={{ color: textColor }}
                        >
                          {card.title}
                        </h3>
                        <div
                          className="prose prose-sm max-w-none"
                          style={{ color: textColor }}
                          dangerouslySetInnerHTML={{ __html: card.description }}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* How to Win - Process Steps */}
        {howToWinSection && (
          <section>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {howToWinSection.title}
              </h2>
              {howToWinSection.subtitle && (
                <p className="mb-8 text-xl font-medium text-gray-600">
                  {howToWinSection.subtitle}
                </p>
              )}
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-green-50 to-blue-50 p-12">
              {howToWinSection.description && (
                <div
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: howToWinSection.description,
                  }}
                />
              )}
            </div>
          </section>
        )}

        {/* Fair & Transparent - Trust Indicators */}
        {fairTransparentSection && (
          <section className="rounded-3xl border border-gray-100 bg-white p-12 shadow-lg">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">
                    {fairTransparentSection.title}
                  </h2>
                  {fairTransparentSection.subtitle && (
                    <p className="mt-2 text-xl font-medium text-green-600">
                      {fairTransparentSection.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {fairTransparentSection.description && (
              <div
                className="prose prose-lg max-w-none text-center text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: fairTransparentSection.description,
                }}
              />
            )}
          </section>
        )}

        {/* Why Join - Benefits Grid */}
        {whyJoinSection && (
          <section>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {whyJoinSection.title}
              </h2>
              {whyJoinSection.subtitle && (
                <p className="mb-8 text-xl font-medium text-gray-600">
                  {whyJoinSection.subtitle}
                </p>
              )}
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-12">
              {whyJoinSection.description && (
                <div
                  className="prose prose-lg max-w-none text-center text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: whyJoinSection.description,
                  }}
                />
              )}
            </div>
          </section>
        )}

        {/* Timeline - Visual Timeline */}
        {timelineSection && (
          <section>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {timelineSection.title}
              </h2>
              {timelineSection.subtitle && (
                <p className="mb-8 text-xl font-medium text-gray-600">
                  {timelineSection.subtitle}
                </p>
              )}
            </div>
            <div className="rounded-3xl bg-white p-12 shadow-lg">
              {timelineSection.description && (
                <div
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: timelineSection.description,
                  }}
                />
              )}
            </div>
          </section>
        )}

        {/* Ready to Join - Final CTA */}
        {readyToJoinSection && (
          <section className="text-center">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-pink-500 p-16 text-white">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Fitness motivation"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-pink-500/80"></div>
              <div className="relative z-10">
                <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                  {readyToJoinSection.title}
                </h2>
                {readyToJoinSection.subtitle && (
                  <p className="mb-8 text-xl font-medium text-orange-100">
                    {readyToJoinSection.subtitle}
                  </p>
                )}
                {readyToJoinSection.description && (
                  <div
                    className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: readyToJoinSection.description,
                    }}
                  />
                )}
                {readyToJoinSection.ctaText && readyToJoinSection.ctaUrl && (
                  <Button
                    size="lg"
                    onClick={() =>
                      (window.location.href = readyToJoinSection.ctaUrl!)
                    }
                    className="transform rounded-full bg-white px-12 py-6 text-xl font-bold text-orange-600 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-white/25"
                  >
                    {readyToJoinSection.ctaText}
                    <Zap className="ml-3 h-6 w-6" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Final Participation CTA */}
        {isContestActive() && (
          <section className="text-center">
            <Card className="border-0 bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-2xl">
              <CardContent className="px-8 py-16">
                <div className="mx-auto max-w-3xl">
                  <h3 className="mb-6 text-3xl font-bold">
                    Ready to Show Your Skills?
                  </h3>
                  <p className="mb-12 text-xl text-blue-100">
                    Join thousands of fitness enthusiasts and compete for
                    amazing prizes!
                  </p>
                  <div className="flex flex-col justify-center gap-6 sm:flex-row">
                    <Button
                      size="lg"
                      onClick={() => (window.location.href = "/exercise-setup")}
                      className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black shadow-lg transition-all duration-300 hover:bg-yellow-500 hover:shadow-xl"
                    >
                      Upload Exercise Setup
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => (window.location.href = "/upload-video")}
                      className="rounded-full border-white/30 bg-white/20 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
                    >
                      Upload Video
                      <FileText className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
