/**
 * Western-themed shooting animation utility
 * This utility provides functions for creating bullet hole and gunshot flash effects
 */

// Create a bullet hole at the specified position
export const createBulletHole = (x: number, y: number): HTMLElement => {
  // Create a small sparkle for space theme
  const sparkle = document.createElement('div')
  sparkle.className = 'space-sparkle'
  sparkle.style.left = `${x - 6}px`
  sparkle.style.top = `${y - 6}px`
  sparkle.style.position = 'absolute'
  document.body.appendChild(sparkle)

  // Remove after animation completes
  setTimeout(() => {
    sparkle.remove()
  }, 1200)

  return sparkle
}

// Create a gunshot flash effect
export const createGunshotFlash = (): HTMLElement => {
  // Create a subtle space flash overlay (no sound)
  const flash = document.createElement('div')
  flash.className = 'space-flash'
  document.body.appendChild(flash)

  // Remove the flash effect after animation completes
  setTimeout(() => {
    flash.remove()
  }, 250)

  return flash
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

  // Create small space effect and navigate quickly
  createBulletHole(x, y)
  createGunshotFlash()

  // Navigate after a short delay for the animation
  setTimeout(() => {
    router.push(href)
  }, 250)
}
