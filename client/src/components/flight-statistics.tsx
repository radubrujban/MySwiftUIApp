import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  MapPin, 
  Package, 
  Users, 
  Trophy, 
  TrendingUp,
  Plane,
  Route
} from "lucide-react";
import type { FlightStatistics } from "@shared/schema";

interface FlightStatisticsProps {
  userId?: string;
  className?: string;
}

export default function FlightStatisticsComponent({ 
  userId = "default", 
  className = "" 
}: FlightStatisticsProps) {
  const { data: stats, isLoading } = useQuery<FlightStatistics>({
    queryKey: ["/api/profile/statistics", userId],
  });

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="aviation-surface border-gray-700 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-600 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="aviation-surface border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="aviation-text-muted">No flight statistics available</p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatHours = (hours: number) => `${hours.toFixed(1)}h`;
  const formatDistance = (nm: number) => `${nm.toLocaleString()} NM`;
  const formatWeight = (lbs: number) => `${lbs.toLocaleString()} lbs`;

  // Calculate progress towards milestones
  const flightHoursMilestones = [100, 500, 1000, 2500, 5000];
  const nextFlightHourMilestone = flightHoursMilestones.find(m => m > stats.totalFlightHours) || 10000;
  const flightHoursProgress = (stats.totalFlightHours / nextFlightHourMilestone) * 100;

  const distanceMilestones = [10000, 50000, 100000, 250000, 500000];
  const nextDistanceMilestone = distanceMilestones.find(m => m > stats.totalDistanceNm) || 1000000;
  const distanceProgress = (stats.totalDistanceNm / nextDistanceMilestone) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Total Flight Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-[var(--aviation-blue)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold aviation-text mb-2">
              {formatHours(stats.totalFlightHours)}
            </div>
            <Progress 
              value={flightHoursProgress} 
              className="h-2"
            />
            <p className="text-xs aviation-text-muted mt-2">
              {formatHours(nextFlightHourMilestone - stats.totalFlightHours)} to {formatHours(nextFlightHourMilestone)}
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Distance Traveled
            </CardTitle>
            <MapPin className="h-4 w-4 text-[var(--aviation-blue)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold aviation-text mb-2">
              {formatDistance(stats.totalDistanceNm)}
            </div>
            <Progress 
              value={distanceProgress} 
              className="h-2"
            />
            <p className="text-xs aviation-text-muted mt-2">
              {formatDistance(nextDistanceMilestone - stats.totalDistanceNm)} to {formatDistance(nextDistanceMilestone)}
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Cargo Moved
            </CardTitle>
            <Package className="h-4 w-4 text-[var(--aviation-blue)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold aviation-text">
              {formatWeight(stats.totalCargoMoved)}
            </div>
            <p className="text-xs aviation-text-muted">
              Total cargo transported
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Passengers Moved
            </CardTitle>
            <Users className="h-4 w-4 text-[var(--aviation-blue)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold aviation-text">
              {formatNumber(stats.totalPaxMoved)}
            </div>
            <p className="text-xs aviation-text-muted">
              Total passengers transported
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Missions Completed
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold aviation-text">
              {formatNumber(stats.missionsCompleted)}
            </div>
            <p className="text-xs aviation-text-muted">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Average Flight Time
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold aviation-text">
              {formatHours(stats.averageFlightHours)}
            </div>
            <p className="text-xs aviation-text-muted">
              Per flight leg
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Longest Flight
            </CardTitle>
            <Plane className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold aviation-text">
              {formatHours(stats.longestFlight)}
            </div>
            <p className="text-xs aviation-text-muted">
              Single flight duration
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-surface border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium aviation-text-muted">
              Most Frequent Route
            </CardTitle>
            <Route className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold aviation-text">
              {stats.mostFrequentRoute}
            </div>
            <p className="text-xs aviation-text-muted">
              Favorite flight path
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card className="aviation-surface border-gray-700">
        <CardHeader>
          <CardTitle className="aviation-text">Flight Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.totalFlightHours >= 100 && (
              <Badge variant="secondary" className="bg-blue-600 text-white">
                Century Club (100+ Hours)
              </Badge>
            )}
            {stats.totalFlightHours >= 500 && (
              <Badge variant="secondary" className="bg-purple-600 text-white">
                Veteran Pilot (500+ Hours)
              </Badge>
            )}
            {stats.totalFlightHours >= 1000 && (
              <Badge variant="secondary" className="bg-yellow-600 text-white">
                Elite Aviator (1000+ Hours)
              </Badge>
            )}
            {stats.totalDistanceNm >= 100000 && (
              <Badge variant="secondary" className="bg-green-600 text-white">
                Around the World (100k+ NM)
              </Badge>
            )}
            {stats.missionsCompleted >= 50 && (
              <Badge variant="secondary" className="bg-red-600 text-white">
                Mission Specialist (50+ Missions)
              </Badge>
            )}
            {stats.totalPaxMoved >= 1000 && (
              <Badge variant="secondary" className="bg-orange-600 text-white">
                People Mover (1000+ PAX)
              </Badge>
            )}
            {stats.totalCargoMoved >= 100000 && (
              <Badge variant="secondary" className="bg-indigo-600 text-white">
                Cargo Master (100k+ lbs)
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}