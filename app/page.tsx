"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Star,
  GitPullRequest,
  BarChart3,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Check,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Github className="h-8 w-8 mr-2" />
          <span className="font-bold text-xl">Dandi Github Analyzer</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
        </nav>
        <div className="ml-4 flex gap-2 items-center">
          <Link href="/dashboards">
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-colors mr-2"
              style={{ background: 'linear-gradient(90deg, #a259ff 0%, #f24e1e 50%, #ffc700 100%)', boxShadow: '0 2px 8px 0 rgba(162,89,255,0.15)' }}
              type="button"
            >
              Dashboard
            </button>
          </Link>
          {status === "loading" ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : session ? (
            <>
              {session.user?.image && (
                <img src={session.user.image} alt="User avatar" className="w-8 h-8 rounded-full border" />
              )}
              <span className="font-medium text-gray-900 text-sm mx-2">{session.user?.name}</span>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-colors"
                style={{ background: 'linear-gradient(90deg, #a259ff 0%, #f24e1e 50%, #ffc700 100%)', boxShadow: '0 2px 8px 0 rgba(162,89,255,0.15)' }}
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="rounded-lg transition-colors flex items-center justify-center font-semibold text-base h-10 px-5 text-white shadow-md"
              style={{ background: 'linear-gradient(90deg, #a259ff 0%, #f24e1e 50%, #ffc700 100%)', boxShadow: '0 2px 8px 0 rgba(162,89,255,0.15)' }}
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    <Zap className="w-3 h-3 mr-1" />
                    AI-Powered Insights
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock Deep Insights from Any GitHub Repository
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Get comprehensive analysis, trending metrics, and actionable insights from open source repositories.
                    Track stars, pull requests, releases, and discover hidden gems in the GitHub ecosystem.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="h-12">
                    Start Analyzing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 bg-transparent">
                    View Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    Free tier available
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    No credit card required
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width="600"
                    height="400"
                    alt="Dandi Github Analyzer Dashboard"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Analyze GitHub Repositories
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From basic metrics to advanced insights, get a complete picture of any open source project.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Repository Summary</CardTitle>
                    <CardDescription>
                      Get comprehensive overviews including language breakdown, contributor activity, and project health
                      metrics.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Star className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Star Analytics</CardTitle>
                    <CardDescription>
                      Track star growth over time, identify trending periods, and compare against similar repositories.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <GitPullRequest className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Pull Request Insights</CardTitle>
                    <CardDescription>
                      Monitor important PRs, merge patterns, and contributor engagement with detailed analytics.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Cool Facts & Trends</CardTitle>
                    <CardDescription>
                      Discover interesting patterns, peak activity times, and unique characteristics of each repository.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Version Tracking</CardTitle>
                    <CardDescription>
                      Stay updated with latest releases, version history, and breaking changes across projects.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Community Analysis</CardTitle>
                    <CardDescription>
                      Understand contributor networks, community health, and collaboration patterns.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Pricing</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start free and scale as you grow. No hidden fees, no surprises.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-12 md:grid-cols-3 md:gap-8">
              {/* Free Tier */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-4xl font-bold">
                    $0<span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">5 repository analyses per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Basic insights and metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Star tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Community support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent" variant="outline">
                    Get Started Free
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Tier */}
              <Card className="relative border-primary">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Most Popular</Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>For serious developers and teams</CardDescription>
                  <div className="text-4xl font-bold">
                    $19<span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">100 repository analyses per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Advanced analytics and insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">PR and version tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Export reports (PDF, CSV)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Pro Trial</Button>
                </CardFooter>
              </Card>

              {/* Enterprise Tier */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large teams and organizations</CardDescription>
                  <div className="text-4xl font-bold">
                    $99<span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Unlimited repository analyses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Team collaboration features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Dedicated support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent" variant="outline">
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Discover GitHub Insights?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who use Dandi to make better decisions about open source projects.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 bg-transparent">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 Dandi Github Analyzer. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}
