import React from 'react';
import { NavItem, Service, Testimonial, ManagementProfile, JobOpening, CarouselSlide, Page, AdminStat, GuardProfile, AdminSection } from './types';

// SVG Icons
export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
export const UserCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
);
export const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="4" x2="9" y2="16"></line><line x1="15" y1="4" x2="15" y2="16"></line><line x1="4" y1="9" x2="16" y2="9"></line><line x1="4" y1="15" x2="16" y2="15"></line></svg>
);
export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
export const HandgunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6.5l-3.5 3.5M16 8l-8 8M12 6l-2 2M3 21l8-8M17 3l3 3M18 11l-2-2"></path></svg>
);
export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
);
export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="0" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
export const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="0" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);
export const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="0" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
export const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="0" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);
export const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
export const SirenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/><path d="m12 2 3.5 3.5-3.5 3.5-3.5-3.5L12 2Z"/><path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"/><path d="M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M4 4h.01"/><path d="M20 4h.01"/><path d="M4 20h.01"/><path d="M20 20h.01"/></svg>
);
export const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
);
export const RulerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 4V2"></path><path d="M12 22v-2"></path><path d="M12 14v-4"></path><path d="M4 12H2"></path><path d="M22 12h-2"></path><path d="M8 4V2"></path><path d="M20 8h2"></path><path d="M4 16H2"></path><path d="M8 22v-2"></path><path d="M20 16h2"></path></svg>
);

// New service icons
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
export const FactoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M17 18h1"></path><path d="M12 18h1"></path><path d="M7 18h1"></path></svg>
);
export const HeartPulseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l.7-1.5L11.5 14l1.8-3 2.2 4.5h5.12"></path></svg>
);
export const WarehouseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3 6.5l8-4.2a2 2 0 0 1 2 0l8 4.2a2 2 0 0 1 1 1.85Z"></path><path d="M22 22V11l-10-5.2L2 11v11"></path><path d="m6 18 6-3.3 6 3.3"></path><path d="M6 12v6"></path><path d="M18 12v6"></path></svg>
);
export const CarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><path d="M7 17h10"></path><path d="M5 11h14"></path><circle cx="7.5" cy="17.5" r="2.5"></circle><circle cx="16.5" cy="17.5" r="2.5"></circle></svg>
);
export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 1.9-1.9-1.9-1.9 1.9-1.9-1.9L2.5 5l-1.9 1.9L2.5 9l1.9 1.9L2.5 13l1.9 1.9-1.9 1.9 1.9 1.9 1.9-1.9 1.9 1.9 1.9-1.9 1.9 1.9 1.9-1.9 1.9 1.9-1.9 1.9 1.9-1.9 1.9 1.9 1.9-1.9 1.9 1.9-1.9 1.9 1.9 1.9Z"></path></svg>
);
export const HandIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path><path d="M10 9V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path><path d="M7 15a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"></path></svg>
);
export const CleaningMachineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 18V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M12 18v-6"/><path d="M12 8V6"/><circle cx="12" cy="12" r="4"/><path d="M8 12H6"/><path d="M18 12h-2"/></svg>
);
export const SprayCanIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 15h12M6.3 11.3l.5-2.6h10.4l.5 2.6M12 15V7.5M12 7.5S11 5 10 5s-2 1-2 2.5M12 7.5S13 5 14 5s2 1 2 2.5"></path><path d="M8 5s-1 0-1 1 1 1 1 1M16 5s1 0 1 1-1 1-1 1"></path></svg>
);

// Admin Dashboard Icons
export const LayoutDashboardIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
export const GraduationCapIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3.33 1.67 6.67 1.67 10 0v-5"></path></svg>;
export const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
export const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
export const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
export const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
export const FileCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
);
export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
export const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

// Navigation Data
export const NAV_LINKS: NavItem[] = [
  { label: 'Home', page: 'Home' },
  {
    label: 'About', page: 'About',
    subItems: [
      { label: 'Our Journey', page: 'About', subPageId: 'journey' },
      { label: 'Why Choose Us', page: 'About', subPageId: 'why-us' },
      { label: 'Our Management', page: 'About', subPageId: 'management' },
      { label: 'Our Clients', page: 'About', subPageId: 'clients' },
    ],
  },
  {
    label: 'Services', page: 'Services',
  },
  { label: 'Training', page: 'Training' },
  { label: 'Gallery', page: 'Gallery' },
  {
    label: 'Careers', page: 'Careers',
    subItems: [
      { label: 'Job Openings', page: 'Careers', subPageId: 'openings' },
      { label: 'Apply Now', page: 'Careers', subPageId: 'apply' },
    ],
  },
  { label: 'Contact Us', page: 'Contact' },
];

// Carousel Slides Data
export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    image: 'https://www.allsecureindia.com/wp-content/uploads/2025/05/security-guard-fan-control.gif',
    title: <>Unyielding <span className="text-accent-gold">Vigilance</span>, Day & Night</>,
    description: 'Our elite teams provide 24/7 surveillance and on-site presence, ensuring your assets are always secure.',
    ctaText: 'Contact Us',
    ctaPage: 'Contact',
  },
  {
    image: 'https://content.jdmagicbox.com/comp/guntur/l7/9999px863.x863.220810192646.h8l7/catalogue/sri-sai-krishna-security-services-pvt-ltd-kothapet-guntur-security-services-n6gciuv1nm.jpg',
    title: <>Close Protection <span className="text-accent-gold">Redefined</span></>,
    description: 'Discreet, professional, and highly trained bodyguards for executives, dignitaries, and high-profile individuals.',
    ctaText: 'Contact Us',
    ctaPage: 'Contact',
  },
  {
    image: 'https://agssecurity.in/images/hero-bg.jpg',
    title: <>Securing Tomorrow's <span className="text-accent-gold">Events</span></>,
    description: 'From corporate functions to large-scale public gatherings, our crowd control and event security is second to none.',
    ctaText: 'Contact Us',
    ctaPage: 'Contact',
  },
];


// Services Data
export const SERVICES_DATA: Service[] = [
    {
        id: 'on-site-guarding',
        title: '24/7 On-site Guarding',
        description: 'Constant presence to deter threats and ensure immediate response around the clock.',
        details: [
            'Uniformed or plain-clothed officers',
            'Regular patrols of premises',
            'Deterrent against theft and vandalism',
            'Immediate handling of security incidents'
        ],
        icon: ShieldCheckIcon,
        image: 'https://picsum.photos/seed/private-security/1200/800',
    },
    {
        id: 'mobile-patrols',
        title: 'Mobile Patrols & Surveillance',
        description: 'Regular and random patrols to monitor large areas and maintain a visible security presence.',
        details: [
            'Marked and unmarked patrol vehicles',
            'Randomized patrol schedules',
            'Perimeter checks and lock-up services',
            'Advanced GPS tracking and reporting'
        ],
        icon: EyeIcon,
        image: 'https://picsum.photos/seed/mobile-patrols/1200/800',
    },
    {
        id: 'access-control',
        title: 'Access Control & Monitoring',
        description: 'Secure entry points and verify credentials to prevent any unauthorized access.',
        details: [
            'Manned reception and gatehouse security',
            'Visitor and employee credential verification',
            'CCTV monitoring and operation',
            'Integration with electronic security systems'
        ],
        icon: LockIcon,
        image: 'https://picsum.photos/seed/access-control/1200/800',
    },
    {
        id: 'alarm-response',
        title: 'Alarm Response Services',
        description: 'Rapid deployment of trained officers to investigate and manage alarm activations promptly.',
        details: [
            '24/7 alarm monitoring and response',
            'Fast dispatch of mobile patrol units',
            'Coordination with law enforcement',
            'Detailed incident reports after each activation'
        ],
        icon: SirenIcon,
        image: 'https://picsum.photos/seed/alarm-response/1200/800',
    },
];

// Management Profiles Data
export const MANAGEMENT_PROFILES: ManagementProfile[] = [
    {
        name: 'Johnathan Cole',
        title: 'Founder & CEO',
        bio: 'With over 20 years in law enforcement and private security, Johnathan founded Shield Agency with a mission to provide unparalleled safety and peace of mind.',
        image: 'https://picsum.photos/seed/ceo/400/400',
    },
    {
        name: 'Maria Rodriguez',
        title: 'Director of Operations',
        bio: 'Maria orchestrates all field operations, ensuring every client receives the highest standard of service. Her logistical expertise is the backbone of our reliability.',
        image: 'https://picsum.photos/seed/director/400/400',
    },
    {
        name: 'David Chen',
        title: 'Head of Training',
        bio: 'A former special forces instructor, David has developed our industry-leading training program, shaping the most capable security professionals in the field.',
        image: 'https://picsum.photos/seed/trainer/400/400',
    },
];

// Testimonials Data
export const TESTIMONIALS: Testimonial[] = [
    {
        quote: 'Shield Agency has been an invaluable partner for our corporate events. Their professionalism and attention to detail are second to none. We feel completely secure with them on site.',
        name: 'Sarah Jenkins',
        company: 'Global Events Corp.',
        image: 'https://picsum.photos/seed/client1/100/100',
    },
    {
        quote: 'The personal protection detail for our CEO was flawless. Discreet, efficient, and incredibly professional. I highly recommend Shield Agency for any executive security needs.',
        name: 'Mark Thompson',
        company: 'Innovatech Inc.',
        image: 'https://picsum.photos/seed/client2/100/100',
    },
    {
        quote: 'Switching to Shield Agency for our facility management and security has streamlined our operations and improved safety significantly. Their integrated approach is a game-changer.',
        name: 'Emily White',
        company: 'Pinnacle Properties',
        image: 'https://picsum.photos/seed/client3/100/100',
    },
];

// Job Openings Data
export const JOB_OPENINGS: JobOpening[] = [
    {
        title: 'Unarmed Security Officer',
        location: 'New York, NY',
        type: 'Full-time',
        description: [
            'Monitor and patrol premises to prevent and detect signs of intrusion.',
            'Control access points and authorize entrance and departure of employees and visitors.',
            'Write detailed reports on daily activities and irregularities.',
            'Possess a valid state security license and excellent communication skills.'
        ]
    },
    {
        title: 'Armed Security Guard',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        description: [
            'Provide armed security for high-value assets and facilities.',
            'Respond to alarms and emergency situations with professionalism.',
            'Maintain a high level of proficiency with firearms and security equipment.',
            'Requires valid armed guard license, clean background check, and 3+ years experience.'
        ]
    },
    {
        title: 'Event Bouncer / Crowd Control',
        location: 'Miami, FL',
        type: 'Part-time / Contract',
        description: [
            'Ensure the safety and security of guests at events, nightclubs, and concerts.',
            'Manage crowd flow, check IDs, and de-escalate potential conflicts.',
            'Excellent interpersonal skills and a calm demeanor under pressure are essential.',
            'Previous experience in event security or crowd management preferred.'
        ]
    },
];

// New Detailed Services Data
export const SECURITY_SERVICES = [
    {
        icon: UserCheckIcon,
        title: 'Personal Security',
        description: 'Discreet and professional close protection for individuals, executives, and high-profile persons.'
    },
    {
        icon: HomeIcon,
        title: 'Residential Security',
        description: 'Comprehensive security solutions to protect your home and family, ensuring peace of mind.'
    },
    {
        icon: BuildingIcon,
        title: 'Commercial Security',
        description: 'Tailored security for offices, retail spaces, and corporate campuses to protect assets and personnel.'
    },
    {
        icon: FactoryIcon,
        title: 'Industrial Security',
        description: 'Specialized security for manufacturing plants and industrial sites to prevent theft and ensure operational safety.'
    },
    {
        icon: HeartPulseIcon,
        title: 'Hospital Security',
        description: 'Sensitive security services to maintain a safe and secure environment for patients, staff, and visitors.'
    },
    {
        icon: WarehouseIcon,
        title: 'Warehouse Security',
        description: 'Robust security measures to protect inventory and logistics operations from internal and external threats.'
    },
    {
        icon: UsersIcon,
        title: 'Event Management Security',
        description: 'Expert crowd control and security management for events of all sizes, from corporate functions to public gatherings.'
    },
    {
        icon: CarIcon,
        title: 'Parking Security',
        description: 'Patrols and surveillance to ensure the safety of vehicles and patrons in parking structures and lots.'
    },
    {
        icon: ShieldCheckIcon,
        title: 'Bouncer Services',
        description: 'Professional, trained bouncers to maintain order and safety at venues like nightclubs, bars, and private parties.'
    }
];

export const HOUSEKEEPING_SERVICES = [
    {
        icon: SparklesIcon,
        title: 'One-time Cleaning',
        description: 'A thorough, single-session cleaning service perfect for special occasions or moving in/out.'
    },
    {
        icon: HandIcon,
        title: 'Manual Cleaning',
        description: 'Detailed and meticulous cleaning by our trained staff for areas requiring a personal touch.'
    },
    {
        icon: CleaningMachineIcon,
        title: 'Mechanized Cleaning',
        description: 'Efficient and deep cleaning for large areas using modern, high-performance cleaning equipment.'
    },
    {
        icon: SprayCanIcon,
        title: 'Deep Cleaning',
        description: 'An intensive, top-to-bottom cleaning service that targets deep-seated grime and sanitizes your space.'
    }
];

// Recruitment Steps Data
export const RECRUITMENT_STEPS = [
    {
        title: 'Selection',
        description: 'Branch recruits personnel based on strict parameters including education, age, physical fitness, language proficiency, and background.',
        icon: UserPlusIcon,
    },
    {
        title: 'Qualification Requirements',
        description: [
            'Priority to 10th pass for Security Guard',
            'Priority to 12th to Graduates for Supervisor/Inspector',
            'Advantages for Home Guards, Civil Defense, Ex-Service Men',
            'Candidates with prior security experience preferred',
        ],
        icon: GraduationCapIcon,
    },
    {
        title: 'Physical Standards',
        description: [
            'Height: above 5\'7"',
            'Weight: 65–75 kg',
            'Chest: 36"–40" minimum',
        ],
        icon: RulerIcon,
    },
    {
        title: 'Background Verification',
        description: [
            'Complete family background check',
            'Recruits are taken through references only',
        ],
        icon: ShieldCheckIcon,
    },
    {
        title: 'Document Verification',
        description: [
            'Birth Proof: School Leaving Certificate, SSLC Mark Sheet, Birth Certificate / Affidavit',
            'ID Proof: Driving License / Voter ID / PAN / Aadhar / Student ID',
            'Address Proof: Aadhar / Ration Card / Voter ID / Bank Passbook',
        ],
        icon: FileCheckIcon,
    },
    {
        title: 'Training & Discipline',
        description: [
            'Well-trained & disciplined behavior',
            'Professionally mannered & properly dressed',
            'Capable in Self-Defense & Fire Fighting',
            'Basic First Aid knowledge',
            'Good morals & ethics',
        ],
        icon: AwardIcon,
    }
];


// --- ADMIN DASHBOARD DATA ---

export const ADMIN_SIDEBAR_LINKS: { label: AdminSection; icon: React.ElementType }[] = [
    { label: 'Dashboard', icon: LayoutDashboardIcon },
    { label: 'Guards', icon: UsersIcon },
    { label: 'Training', icon: GraduationCapIcon },
    { label: 'Customers', icon: BriefcaseIcon },
    { label: 'Certifications', icon: AwardIcon },
    { label: 'Gallery', icon: ImageIcon },
    { label: 'Applications', icon: FileTextIcon },
    { label: 'Enquiries', icon: MailIcon },
];

// Static data removed - all dashboard data is now fetched dynamically from the API
// ADMIN_STATS and GUARD_PROFILES are no longer used as data is fetched from backend