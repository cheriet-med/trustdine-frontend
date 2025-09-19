
// app/page.tsx or any component
import SubscriptionManager from '@/components/SubscriptionManager';

export default function HomePage() {
  // In a real app, you'd get this from your auth system
  const userEmail = "cheriet.imc@gmail.com";


  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My App</h1>
        <SubscriptionManager userEmail={userEmail} />
      </div>

    </div>
  );
}