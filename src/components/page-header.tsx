import { Lightbulb } from 'lucide-react';

export function PageHeader() {
  return (
    <header className="bg-primary text-primary-foreground py-6 px-4 md:px-6 print-hidden shadow-md">
      <div className="container mx-auto flex items-center gap-4">
        <Lightbulb className="h-10 w-10" />
        <h1 className="text-4xl font-bold tracking-tight">4Csight</h1>
      </div>
    </header>
  );
}
