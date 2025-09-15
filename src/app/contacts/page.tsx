"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTeamMembers, TeamMember } from '@/usecases/team-members';
import TeamMemberCard from '@/components/TeamMemberCard';
import styles from './contacts.module.css';
import './team-animations.css';
import './carousel-dots.css';
import './contacts-background.css';
import { Mail, Facebook } from 'lucide-react';
import Image from 'next/image';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function ContactsPage() {
  const { t } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Get the team members when the component mounts
    const members = getTeamMembers();
    setTeamMembers(members);
    
    // Automatyczne przewijanie strony w dół po załadowaniu
    setTimeout(() => {
      window.scrollTo({
        top: 200,
        behavior: 'smooth'
      });
    }, 500);
  }, []);
  
  useEffect(() => {
    if (!api) {
      return;
    }
 
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    
    // Upewnij się, że karuzela startuje od pierwszego kadrowicza (id=1)
    api.scrollTo(0);
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    // Automatyczne przewijanie karuzeli co 5 sekund
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    // Zatrzymaj automatyczne przewijanie przy interakcji użytkownika
    const handleUserInteraction = () => {
      clearInterval(autoplayInterval);
    };
    
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    
    // Usuń nasłuchiwanie eventów przy odmontowaniu komponentu
    return () => {
      clearInterval(autoplayInterval);
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [api]);

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
            {teamMembers.map((member) => (
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
