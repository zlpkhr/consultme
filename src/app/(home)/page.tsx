"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  const Benefits = () => {
    const benefits = [
      {
        title: "Top University Partnerships",
        description:
          "Connect with premier institutions worldwide for an unparalleled academic experience.",
      },
      {
        title: "Personalized Counseling",
        description:
          "Receive one-on-one guidance tailored to your educational and career goals.",
      },
      {
        title: "Scholarship & Financial Aid",
        description:
          "Access exclusive scholarships and financial support to ease your study abroad journey.",
      },
      {
        title: "Visa & Application Assistance",
        description:
          "Enjoy seamless support through every step of your application and visa process.",
      },
      {
        title: "Cultural Immersion",
        description:
          "Experience new cultures and broaden your global perspective.",
      },
      {
        title: "Career Advancement",
        description:
          "Unlock internship and networking opportunities to boost your future.",
      },
      {
        title: "Language Support",
        description:
          "Enhance your language skills with tailored coaching programs.",
      },
      {
        title: "Pre-departure Orientation",
        description:
          "Prepare confidently for your new life abroad with our comprehensive guidance.",
      },
    ];

    return (
      <section aria-labelledby="benefits-title" className="mx-auto mt-44">
        <h2
          id="benefits-title"
          className="inline-block bg-gradient-to-t from-blue-900 to-blue-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-blue-50 dark:to-blue-300"
        >
          Why Choose WAYIN
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

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-labelledby="hero-title" className="animate-slide-up-fade">
        <Badge>About WAYIN</Badge>
        <h1
          id="hero-title"
          className="mt-2 inline-block bg-gradient-to-br from-blue-900 to-blue-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-blue-50 dark:to-blue-300"
        >
          Empowering Your Global Education Journey
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          We connect ambitious students with international study opportunities.
          Discover programs tailored to your dreams, supported by expert
          guidance every step of the way.
        </p>
      </section>
      <Benefits />
      <section aria-labelledby="vision-title" className="mx-auto mt-40">
        <h2
          id="vision-title"
          className="inline-block bg-gradient-to-t from-blue-900 to-blue-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-blue-50 dark:to-blue-300"
        >
          Our Vision
        </h2>
        <div className="mt-6 max-w-prose space-y-4 text-gray-600 dark:text-gray-400">
          <p className="text-lg leading-8">
            We envision a world where education knows no borders. WAYIN is
            dedicated to breaking down barriers and creating accessible pathways
            for every student to achieve their academic dreams abroad.
          </p>
          <p className="text-lg leading-8">
            With innovative solutions and personalized support, we empower you
            to navigate the challenges of studying internationally with
            confidence.
          </p>
          <p
            className={cn(
              "font-handwriting w-fit rotate-3 text-3xl text-indigo-600 dark:text-indigo-400"
            )}
          >
            – The WAYIN Team
          </p>
        </div>
        <Button className="mt-32 h-10 w-full shadow-xl shadow-indigo-500/20">
          Explore Programs
        </Button>
      </section>
    </div>
  );
}
