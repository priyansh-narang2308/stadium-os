"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Activity, Users, Clock, Sun, Cloud, Rainbow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "@/src/components/layout/stat-card";
import { OperationsRecommendation, PriorityLevel, WeatherData } from "@/src/types";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/src/lib/logger";

interface DashboardData {
  gates: Array<{
    id: string;
    stadiumId: string;
    gateName: string;
    queueLength: number;
    estimatedWaitTime: number;
    openLanes: number;
    timestamp: Date;
  }>;
  crowd: Array<{
    id: string;
    stadiumId: string;
    area: string;
    densityPercentage: number;
    timestamp: Date;
  }>;
  weather: WeatherData;
}

interface ChartData {
  name: string;
  density: number;
}

const WeatherIcon = memo(({ condition }: { condition: WeatherData['condition'] }) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-6 w-6 text-yellow-500" aria-hidden="true" />;
    case "cloudy":
    case "partly-cloudy":
      return <Cloud className="h-6 w-6 text-gray-500" aria-hidden="true" />;
    case "rainy":
      return <Rainbow className="h-6 w-6 text-blue-500" aria-hidden="true" />;
    default:
      return <Sun className="h-6 w-6 text-yellow-500" aria-hidden="true" />;
  }
});

WeatherIcon.displayName = 'WeatherIcon';

export function OperationsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recommendations, setRecommendations] = useState<
    OperationsRecommendation[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/operations");
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (error) {
        logger.error("Error fetching dashboard data", error as Error);
      }
    };
    fetchData();
  }, []);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();
      setRecommendations(data.recommendations);
      setDashboardData(data.dashboardData);
    } catch (error) {
      logger.error("Error analyzing operations", error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const getPriorityColor = useCallback((priority: PriorityLevel) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  }, []);

  const chartData = useMemo<ChartData[]>(
    () =>
      dashboardData?.crowd?.map((item) => ({
        name: item.area,
        density: item.densityPercentage,
      })) || [],
    [dashboardData?.crowd],
  );

  return (
    <main className="container mx-auto px-4 py-8" role="main">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Operations Command Center</h1>
        <p className="text-muted-foreground">
          Real-time stadium intelligence and AI-powered recommendations.
        </p>
      </header>

      <section className="grid md:grid-cols-4 gap-6 mb-8" aria-label="Key metrics">
        <StatCard
          title="Total Attendance"
          value="52,418"
          subtitle="65.5% capacity"
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          trend="up"
          trendValue="+12% from last hour"
        />
        <StatCard
          title="Avg Wait Time"
          value="12 min"
          subtitle="Gate A"
          icon={<Clock className="h-5 w-5" aria-hidden="true" />}
          trend="up"
          trendValue="+4 min"
        />
        <StatCard
          title="Active Zones"
          value="3"
          subtitle="High density"
          icon={<Activity className="h-5 w-5" aria-hidden="true" />}
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weather
            </CardTitle>
            {dashboardData?.weather && (
              <div aria-hidden="true">
                <WeatherIcon condition={dashboardData.weather.condition} />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.weather?.temperature || 24}°C
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData?.weather?.condition || "Sunny"}
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crowd Density by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" role="img" aria-label={`Bar chart showing crowd density by area. ${chartData.map(d => `${d.name}: ${d.density}%`).join(', ')}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    label={{
                      value: "Density %",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="density" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gate Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gate</TableHead>
                  <TableHead>Wait</TableHead>
                  <TableHead>Lanes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.gates?.map((gate: DashboardData['gates'][number]) => (
                  <TableRow key={gate.id}>
                    <TableCell className="font-medium">
                      {gate.gateName}
                    </TableCell>
                    <TableCell>{gate.estimatedWaitTime} min</TableCell>
                    <TableCell>{gate.openLanes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Operations Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Describe the situation (e.g., 'Security queue at Gate A increased')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card
                  key={`${rec.priority}-${rec.recommendation}`}
                  className="border-l-4"
                  style={{
                    borderLeftColor:
                      rec.priority === "critical"
                        ? "#dc2626"
                        : rec.priority === "high"
                          ? "#ea580c"
                          : "#ca8a04",
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {rec.recommendation}
                      </h3>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      <strong>Reasoning:</strong> {rec.reasoning}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Expected Impact:</strong> {rec.expectedImpact}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Describe a situation above to receive AI-powered analysis and recommendations.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
