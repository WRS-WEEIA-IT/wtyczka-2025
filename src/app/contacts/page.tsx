"use client";

import { useState, useEffect } from 'react';
import { Lock, ArrowRight } from "lucide-react";
// Blokada widoczności strony kontaktowej na podstawie daty
function isContactOpen() {
  if (typeof window === 'undefined') return true;
  const openDateStr = process.env.NEXT_PUBLIC_CONTACT_DATE;
  if (!openDateStr) return true;
  const now = new Date();
  const openDate = new Date(openDateStr);
  return now >= openDate;
}
import { getTeamMembers, TeamMember } from '@/usecases/team-members';
import TeamMemberCard from '@/components/TeamMemberCard';
import styles from './contacts.module.css';
import './team-animations.css';
import './carousel-dots.css';
import './contacts-background.css';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function ContactsPage() {
  const [isContactVisible, setIsContactVisible] = useState(true);
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    // Sprawdź widoczność kontaktów po stronie klienta
    const openDateStr = process.env.NEXT_PUBLIC_CONTACT_DATE;
    if (openDateStr) {
      const now = new Date();
      const openDate = new Date(openDateStr);
      setIsContactVisible(now >= openDate);
    } else {
      setIsContactVisible(true);
    }
  }, []);

  // Stan do karuzeli
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Pobierz członków zespołu po zamontowaniu
    setTeamMembers(getTeamMembers());
  }, []);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.scrollTo(0);
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
    // Autoplay
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    const handleUserInteraction = () => clearInterval(autoplayInterval);
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    return () => {
      clearInterval(autoplayInterval);
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [api]);

  if (!isMounted) return null;
  if (!isContactVisible) {
    return (
      <div className={styles.contactsContainer}>
        <div className="pageOverlay"></div>
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', minHeight: '60vh',
            background: 'rgba(24,24,27,0.95)', borderRadius: '2rem', padding: '3rem', margin: '2rem auto', maxWidth: 600, boxShadow: '0 0 32px #0008',
          }}
        >
          <h1
            className="text-4xl font-bold text-amber-400 mb-10"
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            Kadra zostanie ujawniona wkrótce
          </h1>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <p
              className="text-lg text-gray-300"
              style={{
                textAlign: 'center',
                lineHeight: 2.1,
                margin: 0,
                width: '100%',
                letterSpacing: '0.01em',
              }}
            >
              Chciałbyś wiedzieć, kto jest w kadrze wyjazdu?<br/>
              Nazwiska i sylwetki kadrowiczów zostaną opublikowane już niedługo!
            </p>
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <span className="text-gray-400 text-base">
              Śledź nasze <a href="/news" className="text-amber-400 underline hover:text-amber-300">aktualności</a> oraz social media,<br></br>aby być na bieżąco.
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.contactsContainer}>
      <div className="pageOverlay"></div>
      <h1 className={`${styles.pageTitle} fadeIn`}>Kadra Wyjazdu</h1>
      <p className={`${styles.pageDescription} fadeIn`} style={{ animationDelay: '0.2s' }}>
        Poznaj osoby organizujące obóz adaptacyjny Wtyczka 2025. W razie pytań możesz się z nami skontaktować bezpośrednio poprzez email lub Facebook.
      </p>

      <div className={styles.carouselContainer}>
        {/* Carousel for all devices showing 3 cards at once on desktop */}
        <Carousel 
          className="w-full mx-auto"
          opts={{
            align: "center",
            loop: true,
            dragFree: true,
            containScroll: "trimSnaps",
            skipSnaps: false,
          }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-4">
            {teamMembers.map((member: TeamMember) => (
              <CarouselItem 
                key={member.id} 
                className="pl-4 basis-full xs:basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
              >
                <div className="h-full">
                  <TeamMemberCard member={member} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Wskaźnik pozycji (kropki) */}
          <div className="carouselDots mb-4">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`carouselDot ${current === index ? 'carouselDotActive' : ''}`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Przejdź do slajdu ${index + 1} z ${count}`}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8 gap-24">
            <CarouselPrevious className={`${styles.carouselArrow}`} />
            <CarouselNext className={`${styles.carouselArrow}`} />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
