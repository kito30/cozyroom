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
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
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
              title="Have Fun with Friends"
              description="Connect, share, and create unforgettable memories with your squad in your own cozy space."
              icon={<UserGroupIcon className="w-6 h-6" />}
            />
            <FeatureCard
              accentColor="blue"
              title="Realtime Chat"
              description="Instant messaging that keeps you connected. Chat, react, and vibe together in real-time."
              icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
            />
            <FeatureCard
              accentColor="indigo"
              title="Anime & Memes"
              description="Share your favorite anime moments and dank memes. Express yourself with the culture you love."
              icon={<span className="text-2xl font-bold m-2">UwU</span>}
            />
          </FeatureGrid>
        </div>
      </div>

      {/* Stats */}
      <StatsSection
        stats={[
          { value: '200%', label: 'Uptime', gradient: 'from-emerald-400 to-teal-400' },
          { value: '58/7', label: 'Support', gradient: 'from-blue-400 to-indigo-400' },
          { value: 'Not Secure', label: 'Authentication', gradient: 'from-indigo-400 to-purple-400' },
          { value: 'Mid', label: 'Response Time', gradient: 'from-purple-400 to-pink-400' },
        ]}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
