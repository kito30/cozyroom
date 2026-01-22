import {
  AnimatedBackground,
  BrandBadge,
  CTAButton,
  FeatureCard,
  FeatureGrid,
  Footer,
  HeroSection,
  StatsSection,
} from '@/src/components/landing';
import { 
  LockClosedIcon, 
  BoltIcon, 
  HandThumbUpIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <AnimatedBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Brand Badge */}
          <div className="flex justify-center mb-12 animate-fade-in">
            <BrandBadge />
          </div>

          {/* Hero */}
          <HeroSection
            title="Your Personal"
            subtitle="Cozy Space"
            description="A modern, secure platform designed for meaningful connections and seamless experiences. Join CozyRoom today and discover your perfect digital sanctuary."
          >
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <CTAButton 
                href="/register" 
                variant="primary"
                icon={<ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                Get Started
              </CTAButton>
              <CTAButton href="/login" variant="secondary">
                Sign In
              </CTAButton>
            </div>
          </HeroSection>

          {/* Features */}
          <FeatureGrid>
            <FeatureCard
              accentColor="emerald"
              title="Secure & Private"
              description="Your data is protected with industry-standard encryption and security practices."
              icon={<LockClosedIcon className="w-6 h-6" />}
            />
            <FeatureCard
              accentColor="blue"
              title="Lightning Fast"
              description="Built with modern technologies for optimal performance and instant responses."
              icon={<BoltIcon className="w-6 h-6" />}
            />
            <FeatureCard
              accentColor="indigo"
              title="User Friendly"
              description="Intuitive interface designed with you in mind for effortless navigation."
              icon={<HandThumbUpIcon className="w-6 h-6" />}
            />
          </FeatureGrid>
        </div>
      </div>

      {/* Stats */}
      <StatsSection
        stats={[
          { value: '99.9%', label: 'Uptime', gradient: 'from-emerald-400 to-teal-400' },
          { value: '24/7', label: 'Support', gradient: 'from-blue-400 to-indigo-400' },
          { value: 'Secure', label: 'Authentication', gradient: 'from-indigo-400 to-purple-400' },
          { value: 'Fast', label: 'Response Time', gradient: 'from-purple-400 to-pink-400' },
        ]}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
