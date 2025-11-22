import { getTimerConfig, timerConfigs } from "@/lib/timerConfigs";
import { TimerPageContent } from "@/components/TimerPageContent";
import { Metadata } from "next";
import Link from "next/link";

export function generateStaticParams() {
  return timerConfigs.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getTimerConfig(slug);

  if (!config) {
    return {
      title: "Timer Not Found – TimersOnly",
    };
  }

  return {
    title: `${config.label} – TimersOnly`,
    description: config.description,
    openGraph: {
      title: `${config.label} – TimersOnly`,
      description: config.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${config.label} – TimersOnly`,
      description: config.description,
    },
  };
}

export default async function TimerPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const config = getTimerConfig(slug);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center space-y-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Timer not found
          </h1>
          <Link
            href="/"
            className="text-sm underline opacity-70 hover:opacity-100"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return <TimerPageContent config={config} />;
}
