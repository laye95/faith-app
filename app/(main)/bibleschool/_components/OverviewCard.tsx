import { Card } from '@/components/ui/Card';

interface OverviewCardProps {
  children: React.ReactNode;
  className?: string;
}

export function OverviewCard({ children, className }: OverviewCardProps) {
  return <Card className={className}>{children}</Card>;
}

const __expoRouterPrivateRoute_OverviewCard = () => null;

export default __expoRouterPrivateRoute_OverviewCard;
