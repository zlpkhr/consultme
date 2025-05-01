"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  const Benefits = () => {
    const benefits = [
      {
        title: "AI-Powered Analysis",
        description:
          "Advanced algorithms analyze your business to identify key pain points and growth opportunities.",
      },
      {
        title: "Market-Specific Solutions",
        description:
          "Customized strategies tailored to your local market conditions and target audience.",
      },
      {
        title: "Affordable Pricing",
        description:
          "Premium consulting at a fraction of traditional costs, making expert guidance accessible.",
      },
      {
        title: "Rapid Turnaround",
        description:
          "Get actionable insights and recommendations in days, not weeks or months.",
      },
      {
        title: "Implementation Support",
        description:
          "Practical guidance on executing strategies with your existing resources.",
      },
      {
        title: "Competitive Analysis",
        description:
          "Benchmark against competitors and identify your unique market advantages.",
      },
      {
        title: "Growth Forecasting",
        description:
          "Data-driven projections to help you plan and scale with confidence.",
      },
      {
        title: "Ongoing Optimization",
        description:
          "Continuous refinement of strategies based on real-world performance and feedback.",
      },
    ];

    return (
      <section aria-labelledby="benefits-title" className="mx-auto mt-44">
        <h2
          id="benefits-title"
          className="inline-block bg-gradient-to-t from-blue-900 to-blue-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-blue-50 dark:to-blue-300"
        >
          Why Choose ConsultMe
        </h2>
        <dl className="mt-8 grid grid-cols-4 gap-x-10 gap-y-8 sm:mt-12 sm:gap-y-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="col-span-4 sm:col-span-2 lg:col-span-1">
              <dt className="font-semibold text-gray-900 dark:text-gray-50">
                {benefit.title}
              </dt>
              <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                {benefit.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  };

  const Results = () => {
    const metrics = [
      { value: "68%", label: "Average Revenue Growth" },
      { value: "41%", label: "Cost Reduction" },
      { value: "3.2x", label: "Return on Investment" },
      { value: "87%", label: "Client Satisfaction" },
    ];

    return (
      <section aria-labelledby="results-title" className="mx-auto mt-40">
        <h2
          id="results-title"
          className="inline-block bg-gradient-to-t from-blue-900 to-blue-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-blue-50 dark:to-blue-300"
        >
          Real Results
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          Our AI-powered solutions consistently deliver measurable business
          impact
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {metric.value}
              </span>
              <span className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-labelledby="hero-title" className="animate-slide-up-fade">
        <Badge>About ConsultMe</Badge>
        <h1
          id="hero-title"
          className="mt-2 inline-block bg-gradient-to-br from-blue-900 to-blue-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-blue-50 dark:to-blue-300"
        >
          AI-Powered Consulting for Growing Businesses
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          Democratizing expert consulting for small and mid-sized businesses at
          an affordable price. Our AI agents analyze your business pain points
          and deliver tailored solutions optimized for your local market and
          audience—all for a fraction of traditional consulting costs.
        </p>
      </section>
      <Benefits />
      <Results />
      <section aria-labelledby="vision-title" className="mx-auto mt-40">
        <h2
          id="vision-title"
          className="inline-block bg-gradient-to-t from-blue-900 to-blue-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-blue-50 dark:to-blue-300"
        >
          Our Vision
        </h2>
        <div className="mt-6 max-w-prose space-y-4 text-gray-600 dark:text-gray-400">
          <p className="text-lg leading-8">
            We believe every business deserves access to world-class consulting.
            ConsultMe is breaking down barriers by combining cutting-edge AI
            with business expertise to deliver insights previously available
            only to enterprises with massive consulting budgets.
          </p>
          <p className="text-lg leading-8">
            Our platform processes vast amounts of market data, consumer trends,
            and business metrics to generate strategies that are both innovative
            and practical for your specific situation.
          </p>
          <p
            className={cn(
              "font-handwriting w-fit rotate-3 text-3xl text-indigo-600 dark:text-indigo-400"
            )}
          >
            – The ConsultMe Team
          </p>
        </div>
        <Button className="mt-32 h-10 w-full shadow-xl shadow-indigo-500/20">
          Analyze My Business
        </Button>
      </section>
    </div>
  );
}
