"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Facebook } from 'lucide-react';
import { TeamMember as TeamMemberType } from '@/usecases/team-members';
import styles from '@/app/contacts/contacts.module.css';
import '@/app/contacts/team-animations.css';

interface TeamMemberCardProps {
  member: TeamMemberType;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`${styles.memberCard} fadeInStaggered`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${styles.avatarContainer} ${isHovered ? 'avatarPulse' : ''} glowOnHover`}>
        <Image
          src={member.photoUrl}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className={isHovered ? 'scale-105 transition-transform duration-300' : 'transition-transform duration-300'}
        />
      </div>
      <h2 className={styles.memberName}>{member.name}</h2>
      {member.role && <p className={styles.memberRole}>{member.role}</p>}
      
      <a href={`mailto:${member.email}`} className={styles.memberContact}>
        <Mail size={16} className={isHovered ? 'animate-bounce' : ''} />
        <span className={styles.emailLink}>{member.email}</span>
      </a>
      
      <div className={styles.socialLinks}>
        <a 
          href={member.facebookUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className={styles.facebookLink}
        >
          <Facebook 
            size={20} 
            className={isHovered ? 'animate-pulse' : ''} 
            color={isHovered ? '#ffffff' : '#E7A801'} 
          />
          <span style={{ fontWeight: 500 }}>Facebook</span>
        </a>
      </div>
    </div>
  );
}