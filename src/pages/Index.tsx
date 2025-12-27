import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Wrench, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: <Wrench className="h-6 w-6" />,
      title: 'Equipment Tracking',
      description: 'Monitor and maintain all your equipment in one place',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Role-Based Access',
      description: 'Users, Technicians, and Managers with tailored dashboards',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Real-Time Analytics',
      description: 'Track performance metrics and maintenance trends',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.05),transparent_50%)]" />
        
        <div className="container relative mx-auto px-4 py-20 sm:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Logo */}
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-glow animate-fade-in">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>

            {/* Title */}
            <div className="space-y-4 max-w-3xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Smart Equipment
                <span className="block text-primary">Maintenance Management</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                GearGuard connects Users, Technicians, and Managers to efficiently track and resolve equipment maintenance requests.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button size="lg" onClick={() => navigate('/auth')} className="px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete solution for managing equipment maintenance across your organization
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative group rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-slide-up"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why Choose GearGuard?</h2>
              <ul className="space-y-4">
                {[
                  'Streamlined maintenance request workflow',
                  'Real-time status updates and notifications',
                  'Comprehensive analytics and reporting',
                  'Role-based access control for security',
                  'Integrated with your existing tools',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-status-repaired shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate('/auth')} className="mt-4">
                Start Managing Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center">
                <div className="text-center p-8">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold">Enterprise-Ready</p>
                  <p className="text-muted-foreground">Secure & Scalable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">GearGuard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GearGuard. Smart Equipment Maintenance Management.
          </p>
        </div>
      </footer>
    </div>
  );
}
