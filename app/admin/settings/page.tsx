'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { SettingsApiContainer } from './containers/SettingsApiContainer'
import { SettingsMockContainer } from './containers/SettingsMockContainer'

export default function SettingsPage() {
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)

  if (dataSource === 'api') {
    return <SettingsApiContainer />
  }
  return <SettingsMockContainer />
}
