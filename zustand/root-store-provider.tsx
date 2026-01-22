'use client'

import { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'

import { CourseStore, CourseStoreType } from '@/zustand/stores/admin-store/course-store'

/* ---------- Store Types ---------- */

type RootStores = {
  courseStore: ReturnType<typeof CourseStore>
}

/* ---------- Context ---------- */

const RootStoreContext = createContext<RootStores | null>(null)

/* ---------- Provider ---------- */

export const RootStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores] = useState<RootStores>(() => ({
    courseStore: CourseStore(),
  }))

  return (
    <RootStoreContext.Provider value={stores}>
      {children}
    </RootStoreContext.Provider>
  )
}

/* ---------- Hooks ---------- */

export const useCourseStore = <T,>(
  selector: (store: CourseStoreType) => T,
): T => {
  const context = useContext(RootStoreContext)

  if (!context) {
    throw new Error('useCourseStore must be used inside RootStoreProvider')
  }

  return useStore(context.courseStore, selector)
}
