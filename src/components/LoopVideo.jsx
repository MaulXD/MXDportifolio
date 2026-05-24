import { useEffect, useRef } from 'react'

/**
 * Vídeo em loop, sem controles — estilo GIF.
 * `playInView`: só reproduz quando visível (cards do portfólio no mobile).
 */
export default function LoopVideo({
  src,
  className = '',
  autoPlay = true,
  preload = 'auto',
  playInView = false,
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.controls = false
    el.disablePictureInPicture = true
    el.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback nofullscreen')
    el.setAttribute('disableRemotePlayback', '')

    if (playInView) {
      const play = () => {
        el.play().catch(() => {})
      }
      const pause = () => {
        el.pause()
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) play()
          else pause()
        },
        { threshold: 0.2, rootMargin: '48px' },
      )

      observer.observe(el)
      return () => observer.disconnect()
    }

    if (!autoPlay) return

    const play = () => {
      el.play().catch(() => {})
    }
    play()
    el.addEventListener('loadeddata', play)
    return () => el.removeEventListener('loadeddata', play)
  }, [src, autoPlay, playInView])

  return (
    <video
      ref={ref}
      src={src}
      autoPlay={autoPlay && !playInView}
      loop
      muted
      playsInline
      preload={preload}
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      className={`video-gif pointer-events-none select-none ${className}`.trim()}
      onContextMenu={(e) => e.preventDefault()}
      {...rest}
    />
  )
}
