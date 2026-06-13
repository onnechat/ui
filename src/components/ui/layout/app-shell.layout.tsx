'use client'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import { AnnouncementBanner } from '@/components/ui/announcement-banner'
import { DashboardHeader } from '@/components/ui/dashboard/header'
import { AppNavbar } from '@/components/ui/dashboard/navbar'
import { SetupWidget } from '@/components/ui/dashboard/setup-widget'
import {
  AppSidebar,
  SidebarCommandPaletteProvider,
} from '@/components/ui/dashboard/sidebar'
import type { Menu } from '@/components/ui/dashboard/sidebar/data'
import { Loader } from '@/components/ui/loader'
import { NetworkStatus } from '@/components/ui/network-status'

import { SidebarInset, SidebarProvider } from '@/components/internal/sidebar'

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

          </SidebarInset>
        </SidebarProvider>
      </SidebarCommandPaletteProvider>
    </>
  )
}
