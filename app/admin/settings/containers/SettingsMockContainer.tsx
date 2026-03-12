'use client'

import { SettingsView } from '../components/SettingsView'
import { useSettingsMock } from '@/hooks/use-settings-mock'

export function SettingsMockContainer() {
  const props = useSettingsMock()
  return <SettingsView {...props} />
}
