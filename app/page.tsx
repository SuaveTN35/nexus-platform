import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-bold text-primary-900 mb-6">
                NEXUS Platform
              </h1>
              <p className="text-2xl text-primary-700 mb-8">
                Next-Generation AI-Native Business Intelligence Platform
              </p>
              <p className="text-lg text-primary-600 mb-12 max-w-2xl mx-auto">
                Built to outperform GoHighLevel through superior architecture, predictive intelligence,
                and autonomous operations. Experience the future of business management.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/auth/register">
                  <Button variant="primary" size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-primary-900 mb-4">
                Why Choose NEXUS?
              </h2>
              <p className="text-xl text-primary-600 max-w-2xl mx-auto">
                Built from the ground up with AI at its core
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card padding="lg" hover>
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">AI-Native</h3>
                <p className="text-primary-600">
                  Unlike competitors who add AI as an afterthought, NEXUS is built with AI agents at the core
                  of every feature. Intelligent automation from day one.
                </p>
              </Card>

              <Card padding="lg" hover>
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">Predictive Intelligence</h3>
                <p className="text-primary-600">
                  Don't just see what happened—predict what will happen. Our platform anticipates your needs
                  and suggests actions before you ask.
                </p>
              </Card>

              <Card padding="lg" hover>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">Autonomous Operations</h3>
                <p className="text-primary-600">
                  The platform learns and optimizes itself over time. Less manual work, more intelligent
                  automation that adapts to your business.
                </p>
              </Card>

              <Card padding="lg" hover>
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">Industry Modules</h3>
                <p className="text-primary-600">
                  Tailored solutions for Real Estate, Service Businesses, and Agencies. Deep domain expertise
                  built into every module.
                </p>
              </Card>

              <Card padding="lg" hover>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">Real-Time Intelligence</h3>
                <p className="text-primary-600">
                  Live business insights, not just historical reports. Make decisions with real-time data
                  and predictive analytics.
                </p>
              </Card>

              <Card padding="lg" hover>
                <div className="text-4xl mb-4">🔌</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">Open Architecture</h3>
                <p className="text-primary-600">
                  API-first design, extensible, integratable. Build what you need, integrate with what you
                  have. Complete flexibility.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
              Join the future of business intelligence. Get started today.
            </p>
            <Link href="/auth/register">
              <Button variant="secondary" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
