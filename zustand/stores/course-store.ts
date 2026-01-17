import { createStore } from 'zustand/vanilla'
import { Course } from '@prisma/client'
import { CreateCoursePayload } from '@/components/admin/CourseForm'

/* ---------- Types ---------- */
export type CourseState = {
  courseData: Course[]
  loading: {
  fetch: boolean
  create: boolean
  update: boolean
  delete: boolean
}

  error: string | null
}

export type CourseActions = {
  fetchCourses: () => Promise<void>
  createCourse: (data: CreateCoursePayload) => Promise<void>
  updateCourse: (id: string, data: CreateCoursePayload) => Promise<void>
  deleteCourse: (id: string) => Promise<void>
}

export type CourseStoreType = CourseState & CourseActions

/* ---------- Initial State ---------- */
export const defaultInitState: CourseState = {
  courseData: [],
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false
  },
  error: null,
}

/* ---------- Store ---------- */
export const CourseStore = (
  initState: CourseState = defaultInitState,
) => {
  return createStore<CourseStoreType>((set) => ({
    ...initState,

    fetchCourses: async () => {
      try {
        set((state) => ({ 
          loading: { ...state.loading, fetch: true }, 
          error: null 
        }))

        const res = await fetch('/api/course')
        if (!res.ok) throw new Error('Failed to fetch courses')

        const data = await res.json()
        set((state) => ({ 
          courseData: data.data, 
          loading: { ...state.loading, fetch: false }
        }))
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : 'Something went wrong',
          loading: { ...state.loading, fetch: false },
        }))
      }
    },

    createCourse: async (payload) => {
      try {
        set((state) => ({ 
          loading: { ...state.loading, create: true }, 
          error: null 
        }))

        const res = await fetch('/api/course', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error('Course creation failed')

        const responseData = await res.json()
        const newCourse = responseData.data || responseData

        set((state) => ({
          courseData: [...state.courseData, newCourse],
          loading: { ...state.loading, create: false },
        }))
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : 'Something went wrong',
          loading: { ...state.loading, create: false },
        }))
        throw err
      }
    },

    updateCourse: async (id, payload) => {
      try {
        set((state) => ({ 
          loading: { ...state.loading, update: true }, 
          error: null 
        }))

        const res = await fetch(`/api/course/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error('Course update failed')

        const responseData = await res.json()
        const updatedCourse = responseData.data || responseData

        set((state) => ({
          courseData: state.courseData.map((course) => 
            course.id === id 
              ? updatedCourse
              : course
          ),
          loading: { ...state.loading, update: false },
        }))
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : 'Something went wrong',
          loading: { ...state.loading, update: false },
        }))
        throw err
      }
    },

    deleteCourse: async (id) => {
      try {
        set((state) => ({ 
          loading: { ...state.loading, delete: true }, 
          error: null 
        }))

        const res = await fetch(`/api/course/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) throw new Error('Course deletion failed')

        set((state) => ({
          courseData: state.courseData.filter((course) => course.id !== id),
          loading: { ...state.loading, delete: false },
        }))
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : 'Something went wrong',
          loading: { ...state.loading, delete: false },
        }))
        throw err
      }
    },
  }))
}
