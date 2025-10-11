'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Mail, Facebook } from 'lucide-react'
import { TeamMember as TeamMemberType } from '@/usecases/team-members'
// All styles are now consolidated in app/css

interface TeamMemberCardProps {
  member: TeamMemberType
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Kopiowanie maila do schowka i toast
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(member.email)
      toast.success('Skopiowano mail do schowka!')
    } catch {
      toast.error('Nie udało się skopiować maila')
    }
  }

  return (
    <div
      className="memberCard fadeInStaggered"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`avatarContainer ${isHovered ? 'avatarPulse' : ''} glowOnHover`}
      >
        <Image
          src={member.photoUrl}
          alt={member.name}
          width={250}
          height={250}
          style={{ objectFit: 'cover', display: 'block', overflow: 'hidden', width: '250px', height: '250px' }}
          className={
            isHovered
              ? 'scale-105 transition-transform duration-300'
              : 'transition-transform duration-300'
          }
        />
      </div>
      <h2 className="memberName">
        {(() => {
          const [first, ...rest] = member.name.split(' ')
          return (
            <>
              {first}
              <br />
              {rest.join(' ')}
            </>
          )
        })()}
      </h2>
      {member.role && <p className="memberRole">{member.role}</p>}
      <div style={{ flexGrow: 1 }} />
      <div className="contactBottom">
        <a href={`mailto:${member.email}`} className="memberContact">
          <Mail size={16} className={isHovered ? 'animate-bounce' : ''} />
          <span
            className="emailLink"
            style={{ cursor: 'pointer' }}
            title="Kliknij, aby skopiować mail"
            onClick={handleCopyEmail}
          >
            Skopiuj adres email
          </span>
        </a>
        <div className="socialLinks">
          <a
            href={member.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="facebookLink"
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
    </div>
  )
}
