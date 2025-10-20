"use client";

import { Calendar, Trophy, Gift, FileText, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface ContestPreviewProps {
  contest: {
    title: string;
    subtitle?: string;
    description: string;
    content: string;
    rules?: string;
    prizes?: string;
    startDate?: string;
    endDate?: string;
    bannerImage?: string;
    isActive: boolean;
  };
}

export default function ContestPreview({ contest }: ContestPreviewProps) {
  const getContestStatus = () => {
    if (!contest.startDate && !contest.endDate) {
      return contest.isActive ? "Active" : "Draft";
    }
    
    const now = new Date();
    const start = contest.startDate ? new Date(contest.startDate) : null;
    const end = contest.endDate ? new Date(contest.endDate) : null;
    
    if (start && now < start) return "Coming Soon";
    if (end && now > end) return "Ended";
    if (contest.isActive) return "Active";
    
    return "Draft";
  };

  const getStatusVariant = () => {
    const status = getContestStatus();
    switch (status) {
      case "Active": return "default";
      case "Coming Soon": return "secondary";
      case "Ended": return "destructive";
      case "Draft": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Preview Header */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Contest Preview</span>
              <span className="text-sm text-yellow-600">This is how your contest will appear to users</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <Badge variant={getStatusVariant() as any} className="text-sm">
                {getContestStatus()}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              {contest.title || "Contest Title"}
            </h1>
            
            {contest.subtitle && (
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
                {contest.subtitle}
              </p>
            )}
            
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {contest.description || "Contest description will appear here..."}
            </p>
          </div>

          {/* Banner Image */}
          {contest.bannerImage && (
            <div className="mb-12">
              <img
                src={contest.bannerImage}
                alt={contest.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Contest Dates */}
          {(contest.startDate || contest.endDate) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Contest Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contest.startDate && (
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400">Start Date</h4>
                      <p className="text-lg">
                        {format(new Date(contest.startDate), "MMMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  )}
                  {contest.endDate && (
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400">End Date</h4>
                      <p className="text-lg">
                        {format(new Date(contest.endDate), "MMMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabbed Content */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Details
              </TabsTrigger>
              {contest.rules && (
                <TabsTrigger value="rules" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Rules
                </TabsTrigger>
              )}
              {contest.prizes && (
                <TabsTrigger value="prizes" className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Prizes
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contest Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {contest.content ? (
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: contest.content }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">Contest content will appear here...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {contest.rules && (
              <TabsContent value="rules" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contest Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: contest.rules }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {contest.prizes && (
              <TabsContent value="prizes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Prizes & Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: contest.prizes }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {/* Call to Action */}
          {contest.isActive && (
            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardContent className="py-8">
                  <h3 className="text-2xl font-bold mb-4">Ready to Participate?</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Join the contest now and show off your fitness skills!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      disabled
                    >
                      Upload Exercise Setup
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      disabled
                    >
                      Upload Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
