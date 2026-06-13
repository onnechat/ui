import type { IconProps } from 'nucleo-ui-fill-18'

import type { ComponentType } from 'react'

type NucleoModule = Record<string, unknown>

export function buildNucleoRegistry(
  nucleoModule: NucleoModule,
  suffix: 'Fill18' | 'FillDuo18',
): Record<string, ComponentType<IconProps>> {
  const registry: Record<string, ComponentType<IconProps>> = {}

  for (const exportName of Object.keys(nucleoModule)) {
    if (exportName === 'Icon' || !exportName.endsWith(suffix)) continue

    const name = exportName.slice(4, -suffix.length)
    const component = nucleoModule[exportName]

    if (typeof component === 'function') {
      registry[name] = component as ComponentType<IconProps>
    }
  }

  return registry
}

export type NucleoExportToName<
  T extends string,
  TSuffix extends string,
> = T extends `Icon${infer Name}${TSuffix}` ? Name : never
