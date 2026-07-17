export default function Logo({ size = 32 }) {
	return (
		<svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
			<rect x="10" y="7" width="12" height="17" rx="1" fill="var(--text)" />
			<rect x="8" y="24.5" width="16" height="2" rx="0.5" fill="var(--text)" />
			<path d="M22 12 L27 12 L27 18" fill="none" stroke="var(--text)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
			<rect x="25" y="17" width="4" height="2.4" rx="0.5" fill="var(--text)" />
			<circle cx="27" cy="21.5" r="1.6" fill="var(--accent)" />
		</svg>
	);
}
