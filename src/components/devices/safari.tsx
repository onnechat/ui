import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'

function SafariDesktop({ url, children }: SafariProps) {
  return (
    <div id="safari-screen" className="flex flex-col bg-card rounded-xl">
      <div id="top-bar" className="flex items-center gap-4 px-5 py-2.5 h-14">
        <div className="flex items-center gap-6">
          <div id="os-buttons" className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="size-3 rounded-full bg-muted-foreground/25"
              />
            ))}
          </div>

          <Icon
            name="PanelLeft"
            className="size-5 text-muted-foreground fill-transparent!"
          />

          <div id="page-controls" className="flex items-center gap-2">
            {['ChevronLeft', 'ChevronRight'].map((icon) => (
              <Icon
                key={icon}
                name={icon as IconType}
                className="size-6 text-muted-foreground fill-transparent!"
              />
            ))}
          </div>
        </div>

        <div
          id="search-bar"
          className="relative flex items-center justify-center gap-2 rounded-md bg-muted text-muted-foreground px-3 py-2 w-full h-full max-w-1/2 mx-auto"
        >
          <Icon name="Lock" className="size-4 fill-transparent!" />

          <span className="text-sm select-none pointer-events-none">
            {url.replace(/^https?:\/\//, '')}
          </span>

          <Icon
            name="RotateCw"
            className="size-4 absolute right-3 fill-transparent!"
          />
        </div>

        <div className="flex items-center gap-4">
          {['Share', 'Plus', 'Copy'].map((item) => (
            <Icon
              key={item}
              name={item as IconType}
              className="size-5 text-muted-foreground fill-transparent!"
            />
          ))}
        </div>
      </div>

      <div
        id="content"
        className="flex-1 rounded-xl rounded-t-none overflow-hidden border-t border-border"
      >
        {children}
      </div>
    </div>
  )
}

function SafariIPad({ url, children }: SafariProps) {
  return (
    <div className="bg-card rounded-xl p-1">
      <div className="bg-card min-h-[500px] relative overflow-hidden rounded-xl">
        <div className="flex flex-col h-full">
          <div
            id="top-bar"
            className="flex items-center gap-3 px-4 py-2 h-12 bg-card"
          >
            <div className="flex items-center gap-4">
              <div id="page-controls" className="flex items-center gap-1">
                {['ChevronLeft', 'ChevronRight'].map((icon) => (
                  <Icon
                    key={icon}
                    name={icon as IconType}
                    className="size-5 text-muted-foreground fill-transparent!"
                  />
                ))}
              </div>

              <Icon
                name="BookOpen"
                className="size-4 text-muted-foreground fill-transparent!"
              />
            </div>

            <div
              id="search-bar"
              className="relative flex items-center justify-center gap-2 rounded-md bg-muted text-muted-foreground px-3 py-1.5 w-full h-full max-w-1/2 mx-auto"
            >
              <Icon
                name="ALargeSmall"
                className="size-4 absolute left-3 fill-transparent!"
              />

              <Icon name="Lock" className="size-3 fill-transparent!" />

              <span className="text-xs select-none pointer-events-none">
                {url.replace(/^https?:\/\//, '')}
              </span>

              <Icon
                name="RotateCw"
                className="size-3 absolute right-3 fill-transparent!"
              />
            </div>

            <div className="flex items-center gap-3">
              {['Share', 'Plus', 'Copy'].map((item) => (
                <Icon
                  key={item}
                  name={item as IconType}
                  className="size-4 text-muted-foreground fill-transparent!"
                />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-4 flex items-center justify-center">
        <div className="w-32 h-1 bg-[#404040] rounded-full"></div>
      </div>
    </div>
  )
}

function SafariIPhone({ url, children }: SafariProps) {
  return (
    <div className="bg-card rounded-3xl p-1 sm:max-w-[375px] min-h-[667px] max-h-[667px] mx-auto overflow-hidden">
      <div className="relative min-h-full max-h-[calc(667px-.5rem)] rounded-3xl overflow-hidden">
        <div className="flex flex-1 flex-col min-h-full">
          <div className="flex flex-col flex-1 overflow-hidden min-h-full rounded-3xl">
            {children}
          </div>

          <div
            id="bottom-bar"
            className="flex flex-col items-center gap-2 p-3 pb-1 bg-card border-b border-border"
          >
            <div
              id="search-bar"
              className="relative flex items-center justify-center gap-1.5 rounded-md bg-muted text-muted-foreground px-2 py-2.5 w-full mx-auto h-10"
            >
              <Icon
                name="TextAlignStart"
                className="size-4 absolute left-3 fill-transparent!"
              />

              <span className="text-xs select-none pointer-events-none truncate">
                {url.replace(/^https?:\/\//, '')}
              </span>

              <Icon
                name="RotateCw"
                className="size-4 absolute right-3 fill-transparent!"
              />

              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-md bg-muted text-muted-foreground h-10 w-24',
                    'absolute',
                    index === 0 ? '-left-[30%]' : '-right-[30%]',
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-between w-full px-5 py-2">
              {['ChevronLeft', 'ChevronRight'].map((item) => (
                <Icon
                  key={item}
                  name={item as IconType}
                  className="size-5 text-muted-foreground fill-transparent!"
                />
              ))}

              {['Share', 'BookOpen', 'Copy'].map((item) => (
                <Icon
                  key={item}
                  name={item as IconType}
                  className="size-4.5 text-muted-foreground fill-transparent!"
                />
              ))}
            </div>

            <div className="h-2 flex items-center justify-center">
              <div className="w-24 h-1 bg-border rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface SafariProps extends HTMLAttributes<HTMLDivElement> {
  url: string
  children?: React.ReactNode
}

export function Safari({ url, children }: SafariProps) {
  return (
    <div className="grid gap-4">
      <div className="hidden xl:block">
        <SafariDesktop url={url}>{children}</SafariDesktop>
      </div>

      <div className="hidden sm:block xl:hidden">
        <SafariIPad url={url}>{children}</SafariIPad>
      </div>

      <div className="block sm:hidden">
        <SafariIPhone url={url}>{children}</SafariIPhone>
      </div>
    </div>
  )
}
