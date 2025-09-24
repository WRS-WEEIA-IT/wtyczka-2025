/**
 * Western-themed shooting animation utility
 * This utility provides functions for creating bullet hole and gunshot flash effects
 */

// Create a bullet hole at the specified position
export const createBulletHole = (x: number, y: number): HTMLElement => {
  // Create bullet hole element
  const bulletHole = document.createElement('div')
  bulletHole.className = 'bullet-hole'
  bulletHole.style.left = `${x - 10}px`
  bulletHole.style.top = `${y - 10}px`
  document.body.appendChild(bulletHole)

  // Remove the bullet hole after animation completes (for cleanup)
  setTimeout(() => {
    bulletHole.remove()
  }, 5000)

  return bulletHole
}

// Create a gunshot flash effect
export const createGunshotFlash = (): HTMLElement => {
  // Create gunshot flash overlay
  const gunshotFlash = document.createElement('div')
  gunshotFlash.className = 'gunshot-flash'
  document.body.appendChild(gunshotFlash)

  // Play gunshot sound
  const gunshotSound = new Audio('/western/gunshot.mp3')
  gunshotSound.volume = 0.3
  gunshotSound.play().catch((e) => console.log('Audio playback error:', e))

  // Remove the flash effect after animation completes
  setTimeout(() => {
    gunshotFlash.remove()
  }, 150)

  return gunshotFlash
}

// Handle navigation with shooting delay
// Type for Next.js router object with push method
interface RouterWithPush {
  push: (url: string) => Promise<boolean>
}

export const handleWesternNavigation = (
  e: React.MouseEvent,
  href: string,
  router: RouterWithPush,
): void => {
  // Prevent default navigation
  e.preventDefault()

  // Get click coordinates
  const x = e.clientX
  const y = e.clientY

  // Create gunshot effects
  createBulletHole(x, y)
  createGunshotFlash()

  // Navigate after a delay
  setTimeout(() => {
    router.push(href)
  }, 1000) // 1 second delay as requested
}
