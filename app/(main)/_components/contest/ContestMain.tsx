"use client";

import { Calendar, Trophy, FileText, ArrowRight, Star, Zap, Target, Users, Award, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface Contest {
  id: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  sections?: ContestSection[];
  createdAt: string;
  updatedAt: string;
}

export default function ContestMain() {
  const { contest, isLoading, isError } = useActiveContest();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-300 rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Trophy className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Active Contest</h1>
          <p className="text-lg text-gray-600 mb-8">
            There are currently no active contests. Check back soon for exciting competitions!
          </p>
          <Button onClick={() => window.location.href = "/"} size="lg">
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

  const getStatusVariant = () => {
    const status = getContestStatus();
    switch (status) {
      case "Active": return "default";
      case "Coming Soon": return "secondary";
      case "Ended": return "destructive";
      default: return "outline";
    }
  };

  // Helper function to determine text color based on background
  const getTextColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  // Get sections by type
  const heroSection = contest.sections?.find(s => s.sectionType === "hero");
  const mainSection = contest.sections?.find(s => s.sectionType === "main");
  const demoCenterSection = contest.sections?.find(s => s.sectionType === "demo_center");
  const pumpNumbersSection = contest.sections?.find(s => s.sectionType === "pump_numbers");
  const missionSection = contest.sections?.find(s => s.sectionType === "mission");
  const whyMattersSection = contest.sections?.find(s => s.sectionType === "why_matters");
  const gettingStartedSection = contest.sections?.find(s => s.sectionType === "getting_started");
  const yourMissionSection = contest.sections?.find(s => s.sectionType === "your_mission");
  const prizesSection = contest.sections?.find(s => s.sectionType === "prizes");
  const howToWinSection = contest.sections?.find(s => s.sectionType === "how_to_win");
  const fairTransparentSection = contest.sections?.find(s => s.sectionType === "fair_transparent");
  const whyJoinSection = contest.sections?.find(s => s.sectionType === "why_join");
  const timelineSection = contest.sections?.find(s => s.sectionType === "timeline");
  const readyToJoinSection = contest.sections?.find(s => s.sectionType === "ready_to_join");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section - Full Screen with Gradient */}
      {heroSection && (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Fitness gym background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-800/20"></div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-300 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Trophy className="h-8 w-8 text-yellow-300" />
              </div>
              {/* <Badge variant={getStatusVariant() as any} className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
                {getContestStatus()}
              </Badge> */}
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              {heroSection.title}
            </h1>

            {heroSection.subtitle && (
              <p className="text-2xl md:text-3xl font-medium mb-8 text-gray-50">
                {heroSection.subtitle}
              </p>
            )}

            {heroSection.description && (
              <div 
                className="text-xl text-gray-50 max-w-3xl mx-auto mb-12 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: heroSection.description }}
              />
            )}

            {heroSection.ctaText && heroSection.ctaUrl && (
              <Button 
                size="lg" 
                onClick={() => window.location.href = heroSection.ctaUrl!}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {heroSection.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>
      )}

      {/* Contest Timeline - Floating Card */}
      {(contest.startDate || contest.endDate) && (
        <section className="relative -mt-20 z-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
              <CardContent className="p-8">
                <div className="flex justify-center items-center gap-3 mb-6">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Contest Timeline</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {contest.startDate && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <Star className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-green-600 mb-2">Contest Starts</h4>
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
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <Clock className="h-8 w-8 text-red-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-red-600 mb-2">Contest Ends</h4>
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

      <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        {/* Main Contest Section - Split Layout */}
        {mainSection && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="col-span-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {mainSection.title}
              </h2>
              {mainSection.subtitle && (
                <p className="text-xl text-blue-600 font-medium mb-8">
                  {mainSection.subtitle}
                </p>
              )}
              {mainSection.description && (
                <div 
                  className="text-lg text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mainSection.description }}
                />
              )}
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
                {/* <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Fitness community"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                /> */}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Users className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Join the Movement</h3>
                      <p className="text-gray-50">Be part of something bigger</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-50">
                    Connect with fitness enthusiasts, share your expertise, and help build the future of fitness training.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Demo Center & Pump Numbers - Side by Side Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {demoCenterSection && (
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Home gym"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                    <Trophy className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{demoCenterSection.title}</h3>
                </div>
                {demoCenterSection.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: demoCenterSection.description }}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {pumpNumbersSection && (
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Video recording"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{pumpNumbersSection.title}</h3>
                </div>
                {pumpNumbersSection.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: pumpNumbersSection.description }}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Mission Section - Centered with Icons */}
        {missionSection && (
          <section className="text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Target className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">{missionSection.title}</h2>
              </div>
              {missionSection.description && (
                <div 
                  className="text-lg text-gray-700 leading-relaxed bg-white rounded-2xl p-8 shadow-lg"
                  dangerouslySetInnerHTML={{ __html: missionSection.description }}
                />
              )}
            </div>
          </section>
        )}

        {/* Why This Matters - Feature Highlight */}
        {whyMattersSection && (
          <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Fitness community working out"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">{whyMattersSection.title}</h2>
              {whyMattersSection.description && (
                <div 
                  className="text-xl leading-relaxed text-purple-100"
                  dangerouslySetInnerHTML={{ __html: whyMattersSection.description }}
                />
              )}
            </div>
          </section>
        )}

        {/* Getting Started - Step by Step */}
        {gettingStartedSection && (
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{gettingStartedSection.title}</h2>
            {gettingStartedSection.description && (
              <div className="max-w-3xl mx-auto mb-12">
                <div 
                  className="text-lg text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: gettingStartedSection.description }}
                />
              </div>
            )}
            {gettingStartedSection.ctaText && gettingStartedSection.ctaUrl && (
              <Button 
                size="lg" 
                onClick={() => window.location.href = gettingStartedSection.ctaUrl!}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{yourMissionSection.title}</h2>
            </div>
            <div className="bg-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
                <img 
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Fitness equipment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                {yourMissionSection.description && (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: yourMissionSection.description }}
                  />
                )}
                {yourMissionSection.ctaText && yourMissionSection.ctaUrl && (
                  <div className="text-center mt-12">
                    <Button 
                      size="lg" 
                      onClick={() => window.location.href = yourMissionSection.ctaUrl!}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full"
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">{prizesSection.title}</h2>
              </div>
              {prizesSection.subtitle && (
                <p className="text-xl text-gray-600 mb-8">{prizesSection.subtitle}</p>
              )}
              {prizesSection.description && (
                <div 
                  className="text-lg text-gray-700"
                  dangerouslySetInnerHTML={{ __html: prizesSection.description }}
                />
              )}
            </div>

            {prizesSection.cards && prizesSection.cards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {prizesSection.cards.map((card, index) => {
                  const textColor = getTextColor(card.backgroundColor);
                  const isGrandPrize = index === 0;

                  return (
                    <Card 
                      key={card.id} 
                      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                        isGrandPrize ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''
                      }`}
                      style={{ 
                        backgroundColor: card.backgroundColor,
                        borderColor: card.backgroundColor,
                      }}
                    >
                      {/* Prize-specific background images */}
                      <div className="absolute inset-0 opacity-10">
                        <img 
                          src={
                            isGrandPrize 
                              ? "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                              : index === 1 
                              ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                              : "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                          }
                          alt="Prize background"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {isGrandPrize && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold z-20">
                          GRAND PRIZE
                        </div>
                      )}
                      <CardContent className={`relative z-10 p-8 ${isGrandPrize ? 'pb-12' : ''}`}>
                        <h3 
                          className={`text-xl font-bold mb-4 ${isGrandPrize ? 'text-2xl' : ''}`}
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
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{howToWinSection.title}</h2>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-12">
              {howToWinSection.description && (
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: howToWinSection.description }}
                />
              )}
            </div>
          </section>
        )}

        {/* Fair & Transparent - Trust Indicators */}
        {fairTransparentSection && (
          <section className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">{fairTransparentSection.title}</h2>
              </div>
            </div>
            {fairTransparentSection.description && (
              <div 
                className="prose prose-lg max-w-none text-gray-700 text-center"
                dangerouslySetInnerHTML={{ __html: fairTransparentSection.description }}
              />
            )}
          </section>
        )}

        {/* Why Join - Benefits Grid */}
        {whyJoinSection && (
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{whyJoinSection.title}</h2>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12">
              {whyJoinSection.description && (
                <div 
                  className="prose prose-lg max-w-none text-gray-700 text-center"
                  dangerouslySetInnerHTML={{ __html: whyJoinSection.description }}
                />
              )}
            </div>
          </section>
        )}

        {/* Timeline - Visual Timeline */}
        {timelineSection && (
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{timelineSection.title}</h2>
            </div>
            <div className="bg-white rounded-3xl p-12 shadow-lg">
              {timelineSection.description && (
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: timelineSection.description }}
                />
              )}
            </div>
          </section>
        )}

        {/* Ready to Join - Final CTA */}
        {readyToJoinSection && (
          <section className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Fitness motivation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-pink-500/80"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">{readyToJoinSection.title}</h2>
                {readyToJoinSection.description && (
                  <div 
                    className="text-xl leading-relaxed mb-12 max-w-3xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: readyToJoinSection.description }}
                  />
                )}
                {readyToJoinSection.ctaText && readyToJoinSection.ctaUrl && (
                  <Button 
                    size="lg" 
                    onClick={() => window.location.href = readyToJoinSection.ctaUrl!}
                    className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
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
            <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0 shadow-2xl">
              <CardContent className="py-16 px-8">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-3xl font-bold mb-6">Ready to Show Your Skills?</h3>
                  <p className="text-xl mb-12 text-blue-100">
                    Join thousands of fitness enthusiasts and compete for amazing prizes!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                      size="lg"
                      onClick={() => window.location.href = "/exercise-setup"}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Upload Exercise Setup
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => window.location.href = "/upload-video"}
                      className="bg-white/20 hover:bg-white/30 border-white/30 text-white font-bold px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
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