'use client';

import Cookies from 'js-cookie';

import * as React from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/cn';

import { ANIMATION } from '@/constants/animations';

import { Icon, type IconType } from '@/components/icon';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Sidebar, SIDEBAR_WIDTH } from '@/components/ui/sidebar';
import { Tooltip } from '@/components/ui/tooltip';

/**
 * Application shell layout, composition-first. Encodes the structure of our
 * dashboards — inset resizable sidebars, glass sticky header, floating mobile
 * navbar, announcement-aware viewport — while leaving every region up to the
 * consumer.
 *
 * Both sidebars share the exact same mechanics and API: a panel component, a
 * trigger and per-side state (cookies + keyboard shortcut) enabled by the
 * `leftSidebar`/`rightSidebar` props on the root. Each side is independent —
 * a product can enable only the left one, only the right one, or both:
 *
 * ```tsx
 * <AnnouncementBanner message="…" type="NEW" />
 *
 * <AppShell leftSidebar rightSidebar={{ defaultOpen: false }}>
 *   <AppShell.LeftSidebar>
 *     <AppShell.SidebarHeader>…logo + actions…</AppShell.SidebarHeader>
 *     <AppShell.SidebarSection>…workspace switcher…</AppShell.SidebarSection>
 *     <AppShell.SidebarContent>
 *       <AppShell.SidebarGroup title="Geral">
 *         <AppShell.SidebarItem icon="House6" title="Visão Geral" href="/" active />
 *       </AppShell.SidebarGroup>
 *     </AppShell.SidebarContent>
 *     <AppShell.SidebarFooter>…copyright + user…</AppShell.SidebarFooter>
 *   </AppShell.LeftSidebar>
 *
 *   <AppShell.Navbar>…mobile items…</AppShell.Navbar>
 *
 *   <AppShell.Inset>
 *     <AppShell.Header title={…} actions={…} />
 *     <MyPage />
 *   </AppShell.Inset>
 *
 *   <AppShell.RightSidebar>…</AppShell.RightSidebar>
 * </AppShell>
 * ```
 *
 * On mobile the sidebars are hidden entirely — navigation belongs to
 * `AppShell.Navbar`. `AppShell.Header` automatically renders one toggle per
 * enabled side (left before the title, right after the actions), so any
 * sidebar combination — none, left only, right only, both — gets exactly
 * the toggles that apply; its `leftSidebarTrigger`/`rightSidebarTrigger`
 * slots replace that default (pass a node) or remove it (pass `null`).
 * `AppShell.LeftSidebarTrigger` and `AppShell.RightSidebarTrigger` exist for
 * custom placements (both accept a custom `icon`), and
 * `useLeftSidebarToggle`/`useRightSidebarToggle` expose just the toggle
 * function for fully custom elements.
 *
 * `AppShell.Inset` additionally takes pinned `top`/`bottom` slots
 * (`<AppShell.Inset top={…} bottom={…}>`): rows fixed on screen above/below
 * the rounded panel, on the shell background (Linear-style), while the page
 * scrolls the panel between them — the sticky Header docks right below the
 * `top` row.
 */
function AppShellRoot({
  leftSidebar,
  rightSidebar,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  /**
   * Enables the left sidebar state (`[` shortcut, cookie persistence, header
   * toggle). Pass `{ defaultOpen: false }` to start collapsed.
   */
  leftSidebar?: AppShellSidebarProp;
  /**
   * Enables the right (context) sidebar state (`]` shortcut, cookie
   * persistence). Pass `{ defaultOpen: false }` to start collapsed.
   */
  rightSidebar?: AppShellSidebarProp;
}) {
  return (
    <OptionalSidebarProvider side="left" config={leftSidebar}>
      <OptionalSidebarProvider side="right" config={rightSidebar}>
        <div
          data-slot="app-shell"
          className={cn(
            'has-data-[variant=inset]:bg-sidebar flex w-full',
            'relative flex-1 min-h-[calc(100svh-var(--announcement-height,0px))] max-lg:bg-dashboard-background!',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </OptionalSidebarProvider>
    </OptionalSidebarProvider>
  );
}

/* -------------------------------------------------------------------------
 * Sidebars (left / right)
 *
 * A single implementation parameterized by side. Each side has its own
 * context/provider (open state + width, persisted in cookies, toggled by a
 * keyboard shortcut), an inset panel with a drag-to-resize rail (click
 * toggles, double click resets to the default width, dragging resizes
 * between 16–20rem and collapses past the threshold) and a trigger button.
 * ---------------------------------------------------------------------- */

const MIN_SIDEBAR_WIDTH = 16 * 16; // 16rem
const MAX_SIDEBAR_WIDTH = 20 * 16; // 20rem
const COLLAPSE_THRESHOLD = MIN_SIDEBAR_WIDTH / 2; // 8rem — collapse only past half minimum

const SIDEBAR_COOKIE_TTL_DAYS = 365;

// Single source of truth for every open/collapse animation (gaps, fixed
// containers, rails and the inset margins) so both sides always move in the
// exact same time.
const SIDEBAR_ANIMATION_DURATION = 'duration-300';

type AppShellSidebarSide = 'left' | 'right';

// Cookies, CSS vars and data-slots are all prefixed by the side name, and
// deliberately distinct from ui/sidebar's own `--sidebar-width`/`sidebar-*`
// cookie names so a standalone `Sidebar` nested anywhere in the shell never
// collides with the shell state.
const SIDEBAR_SIDE_CONFIG = {
  left: {
    defaultWidth: SIDEBAR_WIDTH,
    widthVar: '--left-sidebar-width',
    widthCookie: 'left-sidebar-width',
    stateCookie: 'left-sidebar-state',
    wrapperSlot: 'left-sidebar-wrapper',
    gapSlot: 'left-sidebar-gap',
    containerSlot: 'left-sidebar-container',
    keyboardShortcut: '[',
  },
  right: {
    defaultWidth: '20rem',
    widthVar: '--right-sidebar-width',
    widthCookie: 'right-sidebar-width',
    stateCookie: 'right-sidebar-state',
    wrapperSlot: 'right-sidebar-wrapper',
    gapSlot: 'right-sidebar-gap',
    containerSlot: 'right-sidebar-container',
    keyboardShortcut: ']',
  },
} as const;

type AppShellSidebarContextValue = {
  side: AppShellSidebarSide;
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  sidebarWidth: string;
  setSidebarWidth: (width: string) => void;
  maxWidth?: number;
  collapsible: AppShellSidebarCollapsible;
};

const AppShellLeftSidebarContext =
  React.createContext<AppShellSidebarContextValue | null>(null);

const AppShellRightSidebarContext =
  React.createContext<AppShellSidebarContextValue | null>(null);

function useAppShellLeftSidebar() {
  const context = React.useContext(AppShellLeftSidebarContext);

  if (!context) {
    throw new Error(
      'useAppShellLeftSidebar must be used within an AppShell.LeftSidebarProvider.',
    );
  }

  return context;
}

function useAppShellRightSidebar() {
  const context = React.useContext(AppShellRightSidebarContext);

  if (!context) {
    throw new Error(
      'useAppShellRightSidebar must be used within an AppShell.RightSidebarProvider.',
    );
  }

  return context;
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest('input, textarea, select') !== null)
  );
}

function SidebarSideProvider({
  side,
  defaultOpen = true,
  maxWidth,
  collapsible = 'offcanvas',
  children,
}: {
  side: AppShellSidebarSide;
  defaultOpen?: boolean;
  maxWidth?: number;
  collapsible?: AppShellSidebarCollapsible;
  children: React.ReactNode;
}) {
  const config = SIDEBAR_SIDE_CONFIG[side];

  const [open, _setOpen] = React.useState(defaultOpen);
  const [sidebarWidth, setSidebarWidth] = React.useState<string>(
    config.defaultWidth,
  );

  const setOpen = React.useCallback(
    (value: boolean) => {
      _setOpen(value);
      Cookies.set(config.stateCookie, String(value), {
        expires: SIDEBAR_COOKIE_TTL_DAYS,
        path: '/',
      });
    },
    [config.stateCookie],
  );

  const toggleSidebar = React.useCallback(() => {
    _setOpen(open => {
      Cookies.set(config.stateCookie, String(!open), {
        expires: SIDEBAR_COOKIE_TTL_DAYS,
        path: '/',
      });
      return !open;
    });
  }, [config.stateCookie]);

  React.useLayoutEffect(() => {
    const savedOpen = Cookies.get(config.stateCookie);
    if (savedOpen !== undefined) _setOpen(savedOpen === 'true');

    const savedWidth = Cookies.get(config.widthCookie);
    if (savedWidth) setSidebarWidth(savedWidth);
  }, [config.stateCookie, config.widthCookie]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== config.keyboardShortcut) return;
      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      toggleSidebar();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, config.keyboardShortcut]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<AppShellSidebarContextValue>(
    () => ({
      side,
      state,
      open,
      setOpen,
      toggleSidebar,
      sidebarWidth,
      setSidebarWidth,
      maxWidth,
      collapsible,
    }),
    [
      side,
      state,
      open,
      setOpen,
      toggleSidebar,
      sidebarWidth,
      maxWidth,
      collapsible,
    ],
  );

  const Context =
    side === 'left' ? AppShellLeftSidebarContext : AppShellRightSidebarContext;

  return (
    <Context.Provider value={contextValue}>
      <div
        data-slot={config.wrapperSlot}
        style={
          {
            [config.widthVar]: sidebarWidth,
          } as React.CSSProperties
        }
        className={cn(
          'contents',
          side === 'left'
            ? 'max-lg:[--left-sidebar-width:0px]'
            : 'max-lg:[--right-sidebar-width:0px]',
        )}
      >
        {children}
      </div>
    </Context.Provider>
  );
}

type AppShellSidebarCollapsible = 'offcanvas' | 'icon';

type AppShellSidebarProp =
  | boolean
  | {
      defaultOpen?: boolean;
      maxWidth?: number;
      /**
       * How the sidebar looks when collapsed. `offcanvas` (default) slides it
       * away entirely; `icon` keeps a slim rail of icons (labels hidden, shown
       * as tooltips on hover).
       */
      collapsible?: AppShellSidebarCollapsible;
    };

/**
 * Mounts a side's state when the matching root prop enables it. Skips when an
 * ancestor already provides the side (the deprecated standalone providers),
 * so the two mechanisms never stack conflicting state.
 */
function OptionalSidebarProvider({
  side,
  config,
  children,
}: {
  side: AppShellSidebarSide;
  config: AppShellSidebarProp | undefined;
  children: React.ReactNode;
}) {
  const existing = React.useContext(
    side === 'left' ? AppShellLeftSidebarContext : AppShellRightSidebarContext,
  );

  if (!config || existing) return <>{children}</>;

  return (
    <SidebarSideProvider
      side={side}
      defaultOpen={typeof config === 'object' ? config.defaultOpen : undefined}
      maxWidth={typeof config === 'object' ? config.maxWidth : undefined}
      collapsible={typeof config === 'object' ? config.collapsible : undefined}
    >
      {children}
    </SidebarSideProvider>
  );
}

/** @deprecated Enable the sidebar with the `leftSidebar` prop on `AppShell` instead. */
function AppShellLeftSidebarProvider(props: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return <SidebarSideProvider side="left" {...props} />;
}

/** @deprecated Enable the sidebar with the `rightSidebar` prop on `AppShell` instead. */
function AppShellRightSidebarProvider(props: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return <SidebarSideProvider side="right" {...props} />;
}

function SidebarSidePanel({
  side,
  className,
  children,
  ...props
}: React.ComponentProps<'aside'> & {
  side: AppShellSidebarSide;
}) {
  const config = SIDEBAR_SIDE_CONFIG[side];

  const leftContext = React.useContext(AppShellLeftSidebarContext);
  const rightContext = React.useContext(AppShellRightSidebarContext);

  const context = side === 'left' ? leftContext : rightContext;

  if (!context) {
    throw new Error(
      side === 'left'
        ? 'AppShell.LeftSidebar requires the `leftSidebar` prop on AppShell.'
        : 'AppShell.RightSidebar requires the `rightSidebar` prop on AppShell.',
    );
  }

  const {
    state,
    open: isSidebarOpen,
    toggleSidebar,
    setOpen,
    setSidebarWidth,
    maxWidth: maxSidebarWidth,
    collapsible,
  } = context;

  // Dragging toward the shell center collapses; away from it expands.
  const directionSign = side === 'left' ? 1 : -1;

  const [isDragging, setIsDragging] = React.useState(false);
  const railClickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const persistWidth = React.useCallback(
    (width: string) => {
      Cookies.set(config.widthCookie, width, {
        expires: SIDEBAR_COOKIE_TTL_DAYS,
        path: '/',
      });
      setSidebarWidth(width);
    },
    [config.widthCookie, setSidebarWidth],
  );

  const handleRailClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const wrapper = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        `[data-slot="${config.wrapperSlot}"]`,
      );

      if (railClickTimer.current) {
        clearTimeout(railClickTimer.current);
        railClickTimer.current = null;

        if (!wrapper) return;

        wrapper.style.setProperty(config.widthVar, config.defaultWidth);
        persistWidth(config.defaultWidth);

        return;
      }

      railClickTimer.current = setTimeout(() => {
        railClickTimer.current = null;
        toggleSidebar();
      }, 150);
    },
    [config, toggleSidebar, persistWidth],
  );

  const handleResizeMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const wrapper = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        `[data-slot="${config.wrapperSlot}"]`,
      );

      if (!wrapper) return;

      const startX = e.clientX;

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const container = wrapper.querySelector<HTMLElement>(
        `[data-slot="${config.containerSlot}"]`,
      );

      const gap = wrapper.querySelector<HTMLElement>(
        `[data-slot="${config.gapSlot}"]`,
      );

      const disableTransitions = () => {
        if (container) container.style.transition = 'none';
        if (gap) gap.style.transition = 'none';
      };

      const restoreTransitions = () => {
        if (container) container.style.transition = '';
        if (gap) gap.style.transition = '';
      };

      if (!isSidebarOpen) {
        let dragStarted = false;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = (moveEvent.clientX - startX) * directionSign;

          if (!dragStarted) {
            if (Math.abs(delta) < 4) return;

            dragStarted = true;
            setIsDragging(true);

            wrapper.style.setProperty(
              config.widthVar,
              `${MIN_SIDEBAR_WIDTH}px`,
            );
            setOpen(true);
          }

          const newWidth = Math.max(
            MIN_SIDEBAR_WIDTH,
            Math.min(
              maxSidebarWidth ?? MAX_SIDEBAR_WIDTH,
              MIN_SIDEBAR_WIDTH + delta,
            ),
          );

          wrapper.style.setProperty(config.widthVar, `${newWidth}px`);
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
          document.body.style.cursor = '';
          document.body.style.userSelect = '';

          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);

          if (!dragStarted) return;

          setIsDragging(false);

          if ((upEvent.clientX - startX) * directionSign < -10) {
            wrapper.style.setProperty(
              config.widthVar,
              `${MIN_SIDEBAR_WIDTH}px`,
            );

            setOpen(false);
          } else {
            const newWidth = wrapper.style
              .getPropertyValue(config.widthVar)
              .trim();

            persistWidth(newWidth);
          }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return;
      }

      setIsDragging(true);
      disableTransitions();

      const rawWidth = wrapper.style.getPropertyValue(config.widthVar);
      const startWidth = rawWidth
        ? rawWidth.endsWith('rem')
          ? parseFloat(rawWidth) * 16
          : parseFloat(rawWidth)
        : MIN_SIDEBAR_WIDTH;

      let pastCollapseThreshold = false;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = (moveEvent.clientX - startX) * directionSign;
        const rawWidth = startWidth + delta;

        pastCollapseThreshold = rawWidth < COLLAPSE_THRESHOLD;

        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(maxSidebarWidth ?? MAX_SIDEBAR_WIDTH, rawWidth),
        );
        wrapper.style.setProperty(config.widthVar, `${newWidth}px`);
      };

      const handleMouseUp = () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        setIsDragging(false);
        restoreTransitions();

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        if (pastCollapseThreshold) {
          toggleSidebar();
          return;
        }

        const newWidth = wrapper.style.getPropertyValue(config.widthVar).trim();

        persistWidth(newWidth);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [
      config,
      directionSign,
      toggleSidebar,
      persistWidth,
      isSidebarOpen,
      setOpen,
    ],
  );

  React.useEffect(() => {
    return () => {
      if (railClickTimer.current) {
        clearTimeout(railClickTimer.current);
      }
    };
  }, []);

  return (
    <aside
      data-side={side}
      data-slot="sidebar"
      data-variant="inset"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      className="group peer hidden text-sidebar-foreground lg:block"
      {...props}
    >
      <div
        aria-hidden
        data-slot={config.gapSlot}
        className={cn(
          'relative shrink-0 bg-transparent transition-[width]',
          SIDEBAR_ANIMATION_DURATION,
          state === 'expanded'
            ? side === 'left'
              ? 'w-(--left-sidebar-width)'
              : 'w-(--right-sidebar-width)'
            : // Icon rail keeps a slim column; offcanvas collapses to nothing.
              collapsible === 'icon'
              ? 'w-14'
              : 'w-0',
        )}
      />

      {/* Off-canvas collapses by animating the clipped width (never past the
          viewport edge) instead of a negative offset — an off-screen fixed
          panel becomes real horizontal overflow whenever an ancestor has a
          transform (e.g. Storybook zoom). The inner panel is anchored to the
          shell-center edge so it slides out instead of being cropped. */}
      <div
        data-slot={config.containerSlot}
        className={cn(
          'fixed z-10 hidden overflow-clip bg-sidebar transition-[width] lg:flex',
          SIDEBAR_ANIMATION_DURATION,
          side === 'left'
            ? 'left-0 w-(--left-sidebar-width) group-data-[collapsible=offcanvas]:w-0 group-data-[collapsible=icon]:w-14 justify-end'
            : 'right-0 w-(--right-sidebar-width) group-data-[collapsible=offcanvas]:w-0 group-data-[collapsible=icon]:w-14',
        )}
        style={{
          top: 'var(--announcement-height, 0px)',
          height: 'calc(100dvh - var(--announcement-height, 0px))',
        }}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            'relative flex h-full shrink-0 min-w-0 flex-col',
            side === 'left'
              ? 'w-(--left-sidebar-width)'
              : 'w-(--right-sidebar-width)',
            'group-data-[collapsible=icon]:w-14',
            className,
          )}
        >
          {children}
        </div>
      </div>

      <button
        type="button"
        tabIndex={-1}
        onClick={handleRailClick}
        onMouseDown={handleResizeMouseDown}
        onFocus={e => e.currentTarget.blur()}
        data-sidebar="rail"
        data-slot={side === 'left' ? 'left-sidebar-rail' : 'right-sidebar-rail'}
        aria-label="Resize sidebar"
        className={cn(
          'fixed inset-y-0 z-20 hidden w-4 sm:flex',
          'cursor-col-resize max-h-32 items-center justify-center top-1/2 -translate-y-1/2 px-4',
          'group-data-[collapsible=offcanvas]:translate-x-0',
          'after:absolute after:inset-y-0 after:w-1 after:rounded-full after:transition-transform',
          'hover:after:translate-x-0 hover:after:bg-sidebar-border',
          'outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-ring bg-transparent!',
          side === 'left'
            ? 'left-(--left-sidebar-width) group-data-[collapsible=offcanvas]:left-0 group-data-[collapsible=icon]:left-14 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2 transition-[left,transform]'
            : 'right-(--right-sidebar-width) group-data-[collapsible=offcanvas]:right-0 group-data-[collapsible=icon]:right-14 translate-x-1/2 after:right-1/2 after:translate-x-1/2 transition-[right,transform]',
          SIDEBAR_ANIMATION_DURATION,
          isDragging && 'after:translate-x-0 after:bg-sidebar-border',
        )}
      />
    </aside>
  );
}

/**
 * Fixed left (primary) panel with a drag-to-resize rail. Hidden on mobile —
 * navigation belongs to `AppShell.Navbar`. Requires the `leftSidebar` prop
 * on `AppShell`.
 */
function AppShellLeftSidebar(props: React.ComponentProps<'aside'>) {
  return <SidebarSidePanel side="left" {...props} />;
}

/**
 * Fixed right (context) panel with a drag-to-resize rail. Hidden on mobile.
 * Requires the `rightSidebar` prop on `AppShell`.
 */
function AppShellRightSidebar(props: React.ComponentProps<'aside'>) {
  return <SidebarSidePanel side="right" {...props} />;
}

type SidebarTriggerIcon =
  | IconType
  | React.ReactNode
  | ((state: 'expanded' | 'collapsed') => React.ReactNode);

function SidebarSideTrigger({
  side,
  label,
  icon,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  side: AppShellSidebarSide;
  label: string;
  icon?: SidebarTriggerIcon;
}) {
  const leftContext = React.useContext(AppShellLeftSidebarContext);
  const rightContext = React.useContext(AppShellRightSidebarContext);

  const context = side === 'left' ? leftContext : rightContext;

  if (!context) {
    throw new Error(
      side === 'left'
        ? 'AppShell.LeftSidebarTrigger requires the `leftSidebar` prop on AppShell.'
        : 'AppShell.RightSidebarTrigger requires the `rightSidebar` prop on AppShell.',
    );
  }

  const { toggleSidebar, state } = context;

  const resolvedIcon = typeof icon === 'function' ? icon(state) : icon;

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          size="icon"
          variant="ghost"
          type="button"
          data-slot={
            side === 'left' ? 'left-sidebar-trigger' : 'right-sidebar-trigger'
          }
          className={cn('max-lg:hidden shrink-0', className)}
          onClick={toggleSidebar}
          {...props}
        >
          {resolvedIcon === undefined ? (
            <Icon
              name={state === 'collapsed' ? 'SidebarToggled' : 'SidebarToggle'}
              className={cn(
                '!size-4 text-foreground',
                side === 'right' && 'scale-x-[-1]',
              )}
            />
          ) : typeof resolvedIcon === 'string' ? (
            <Icon
              name={resolvedIcon as IconType}
              className="!size-4 text-foreground"
            />
          ) : (
            resolvedIcon
          )}

          <span className="sr-only">{label}</span>
        </Button>
      </Tooltip.Trigger>

      <Tooltip.Content side="bottom">{label}</Tooltip.Content>
    </Tooltip>
  );
}

/**
 * Toggle button of the left sidebar, for custom placements (the Header
 * already renders one automatically). Requires the `leftSidebar` prop on
 * `AppShell`. Pass `icon` to replace the default state-aware icon — an icon
 * name, any node, or a function of the sidebar state
 * (`(state) => ReactNode`).
 */
function AppShellLeftSidebarTrigger({
  label = 'Toggle left sidebar',
  ...props
}: React.ComponentProps<typeof Button> & {
  label?: string;
  icon?: SidebarTriggerIcon;
}) {
  return <SidebarSideTrigger side="left" label={label} {...props} />;
}

/**
 * Toggle button of the right sidebar, for custom placements (the Header
 * already renders one automatically). Requires the `rightSidebar` prop on
 * `AppShell`. Pass `icon` to replace the default state-aware icon — an icon
 * name, any node, or a function of the sidebar state
 * (`(state) => ReactNode`).
 */
function AppShellRightSidebarTrigger({
  label = 'Toggle right sidebar',
  ...props
}: React.ComponentProps<typeof Button> & {
  label?: string;
  icon?: SidebarTriggerIcon;
}) {
  return <SidebarSideTrigger side="right" label={label} {...props} />;
}

/**
 * Returns the toggle function of the left sidebar, to wire any custom
 * element to it. Requires the `leftSidebar` prop on `AppShell`.
 */
function useLeftSidebarToggle() {
  const context = React.useContext(AppShellLeftSidebarContext);

  if (!context) {
    throw new Error(
      'useLeftSidebarToggle requires the `leftSidebar` prop on AppShell.',
    );
  }

  return context.toggleSidebar;
}

/**
 * Returns the toggle function of the right sidebar, to wire any custom
 * element to it. Requires the `rightSidebar` prop on `AppShell`.
 */
function useRightSidebarToggle() {
  const context = React.useContext(AppShellRightSidebarContext);

  if (!context) {
    throw new Error(
      'useRightSidebarToggle requires the `rightSidebar` prop on AppShell.',
    );
  }

  return context.toggleSidebar;
}

/* -------------------------------------------------------------------------
 * Sidebar building blocks (work inside either side)
 * ---------------------------------------------------------------------- */

function AppShellSidebarHeader({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Header>) {
  return (
    <Sidebar.Header
      data-slot="app-shell-sidebar-header"
      className={cn(
        'flex flex-row items-center justify-between border-none p-4 pb-2 -mt-0.5',
        className,
      )}
      {...props}
    >
      {children}
    </Sidebar.Header>
  );
}

function AppShellSidebarSection({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="app-shell-sidebar-section"
      className={cn('shrink-0 px-4 py-2 empty:hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AppShellSidebarContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Content>) {
  // No list element here: the direct children are `AppShell.SidebarGroup`s
  // (sections), and each group owns its own `<ul>` (`Sidebar.Menu`). A `<ul>`
  // at this level would have non-`<li>` children — an axe `list` violation.
  return (
    <Sidebar.Content
      data-slot="app-shell-sidebar-content"
      className={cn(
        'flex-1 gap-4 overflow-x-hidden overflow-y-auto scroll-fade-y px-4 py-2',
        className,
      )}
      {...props}
    >
      {children}
    </Sidebar.Content>
  );
}

function AppShellSidebarGroup({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Group> & {
  title?: string;
}) {
  return (
    <Sidebar.Group
      data-slot="app-shell-sidebar-group"
      className={cn('p-0', className)}
      {...props}
    >
      {title && (
        <span className="text-xs text-muted-foreground/50 font-medium uppercase p-2 group-data-[collapsible=icon]:hidden">
          {title}
        </span>
      )}

      {/* Each group owns the actual `<ul>` so its `AppShell.SidebarItem`s
          (`<li>`s) always have a list parent — groups themselves can sit in
          any plain container (SidebarContent, SidebarSection). */}
      <Sidebar.GroupContent>
        <Sidebar.Menu>{children}</Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
}

/* -------------------------------------------------------------------------
 * Sidebar item
 * ---------------------------------------------------------------------- */

function itemAnimation({
  direction = 'up',
  px = 10,
  duration = ANIMATION.DURATION_FLOAT,
  delay = 0,
  reverse = false,
}: {
  direction?: 'left' | 'right' | 'up' | 'down';
  px?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
} = {}) {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';

  const initial = { opacity: 0, [axis]: px * (!reverse ? -1 : 1) };
  const animate = { opacity: 1, [axis]: 0 };
  const exit = {
    opacity: 0,
    [axis]: px * (!reverse ? -1 : 1),
    ...(delay > 0 ? { transition: { duration } } : {}),
  };
  const transition = delay > 0 ? { duration, delay } : { duration };

  return { initial, animate, exit, transition };
}

const DROPDOWN_CHILD_STAGGER_DELAY = 0.035;
const MAX_DROPDOWN_CHILD_STAGGER_DELAY = 0.14;

export type AppShellSidebarItemData = {
  title: string;
  icon?: IconType | React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Marks the item as the current route. The shell has no router — compute it in the app. */
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** "Coming soon" — disabled with a clock hint. */
  soon?: boolean;
  /** External link — opens in a new tab with a hint icon. */
  external?: boolean;
  items?: AppShellSidebarItemData[];
};

type AppShellSidebarItemProps = AppShellSidebarItemData & {
  index?: number;
  isDropdownChild?: boolean;
  level?: number;
};

function AppShellSidebarItem({
  index = 0,
  isDropdownChild = false,
  level = 0,
  ...item
}: AppShellSidebarItemProps) {
  const [open, setOpen] = React.useState(false);

  const hasItems = !!item.items && item.items.length > 0;
  const hasHref = !!item.href;
  const hasLinkedChildren = hasItems && hasHref && !item.onClick;

  const isLoading = item.loading || false;
  const isSoon = item.soon || false;
  const isExternal = item.external || false;

  const isDisabled = isLoading || item.disabled || isSoon || false;

  const useSplitDropdownLayout = hasLinkedChildren && !isLoading;

  const isActive = !isDisabled && !isLoading && !!item.active;

  const buttonClassName =
    'relative z-10 group/menu-button hover:bg-sidebar-accent! data-[active=true]:bg-transparent data-[active=false]:hover:text-foreground/75 h-auto! p-2.5! text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] cursor-pointer group-data-[collapsible=icon]:justify-center';

  const itemStyle = {
    marginLeft: `${level * 16}px`,
    maxWidth: `calc(100% - ${level * 16}px)`,
  };

  const dropdownChildDelay = isDropdownChild
    ? Math.min(
        index * DROPDOWN_CHILD_STAGGER_DELAY,
        MAX_DROPDOWN_CHILD_STAGGER_DELAY,
      )
    : 0;

  const handleNavigateClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault();
    }
  };

  const handleToggleItems = () => {
    if (!isDisabled && hasItems) {
      setOpen(open => !open);
    }
  };

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    } else if (!isDisabled && hasItems) {
      handleToggleItems();
    }
  };

  const icon = (
    <div
      className={cn(
        'flex items-center justify-center size-4 aspect-square',
        isActive ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {typeof item.icon === 'string' ? (
        <Icon name={item.icon as IconType} />
      ) : (
        item.icon
      )}
    </div>
  );

  const trailing = isLoading ? (
    <Loader
      variant="button"
      iconClassName="size-4 min-w-4 min-h-4"
      className="ml-auto mr-0.5 shrink-0 text-muted-foreground"
    />
  ) : (
    <AnimatePresence mode="popLayout">
      {[hasItems, isSoon, isExternal].some(Boolean) && (
        <motion.div
          key="trailing"
          {...itemAnimation({ direction: 'right', reverse: true })}
          className={cn(
            'flex items-center gap-2 group-data-[collapsible=icon]:hidden',
            !hasLinkedChildren && 'ml-auto',
          )}
        >
          {isSoon ? (
            <Icon name="Clock" className="size-3 opacity-50" />
          ) : isExternal ? (
            <Icon
              name="ShareUpRight"
              className="size-3 opacity-50 group-hover/menu-button:opacity-100 group-hover/menu-button:text-link"
            />
          ) : hasItems ? (
            <Icon
              data-open={open}
              name="ChevronDown"
              className="size-3 transition-transform duration-300 data-[open=true]:rotate-180"
            />
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const isPlainLink = !hasItems && !item.onClick;

  // A real `<li>` — items live inside the group's `Sidebar.Menu`/submenu
  // `<ul>`s, and the axe `list` rule requires their direct children to be
  // list items.
  return (
    <motion.li
      {...itemAnimation({ direction: 'left', delay: dropdownChildDelay })}
      suppressHydrationWarning
      data-open={open}
      data-disabled={isDisabled}
      className="relative flex list-none flex-col group/menu-item data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
    >
      {useSplitDropdownLayout ? (
        <div
          className="relative z-10 flex w-full min-w-0 gap-1"
          style={itemStyle}
        >
          <Sidebar.MenuButton
            asChild
            data-open={open}
            data-active={isActive}
            data-index={index}
            data-level={level}
            data-disabled={isDisabled}
            disabled={isDisabled}
            className={cn(buttonClassName, 'min-w-0 flex-1')}
          >
            <a
              href={item.href && !isDisabled ? item.href : '#'}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              onClick={handleNavigateClick}
              suppressHydrationWarning
              title={item.title}
              className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center"
            >
              {icon}

              <span
                data-active={isActive}
                className="truncate text-sm group-data-[collapsible=icon]:hidden"
              >
                {item.title}
              </span>
            </a>
          </Sidebar.MenuButton>

          <Sidebar.MenuButton
            type="button"
            data-open={open}
            data-active={isActive}
            data-index={index}
            data-level={level}
            data-disabled={isDisabled}
            disabled={isDisabled}
            aria-expanded={open}
            aria-label={`${item.title} submenu`}
            onClick={handleToggleItems}
            className={cn(
              buttonClassName,
              'w-10 shrink-0 justify-center p-2.5! group-data-[collapsible=icon]:hidden',
            )}
          >
            {trailing}
          </Sidebar.MenuButton>
        </div>
      ) : (
        <Sidebar.MenuButton
          asChild={isPlainLink}
          data-open={open}
          data-active={isActive}
          data-index={index}
          data-level={level}
          data-disabled={isDisabled}
          disabled={isDisabled}
          onClick={hasItems || item.onClick ? handleClick : undefined}
          title={item.title}
          className={buttonClassName}
          style={itemStyle}
        >
          {isPlainLink ? (
            <a
              href={item.href && !isDisabled ? item.href : '#'}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              onClick={handleNavigateClick}
              suppressHydrationWarning
              title={item.title}
              className="flex w-full min-w-0 items-center gap-2 group-data-[collapsible=icon]:justify-center"
            >
              {icon}

              <span
                data-active={isActive}
                className="text-sm min-w-0 truncate group-data-[collapsible=icon]:hidden"
              >
                {item.title}
              </span>

              {trailing}
            </a>
          ) : (
            <>
              {icon}

              <span
                data-active={isActive}
                className="text-sm group-data-[collapsible=icon]:hidden"
              >
                {item.title}
              </span>

              {trailing}
            </>
          )}
        </Sidebar.MenuButton>
      )}

      <AnimatePresence initial={false}>
        {hasItems && open && (
          <motion.ul
            animate={{ height: 'auto', opacity: 1, padding: '0.25rem 0' }}
            initial={{ height: 0, opacity: 0, padding: 0 }}
            exit={{ height: 0, opacity: 0, padding: 0 }}
            transition={{
              duration: ANIMATION.DURATION_FLOAT,
              ease: 'easeInOut',
            }}
            data-open={open}
            className="w-full min-w-0 flex flex-col space-y-1 z-0 overflow-hidden"
          >
            {item.items?.map((childItem, childIndex) => (
              <AppShellSidebarItem
                key={`${childItem.title}-${childIndex}`}
                {...childItem}
                index={childIndex}
                isDropdownChild
                level={level + 1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------
 * Command palette button
 * ---------------------------------------------------------------------- */

function AppShellCommandButton({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="app-shell-command-button"
      title="Pesquisar"
      className={cn(
        'flex h-12 w-full min-w-0 cursor-pointer items-center rounded-xl border-2 border-sidebar-accent bg-transparent p-2.5 text-left text-sm text-muted-foreground outline-none transition-all hover:bg-sidebar-accent/30 focus-visible:border-transparent focus-visible:ring-[3px] focus-visible:ring-ring/50 group-data-[collapsible=icon]:justify-center',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none flex w-full items-center gap-2 opacity-50 group-data-[collapsible=icon]:w-auto">
        {/* Search glyph only stands in for the label once collapsed to the rail. */}
        <Icon
          name="Magnifier"
          className="hidden size-4 shrink-0 group-data-[collapsible=icon]:block"
        />
        <span className="truncate group-data-[collapsible=icon]:hidden">
          {children}
        </span>
      </span>
    </button>
  );
}

function AppShellSidebarFooter({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Footer>) {
  return (
    <Sidebar.Footer
      data-slot="app-shell-sidebar-footer"
      className={cn('p-4', className)}
      {...props}
    >
      {children}
    </Sidebar.Footer>
  );
}

function AppShellCopyright({
  className,
  children,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      suppressHydrationWarning
      data-slot="app-shell-copyright"
      className={cn(
        'text-xs text-muted-foreground/50 p-2 group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * Header
 * ---------------------------------------------------------------------- */

function AppShellHeader({
  className,
  logo,
  title,
  actions,
  user,
  leftSidebarTrigger,
  rightSidebarTrigger,
  leftSidebarToggleLabel = 'Toggle left sidebar',
  rightSidebarToggleLabel = 'Toggle right sidebar',
  mobileActionsClassName,
  ...props
}: Omit<React.ComponentProps<'div'>, 'title'> & {
  /** Mobile-only logo slot (top-left). */
  logo?: React.ReactNode;
  /** Page title area (both breakpoints). */
  title?: React.ReactNode;
  /** Right-side actions (both breakpoints). */
  actions?: React.ReactNode;
  /** Mobile-only user slot (top-right, e.g. avatar). */
  user?: React.ReactNode;
  /**
   * Left sidebar toggle slot (desktop header only — mobile has no sidebars).
   * Omit for the automatic trigger (shown while `leftSidebar` is enabled on
   * AppShell), pass a node to replace it (e.g.
   * `<AppShell.LeftSidebarTrigger icon="…" />`), or `null` to render none.
   */
  leftSidebarTrigger?: React.ReactNode;
  /**
   * Right sidebar toggle slot (desktop header only — mobile has no
   * sidebars). Omit for the automatic trigger (shown while `rightSidebar`
   * is enabled on AppShell), pass a node to replace it, or `null` to render
   * none.
   */
  rightSidebarTrigger?: React.ReactNode;
  /** Tooltip label of the auto-rendered left sidebar toggle. */
  leftSidebarToggleLabel?: string;
  /** Tooltip label of the auto-rendered right sidebar toggle. */
  rightSidebarToggleLabel?: string;
  mobileActionsClassName?: string;
}) {
  // One toggle per enabled side — the `leftSidebar`/`rightSidebar` props on
  // AppShell are the signal, so any sidebar combination (none, left, right,
  // both) gets exactly the toggles that apply. The `leftSidebarTrigger`/
  // `rightSidebarTrigger` slots override that default: a node replaces the
  // automatic trigger, `null` removes it.
  const leftSidebar = React.useContext(AppShellLeftSidebarContext);
  const rightSidebar = React.useContext(AppShellRightSidebarContext);

  const resolvedLeftTrigger =
    leftSidebarTrigger === undefined
      ? leftSidebar && (
          <AppShellLeftSidebarTrigger label={leftSidebarToggleLabel} />
        )
      : leftSidebarTrigger;

  const resolvedRightTrigger =
    rightSidebarTrigger === undefined
      ? rightSidebar && (
          <AppShellRightSidebarTrigger label={rightSidebarToggleLabel} />
        )
      : rightSidebarTrigger;

  return (
    <div
      data-slot="app-shell-header"
      className={cn('contents', className)}
      {...props}
    >
      <div className="lg:hidden flex items-center justify-between gap-2 md:gap-4 p-4 min-h-16 h-full max-h-16 glass-dashboard-header max-lg:sticky top-[calc(var(--announcement-height,0px)_+_var(--inset-top-height,0px))] z-50 transition-colors max-lg:border-b max-lg:border-border/70">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {logo && <div className="shrink-0 active:scale-99">{logo}</div>}

          <div className="flex min-h-7 min-w-0 flex-1 items-center overflow-hidden">
            <div className="flex min-w-0 flex-1 items-center">{title}</div>
          </div>
        </div>

        <div className={cn('flex gap-2 empty:hidden', mobileActionsClassName)}>
          {actions}
        </div>

        {user}
      </div>

      <div className="max-lg:hidden sticky top-[calc(var(--announcement-height,0px)_+_var(--inset-top-height,0px))] z-50 w-full flex min-w-0 items-center gap-2 md:gap-4 p-4 min-h-16 h-full max-h-16 border-b glass-dashboard-header border-border/70 transition-colors lg:rounded-t-2xl">
        {resolvedLeftTrigger}

        <div className="flex min-h-7 min-w-0 flex-1 items-center overflow-hidden">
          <div className="flex min-w-0 flex-1 items-center">{title}</div>
        </div>

        <div className="relative z-1 grid grid-flow-col shrink-0 ml-auto gap-2 md:gap-4">
          <div className="min-w-0 flex items-center gap-2 empty:hidden">
            {actions}
          </div>
        </div>

        {resolvedRightTrigger}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Mobile navbar
 * ---------------------------------------------------------------------- */

function AppShellNavbar({
  className,
  children,
  ...props
}: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="app-shell-navbar"
      onContextMenu={e => e.preventDefault()}
      className={cn(
        'fixed bottom-0 left-0 lg:hidden z-50 flex flex-col items-center justify-center w-full min-h-[100px] pointer-events-none transition-opacity duration-200',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 translate-y-px bg-linear-to-t from-black/80 to-transparent pointer-events-none -z-10 backdrop-blur-sm mask-t-from-0 mask-b-to-100" />

      {/* Not a `<ul>`: the direct child is a chrome `<div>` and the items are
          plain links/buttons, which violates the axe `list` rule on mobile. */}
      <div className="relative flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4 w-full h-full">
        <div className="flex items-center justify-center gap-1 w-fit glass-dashboard-chrome border border-border/50 p-1 rounded-2xl overflow-hidden z-10 pointer-events-auto">
          {children}
        </div>
      </div>
    </nav>
  );
}

function AppShellNavbarItem({
  className,
  icon,
  active = false,
  href,
  children,
  ...props
}: Omit<React.ComponentProps<'a'>, 'children'> & {
  icon?: IconType | React.ReactNode;
  active?: boolean;
  children?: React.ReactNode;
}) {
  const itemClassName = cn(
    'size-full flex items-center justify-center p-4 rounded-xl transition-colors text-xs cursor-pointer',
    'outline-none focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    active
      ? 'bg-primary/5 hover:bg-primary/25 dark:bg-primary/5 dark:hover:bg-primary/2'
      : 'bg-transparent hover:bg-accent/50',
    className,
  );

  const content =
    children ??
    (typeof icon === 'string' ? (
      <Icon
        name={icon as IconType}
        className={cn(
          'size-5 shrink-0',
          active ? 'text-primary' : 'text-muted-foreground',
        )}
      />
    ) : (
      icon
    ));

  if (href) {
    return (
      <a href={href} className={itemClassName} {...props}>
        {content}
      </a>
    );
  }

  const { onClick } = props as {
    onClick?: React.MouseEventHandler<HTMLElement>;
  };

  return (
    <button type="button" className={itemClassName} onClick={onClick}>
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------
 * Inset / loading
 * ---------------------------------------------------------------------- */

function AppShellInset({
  className,
  style,
  children,
  loading = false,
  spacing = 24,
  top,
  bottom,
  ...props
}: React.ComponentProps<'div'> & {
  /**
   * Shows a blocking loading overlay while keeping the shell (sidebar,
   * navbar) interactive. Content stays mounted but hidden.
   */
  loading?: boolean;
  /** Spacing scale unit for `--calculated-spacing` (bottom paddings, widget offsets). */
  spacing?: number;
  /**
   * Pinned row rendered above the inset panel, on the shell background.
   * The page keeps its normal document scroll — the row stays fixed on
   * screen (below the announcement banner) while the panel slides beneath
   * it, and the sticky Header docks right under it.
   */
  top?: React.ReactNode;
  /**
   * Pinned row rendered below the inset panel, on the shell background
   * (Linear-style). The page keeps its normal document scroll — the row
   * stays fixed at the bottom of the screen while the panel slides beneath
   * it. Below `lg`, the row hides automatically whenever an
   * `AppShell.Navbar` is mounted (the floating navbar owns that space).
   */
  bottom?: React.ReactNode;
}) {
  const leftSidebar = React.useContext(AppShellLeftSidebarContext);
  const rightSidebar = React.useContext(AppShellRightSidebarContext);

  const hasSidebar = Boolean(leftSidebar || rightSidebar);

  const columnRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  // Publish the pinned top row's height on the column so the sticky Header
  // inside the panel docks below the fixed row instead of overlapping it
  // (same pattern the AnnouncementBanner uses with the global
  // `--announcement-height`). Known SSR window: the variable only exists
  // after this client effect runs, so statically-rendered HTML painted with
  // a restored scroll position can show the Header behind the row until
  // hydration — unavoidable without a server-side measurement.
  React.useLayoutEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    const el = topRef.current;

    if (!top || !el) {
      column.style.setProperty('--inset-top-height', '0px');
      return;
    }

    const update = () => {
      // getBoundingClientRect over offsetHeight: the row's real height can be
      // fractional (zoom, non-16px root font); rounding it up would open a
      // hairline gap between the row and the docked Header.
      column.style.setProperty(
        '--inset-top-height',
        `${el.getBoundingClientRect().height}px`,
      );
    };

    update();

    if (typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      ro.disconnect();
      column.style.setProperty('--inset-top-height', '0px');
    };
  }, [top]);

  // Opaque shell-background behind the pinned rows so the panel scrolling
  // beneath them never shows through.
  const pinnedRowBackground = cn(
    'bg-dashboard-background',
    hasSidebar && 'lg:bg-sidebar',
  );

  return (
    // Transparent column that owns the inset's flex cell so pinned rows can
    // live outside the rounded panel, over the shell background. The page
    // keeps its document scroll: the sticky rows hold their screen position
    // while the panel in between slides normally.
    <div
      ref={columnRef}
      data-slot="app-shell-inset-column"
      className="relative flex w-full min-w-0 min-h-full flex-1 flex-col"
    >
      {/* Ternary (not `&&`) so falsy-numeric slot values like 0 render
          nothing instead of a stray "0" text node. */}
      {top ? (
        <div
          ref={topRef}
          data-slot="app-shell-inset-top"
          className={cn(
            'sticky top-(--announcement-height,0px) z-40 shrink-0',
            // On mobile the row and the panel share the same background —
            // without a divider, scrolling content is chopped at an
            // invisible line. Desktop gets a tonal boundary from bg-sidebar.
            'max-lg:border-b max-lg:border-border/70',
            pinnedRowBackground,
          )}
        >
          {top}
        </div>
      ) : null}

      <div
        data-slot="app-shell-inset"
        style={
          {
            '--sidebar-spacing': spacing,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          // No `w-full` here: the column's cross-axis stretch sizes the panel
          // to its width MINUS the side margins below — `w-full` + `mr-2`
          // would overflow the column by the margin, gluing the panel to the
          // viewport edge (and clipping its rounded corner) whenever the
          // right sidebar is collapsed.
          'relative flex flex-1 flex-col transition-[margin]',
          SIDEBAR_ANIMATION_DURATION,
          // The inset chrome (margins + rounding) only exists when at least one
          // sidebar provider frames the page; each margin collapses against the
          // side whose sidebar is expanded.
          hasSidebar && 'lg:m-2 lg:rounded-2xl',
          leftSidebar?.state === 'expanded' && 'lg:ml-0',
          rightSidebar?.state === 'expanded' && 'lg:mr-0',
          loading && 'min-h-0 overflow-hidden',
          'max-lg:bg-dashboard-background! bg-dashboard-background',
          '[--calculated-spacing:--spacing(var(--sidebar-spacing))]',
          // `isolate` keeps composited children (e.g. the glass header's
          // backdrop-filter) inside the rounded overflow clip on all engines.
          'min-w-0 isolate lg:overflow-clip',
          'max-lg:pb-(--calculated-spacing)',
          className,
        )}
        {...props}
      >
        {loading && <AppShellLoading />}

        <div
          aria-hidden={loading || undefined}
          className={cn(loading ? 'hidden' : 'contents')}
        >
          {children}
        </div>
      </div>

      {bottom ? (
        <div
          data-slot="app-shell-inset-bottom"
          className={cn(
            'sticky bottom-0 z-40 shrink-0',
            // Divider against the same-background panel on mobile (mirrors
            // the mobile Header's border-b).
            'max-lg:border-t max-lg:border-border/70',
            // The floating mobile Navbar (fixed bottom, z-50, ~100px tall)
            // would bury and cover this row — when a Navbar is mounted in
            // the shell, the row yields to it below `lg`.
            'max-lg:[[data-slot=app-shell]:has([data-slot=app-shell-navbar])_&]:hidden',
            pinnedRowBackground,
          )}
        >
          {bottom}
        </div>
      ) : null}
    </div>
  );
}

function AppShellLoading({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="app-shell-loading"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-dashboard-background',
        className,
      )}
      {...props}
    >
      <Loader />
    </div>
  );
}

const AppShell = Object.assign(AppShellRoot, {
  LeftSidebar: AppShellLeftSidebar,
  LeftSidebarProvider: AppShellLeftSidebarProvider,
  LeftSidebarTrigger: AppShellLeftSidebarTrigger,
  RightSidebar: AppShellRightSidebar,
  RightSidebarProvider: AppShellRightSidebarProvider,
  RightSidebarTrigger: AppShellRightSidebarTrigger,
  SidebarHeader: AppShellSidebarHeader,
  SidebarSection: AppShellSidebarSection,
  SidebarContent: AppShellSidebarContent,
  SidebarGroup: AppShellSidebarGroup,
  SidebarItem: AppShellSidebarItem,
  SidebarFooter: AppShellSidebarFooter,
  CommandButton: AppShellCommandButton,
  Copyright: AppShellCopyright,
  Header: AppShellHeader,
  Navbar: AppShellNavbar,
  NavbarItem: AppShellNavbarItem,
  Inset: AppShellInset,
  Loading: AppShellLoading,
});

export {
  AppShell,
  useAppShellLeftSidebar,
  useAppShellRightSidebar,
  useLeftSidebarToggle,
  useRightSidebarToggle,
};
