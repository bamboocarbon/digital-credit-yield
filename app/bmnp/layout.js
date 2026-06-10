import { redirect } from 'next/navigation';
import { BMNP_ENABLED } from '@/lib/constants';

export default function BmnpLayout({ children }) {
  if (!BMNP_ENABLED) redirect('/');
  return children;
}
