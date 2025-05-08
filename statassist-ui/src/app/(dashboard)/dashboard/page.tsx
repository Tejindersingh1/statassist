import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sigma, FileText } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

const quickActions = [
  {
    icon: PlusCircle,
    label: 'New study',
    desc: 'Start designing a study from scratch',
    href: '/studies/new',
  },
  {
    icon: Sigma,
    label: 'Power calc',
    desc: 'Estimate sample size & power',
    href: '/tools/power',
  },
  {
    icon: FileText,
    label: 'Templates',
    desc: 'SAP & consent templates',
    href: '/resources',
  },
];

async function getRecentStudies() {
  // TODO replace with real fetch
  return [
    { id: 1, title: 'Study A', type: 'Observational', status: 'active', updated: '2 d' },
    { id: 2, title: 'Study B', type: 'Clinical Trial', status: 'draft', updated: '5 d' },
  ];
}

export default async function DashboardPage() {
  const studies = await getRecentStudies();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-brand-50 to-white p-10 text-center">
        <h1 className="mb-3 text-hero font-semibold">
          Design clinical studies without the hassle
        </h1>
        <p className="mx-auto mb-6 max-w-xl text-lg text-muted-foreground">
          Quickly create, manage, and analyze your research
        </p>
        <Button size="lg" asChild>
          <a href="/studies/new" className="px-8">
            New Study
          </a>
        </Button>
      </section>

      {/* Quick actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Quick actions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {quickActions.map((a) => (
            <div key={a.href}>
              <Card
                className="hover:shadow-lg transition motion-safe:hover:-translate-y-0.5"
              >
                <a href={a.href}>
                  <CardHeader className="flex items-center gap-4">
                    <a.icon className="h-6 w-6 text-brand-600" />
                    <div>
                      <CardTitle className="text-base">{a.label}</CardTitle>
                      <CardDescription>{a.desc}</CardDescription>
                    </div>
                  </CardHeader>
                </a>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Recent studies */}
      <section className="space-y-4" id="recent">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Studies</h2>
          {studies.length > 0 && (
            <a
              href="/studies"
              className="text-sm text-brand-600 hover:underline"
            >
              View all&nbsp;»
            </a>
          )}
        </div>

        {studies.length === 0 ? (
          <EmptyState
            title="You have no studies yet"
            ctaText="Create your first study"
            ctaHref="/studies/new"
          />
        ) : (
          <div className="divide-y rounded-xl border">
            {studies.map((s) => (
              <a
                key={s.id}
                href={`/studies/${s.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 motion-safe:hover:-translate-y-0.5"
              >
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.type}</p>
                </div>
                <div className="flex items-center gap-6">
                  <StatusBadge status={s.status as any} />
                  <span className="text-sm text-muted-foreground">
                    {s.updated} ago
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

