'use client'

import { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'

import { CourseStore, CourseStoreType } from '@/zustand/stores/admin-store/course-store'
import { JobPositionStore, JobPositionStoreType } from '@/zustand/stores/admin-store/jobposition-store'
import { JobApplicationStore, JobApplicationStoreType } from '@/zustand/stores/admin-store/jobapplication-store'

/* ---------- Store Types ---------- */

type RootStores = {
  courseStore: ReturnType<typeof CourseStore>
  jobPositionStore: ReturnType<typeof JobPositionStore>
  jobApplicationStore: ReturnType<typeof JobApplicationStore>
}

/* ---------- Context ---------- */

const RootStoreContext = createContext<RootStores | null>(null)

/* ---------- Provider ---------- */

export const RootStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores] = useState<RootStores>(() => ({
    courseStore: CourseStore(),
    jobPositionStore: JobPositionStore(),
    jobApplicationStore: JobApplicationStore(),
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

export const useJobPositionStore = <T,>(
  selector: (store: JobPositionStoreType) => T,
): T => {
  const context = useContext(RootStoreContext)

  if (!context) {
    throw new Error('useJobPositionStore must be used inside RootStoreProvider')
  }

  return useStore(context.jobPositionStore, selector)
}

export const useJobApplicationStore = <T,>(
  selector: (store: JobApplicationStoreType) => T,
): T => {
  const context = useContext(RootStoreContext)

  if (!context) {
    throw new Error('useJobApplicationStore must be used inside RootStoreProvider')
  }

  return useStore(context.jobApplicationStore, selector)
}
