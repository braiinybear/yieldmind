import { createStore } from "zustand/vanilla";
import { ApplicationStatus, JobApplication } from "@prisma/client";

export type JobApplicationWithRelations = JobApplication & {
  JobPosition: {
    id: string;
    title: string;
    department: string;
    location?: string;
    employmentType?: string;
  };
  User: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateJobApplicationPayload = {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  skills: string[];
  resumeUrl: string;
  coverLetter?: string;
};

export type UpdateJobApplicationPayload = {
  status: ApplicationStatus;
  feedback?: string;
};

export type JobApplicationState = {
  JobApplicationData: JobApplicationWithRelations[];
  loading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
};

export type JobApplicationActions = {
  fetchJobApplications: (filters?: { jobId?: string; status?: ApplicationStatus }) => Promise<void>;
  createJobApplication: (data: CreateJobApplicationPayload) => Promise<void>;
  updateJobApplication: (id: string, data: UpdateJobApplicationPayload) => Promise<void>;
  deleteJobApplication: (id: string) => Promise<void>;
};

export type JobApplicationStoreType = JobApplicationState & JobApplicationActions;

export const defaultInitState: JobApplicationState = {
  JobApplicationData: [],
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
};

export const JobApplicationStore = (initState: JobApplicationState = defaultInitState) => {
  return createStore<JobApplicationStoreType>((set) => ({
    ...initState,

    fetchJobApplications: async (filters) => {
      try {
        set((state) => ({
          loading: { ...state.loading, fetch: true },
          error: null,
        }));

        const searchParams = new URLSearchParams();
        if (filters?.jobId) searchParams.append('jobId', filters.jobId);
        if (filters?.status) searchParams.append('status', filters.status);

        const queryString = searchParams.toString();
        const url = `/api/jobapplication${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch job applications");

        const data = await res.json();
        set((state) => ({
          JobApplicationData: data.data,
          loading: { ...state.loading, fetch: false },
        }));
      } catch (err: unknown) {
        set((state) => ({
          error: err instanceof Error ? err.message : "Something went wrong",
          loading: { ...state.loading, fetch: false },
        }));
      }
    },

    createJobApplication: async (payload) => {
      try {
        set((state) => ({
          loading: { ...state.loading, create: true },
          error: null,
        }));

        const res = await fetch("/api/jobapplication", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Job application submission failed");
        }

        const responseData = await res.json();
        const newJobApplication = responseData.data;

        set((state) => ({
          JobApplicationData: [...state.JobApplicationData, newJobApplication],
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

    updateJobApplication: async (id, payload) => {
      try {
        set((state) => ({
          loading: { ...state.loading, update: true },
          error: null,
        }));

        const res = await fetch("/api/jobapplication", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, ...payload }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Job application update failed");
        }

        const responseData = await res.json();
        const updatedJobApplication = responseData.data;

        set((state) => ({
          JobApplicationData: state.JobApplicationData.map((jobApplication) =>
            jobApplication.id === id ? updatedJobApplication : jobApplication,
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

    deleteJobApplication: async (id) => {
      try {
        set((state) => ({
          loading: { ...state.loading, delete: true },
          error: null,
        }));

        const res = await fetch(`/api/jobapplication/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Job application deletion failed");
        }

        set((state) => ({
          JobApplicationData: state.JobApplicationData.filter((jobApplication) => jobApplication.id !== id),
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
