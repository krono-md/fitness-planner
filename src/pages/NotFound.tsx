import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'

/** Catch-all for unknown URLs. Whop-style empty card with a single CTA back
 *  to the Dashboard, so a typo in a URL no longer silently redirects and
 *  confuses the user. */
export default function NotFound() {
  return (
    <div className="whop-page">
      <div className="whop-card p-10 text-center max-w-md mx-auto mt-12">
        <div className="whop-icon-tile bg-white/[0.06] text-white/40 w-12 h-12 mx-auto mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="whop-page-title mb-2">Page not found</h1>
        <p className="whop-page-sub mb-6">
          That URL doesn't match any of the pages in your plan. Check the sidebar — or head back to the dashboard.
        </p>
        <Link to="/" className="whop-btn-primary inline-flex">
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
