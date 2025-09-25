import './globals.css';
import { SidebarProvider } from '../context/SidebarContext';

export const metadata = {
  title: 'Nigeria Biodiversity Compendium',
  description: 'A comprehensive database of Nigeria\'s biodiversity',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
