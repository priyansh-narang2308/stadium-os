"use client";

import { Trophy, Users, Activity, MapPin, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    title: "Fan Assistant AI",
    description:
      "Smart navigation, crowd-aware recommendations, and accessibility support for every fan.",
    icon: <Users className="h-10 w-10 text-primary" />,
    href: "/fan",
  },
  {
    title: "Operations Intelligence",
    description:
      "Real-time dashboards, AI-powered recommendations, and stadium management tools.",
    icon: <Activity className="h-10 w-10 text-primary" />,
    href: "/operations",
  },
  {
    title: "Volunteer Assistant",
    description:
      "Emergency procedures, accessibility guidance, and fan support tools.",
    icon: <Shield className="h-10 w-10 text-primary" />,
    href: "/volunteer",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Trophy className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              StadiumOS AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered stadium intelligence platform for FIFA World Cup 2026.
              Enhancing fan experience and optimizing operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Link href="/fan" className="flex items-center justify-center">Get Started</Link>
              </Button>
              <Button variant="secondary" size="lg">
                <Link href="/operations" className="flex items-center justify-center">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Link href={feature.href} className="block">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">80K</div>
                <p className="text-muted-foreground">Stadium Capacity</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">AI Support</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <p className="text-muted-foreground">Facilities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  Real-time
                </div>
                <p className="text-muted-foreground">Analytics</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
