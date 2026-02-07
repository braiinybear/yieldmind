import { createStore } from "zustand/vanilla";
import { CreateJobPositionPayload } from "@/components/admin/JobPositionForm";
import { JobPositionWithRelations } from "@/app/api/jobpositions/route";

export type JobPositionState = {
  JobPositionData: JobPositionWithRelations[];
  loading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
};

export type JobPositionActions = {
  fetchJobPositions: () => Promise<void>;
  createJobPosition: (data: CreateJobPositionPayload) => Promise<void>;
  updateJobPosition: (id: string, data: CreateJobPositionPayload) => Promise<void>;
  deleteJobPosition: (id: string) => Promise<void>;
};

export type JobPositionStoreType = JobPositionState & JobPositionActions;

export const defaultInitState: JobPositionState = {
  JobPositionData: [],
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
};

export const JobPositionStore = (initState: JobPositionState = defaultInitState) => {
  return createStore<JobPositionStoreType>((set) => ({
    ...initState,

    fetchJobPositions: async () => {
      try {
        set((state) => ({
          loading: { ...state.loading, fetch: true },
          error: null,
        }));

        const res = await fetch("/api/jobpositions");
        if (!res.ok) throw new Error("Failed to fetch job positions");

        const data = await res.json();
        set((state) => ({
          JobPositionData: data.data,
          loading: { ...state.loading, fetch: false },
        }));
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : "Something went wrong",
          loading: { ...state.loading, fetch: false },
        }));
      }
    },

    createJobPosition: async (payload) => {
      try {
        set((state) => ({
          loading: { ...state.loading, create: true },
          error: null,
        }));

        const res = await fetch("/api/jobpositions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Job position creation failed");

        const responseData = await res.json();
        const newJobPosition = responseData.data;

        set((state) => ({
          JobPositionData: [...state.JobPositionData, newJobPosition],
          loading: { ...state.loading, create: false },
        }));
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : "Something went wrong",
          loading: { ...state.loading, create: false },
        }));
        throw err;
      }
    },

    updateJobPosition: async (id, payload) => {
      try {
        set((state) => ({
          loading: { ...state.loading, update: true },
          error: null,
        }));

        const res = await fetch(`/api/jobpositions/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Job position update failed");

        const responseData = await res.json();
        const updatedJobPosition = responseData.data;

        set((state) => ({
          JobPositionData: state.JobPositionData.map((jobPosition) =>
            jobPosition.id === id ? updatedJobPosition : jobPosition,
          ),
          loading: { ...state.loading, update: false },
        }));
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : "Something went wrong",
          loading: { ...state.loading, update: false },
        }));
        throw err;
      }
    },

    deleteJobPosition: async (id) => {
      try {
        set((state) => ({
          loading: { ...state.loading, delete: true },
          error: null,
        }));

        const res = await fetch(`/api/jobpositions/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Job position deletion failed");

        set((state) => ({
          JobPositionData: state.JobPositionData.filter((jobPosition) => jobPosition.id !== id),
          loading: { ...state.loading, delete: false },
        }));
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : "Something went wrong",
          loading: { ...state.loading, delete: false },
        }));
        throw err;
      }
    },
  }));
};