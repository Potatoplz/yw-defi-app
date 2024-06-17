// Global layout for all pages
import '../styles/globals.css';
import { RecoilRoot } from 'recoil';
import BasicLayout from '../components/BasicLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <BasicLayout>{children}</BasicLayout>
        </RecoilRoot>
      </body>
    </html>
  );
}