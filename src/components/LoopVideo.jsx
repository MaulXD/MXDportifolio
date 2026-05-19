import { useEffect, useRef } from 'react'

/**
 * Vídeo em loop, sem controles nem barra — comportamento de GIF.
 */
export default function LoopVideo({ src, className = '', autoPlay = true, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.controls = false
    el.disablePictureInPicture = true
    el.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback nofullscreen')
    el.setAttribute('disableRemotePlayback', '')

    if (!autoPlay) return

    const play = () => {
      el.play().catch(() => {})
    }
    play()
    el.addEventListener('loadeddata', play)
    return () => el.removeEventListener('loadeddata', play)
  }, [src, autoPlay])

  return (
    <video
      ref={ref}
      src={src}
      autoPlay={autoPlay}
      loop
      muted
      playsInline
      preload="auto"
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
