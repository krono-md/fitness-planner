import React from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMeta } from '../utils/routeMeta'

interface PageHeaderProps {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { pathname } = useLocation()
  const meta = getRouteMeta(pathname)
  const Icon = meta.icon

  return (
    <div className="flex items-start justify-between gap-4 mb-1">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`whop-icon-tile w-9 h-9 rounded-xl ${meta.iconClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="whop-micro">{meta.section}</p>
          <h1 className="whop-page-title truncate">{title ?? meta.title}</h1>
          {subtitle && <p className="whop-page-sub">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
