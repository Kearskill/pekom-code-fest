import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 font-medium transition-all hover:scale-105"
    >
      <Languages className="h-4 w-4" />
      <span>{language === 'en' ? 'EN' : 'MY'}</span>
    </Button>
  );
};
