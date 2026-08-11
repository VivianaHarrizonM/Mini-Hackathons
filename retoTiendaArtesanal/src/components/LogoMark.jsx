export default function LogoMark(props) {
  return (
    <svg viewBox="0 0 40 40" {...props}>
      <circle cx="20" cy="20" r="19" fill="#FFF8EC" />
      <circle cx="20" cy="20" r="19" fill="none" stroke="#26352A" strokeWidth="1" opacity="0.15" />

      <path d="M7 27c-2-5-2-10 1-15" fill="none" stroke="#304B3A" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path d="M33 27c2-5 2-10-1-15" fill="none" stroke="#304B3A" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path d="M6.5 22a3 3 0 0 1 3 3" fill="none" stroke="#304B3A" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
      <path d="M33.5 22a3 3 0 0 0-3 3" fill="none" stroke="#304B3A" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />

      <rect x="16" y="9" width="8" height="8" rx="1" transform="rotate(45 20 13)" fill="#E9AD3D" />

      <path d="M25 20c3 0 3 6 0 6.5" fill="none" stroke="#B8442B" strokeWidth="2" strokeLinecap="round" />
      <rect x="12" y="18" width="14" height="12" rx="3" fill="#D65A38" />
      <ellipse cx="19" cy="18" rx="7" ry="1.6" fill="#F3C5B5" />
    </svg>
  )
}