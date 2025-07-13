
'use client';

import { Button } from "./ui/button";

export function AIPoweredInsights() {
  return (
    <div className="p-4 sm:p-6 rounded-lg text-center bg-gradient-to-br from-primary via-purple-600 to-indigo-600 text-primary-foreground">
      <h3 className="text-lg sm:text-xl font-bold">AI-Powered Insights</h3>
      <p className="mt-2 text-xs sm:text-sm opacity-90">
        Get automated analysis powered by Gemini AI
      </p>
      <Button variant="secondary" className="mt-4 bg-white/90 hover:bg-white text-primary font-semibold text-sm">
        Learn More
      </Button>
    </div>
  );
}
