import type { SVGProps } from 'react'

export type LogisticsIconName =
  | 'ship'
  | 'truck'
  | 'plane'
  | 'train'
  | 'package'
  | 'map'
  | 'location'
  | 'refresh'
  | 'globe'
  | 'bus'
  | 'port'
  | 'warehouse'
  | 'team'
  | 'quote'
  | 'cargo'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function IconBase({ size = 24, className, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

export function ShipIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 18h18" />
      <path d="M5 18V9l4-2 4 2v9" />
      <path d="M13 9l4-2 4 2v9" />
      <path d="M9 7V5" />
      <path d="M17 7V5" />
    </IconBase>
  )
}

export function TruckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 18V6a2 2 0 00-2-2H4v14" />
      <path d="M14 9h4l3 3v6h-7V9z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </IconBase>
  )
}

export function PlaneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4c-1 0-2 1-3.5 2.5L12 10 3.8 8.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 2.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.2.6-.6.5-1.1z" />
    </IconBase>
  )
}

export function TrainIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="M8 19l-2 2" />
      <path d="M16 19l2 2" />
      <path d="M8 15h.01" />
      <path d="M16 15h.01" />
    </IconBase>
  )
}

export function PackageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16.5 9.4l-9-5.19" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </IconBase>
  )
}

export function MapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 6l6-3 6 3v12l-6 3-6-3-6 3V6l6-3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </IconBase>
  )
}

export function LocationIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12a9 9 0 11-3-6.7" />
      <path d="M21 3v6h-6" />
    </IconBase>
  )
}

export function GlobeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </IconBase>
  )
}

export function BusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19a2 2 0 012 2v4a2 2 0 01-2 2H2v-8z" />
      <path d="M18 18h2a1 1 0 001-1v-3.65a1 1 0 00-.22-.62L18 10" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
    </IconBase>
  )
}

export function PortIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 21V9l8-4 8 4v12" />
      <path d="M4 15h16" />
      <path d="M9 21v-6" />
      <path d="M15 21v-6" />
      <path d="M12 5v3" />
    </IconBase>
  )
}

export function WarehouseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M9 21V12h6v9" />
      <path d="M3 9h18" />
    </IconBase>
  )
}

export function TeamIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </IconBase>
  )
}

export function QuoteIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 3H6a2 2 0 00-2 2v11a2 2 0 002 2h3" />
      <path d="M14 3v5h5" />
      <path d="M20 21V9l-6-6" />
      <path d="M10 17h4" />
    </IconBase>
  )
}

export function CargoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <path d="M2 12h20" />
    </IconBase>
  )
}

const iconMap = {
  ship: ShipIcon,
  truck: TruckIcon,
  plane: PlaneIcon,
  train: TrainIcon,
  package: PackageIcon,
  map: MapIcon,
  location: LocationIcon,
  refresh: RefreshIcon,
  globe: GlobeIcon,
  bus: BusIcon,
  port: PortIcon,
  warehouse: WarehouseIcon,
  team: TeamIcon,
  quote: QuoteIcon,
  cargo: CargoIcon,
} as const

export function LogisticsIcon({
  name,
  size = 24,
  className,
  ...props
}: IconProps & { name: LogisticsIconName }) {
  const Icon = iconMap[name]
  return <Icon size={size} className={className} {...props} />
}

/** Section label truck icon (matches brand) */
export function SectionLabelIcon({ className }: { className?: string }) {
  return <TruckIcon size={20} className={className} />
}
