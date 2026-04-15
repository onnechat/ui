'use client'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import { AnnouncementBanner } from '@/components/announcement-banner'
import { DashboardHeader } from '@/components/dashboard/header'
import { AppNavbar } from '@/components/dashboard/navbar'
import { SetupWidget } from '@/components/dashboard/setup-widget'
import {
  AppSidebar,
  SidebarCommandPaletteProvider,
} from '@/components/dashboard/sidebar'
import type { Menu } from '@/components/dashboard/sidebar/data'
import { Loader } from '@/components/loader'
import { NetworkStatus } from '@/components/network-status'
import { PwaInstallBanner } from '@/components/pwa-install-banner'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

type AppShellLayoutProps = {
  children: React.ReactNode
  menus?: Menu[]
  bottomMenus?: Menu[]
  showNavbar?: boolean
  showLoader?: boolean
  showWorkspace?: boolean
  showSetupWidget?: boolean
}

export function AppShellLayout({
  children,
  menus,
  bottomMenus,
  showNavbar = true,
  showLoader = false,
  showWorkspace = true,
  showSetupWidget = true,
}: AppShellLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <>
      <AnnouncementBanner />

      <SidebarCommandPaletteProvider>
        <SidebarProvider className="relative max-lg:bg-dashboard-background! min-h-[calc(100svh-var(--announcement-height,0px))]">
          <NetworkStatus />

          <AppSidebar
            menus={menus}
            bottomMenus={bottomMenus}
            showWorkspace={showWorkspace}
            showSetupWidget={showSetupWidget}
          />

          {showNavbar && <AppNavbar />}

          <SidebarInset
            style={
              {
                '--sidebar-spacing': showSetupWidget && isMobile ? 38 : 24,
                '--calculated-spacing':
                  'calc(var(--spacing) * var(--sidebar-spacing))',
              } as React.CSSProperties
            }
            className={cn(
              showLoader && 'relative',
              'w-full min-w-0 max-lg:pb-(--calculated-spacing) bg-dashboard-background lg:overflow-clip',
            )}
          >
            {showLoader && (
              <div
                aria-busy="true"
                aria-live="polite"
                className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-dashboard-background"
              >
                <Loader />
              </div>
            )}

            <DashboardHeader />

            {showSetupWidget && <SetupWidget placement="shell" />}

            {children}

            <PwaInstallBanner />
          </SidebarInset>
        </SidebarProvider>
      </SidebarCommandPaletteProvider>
    </>
  )
}
