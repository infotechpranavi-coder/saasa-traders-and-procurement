'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

/**
 * Sitewide Meta (Facebook) Pixel initialization component.
 * Injects base pixel script when NEXT_PUBLIC_META_PIXEL_ID is configured in environment.
 */
export default function MetaPixel() {
  if (!PIXEL_ID) return null

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

/**
 * Fires the standard Meta Pixel "Lead" conversion event.
 * Automatically executed on the /thank-you page upon mounting.
 */
export function MetaPixelLeadTracker({ service }: { service?: string }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        if (service) {
          window.fbq('track', 'Lead', { content_name: service, content_category: 'Enquiry' })
        } else {
          window.fbq('track', 'Lead')
        }
      }
    } catch (err) {
      console.warn('[MetaPixel] Lead event tracking skipped:', err)
    }
  }, [service])

  if (!PIXEL_ID) return null

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=Lead&noscript=1`}
        alt=""
      />
    </noscript>
  )
}
