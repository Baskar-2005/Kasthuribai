import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Issue {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  issueType: string;
  description: string;
  status: IssueStatus;
  adminReply?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IssuesStore {
  issues: Issue[];
  raiseIssue: (input: {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    issueType: string;
    description: string;
  }) => void;
  markRead: (issueId: string) => void;
  markAllRead: () => void;
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
  replyToIssue: (issueId: string, reply: string, status?: IssueStatus) => void;
  getUnreadCount: () => number;
}

export const useIssues = create<IssuesStore>()(
  persist(
    (set, get) => ({
      issues: [],

      raiseIssue: (input) => {
        const issue: Issue = {
          id: `ISS-${Date.now()}`,
          ...input,
          status: 'open',
          read: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ issues: [issue, ...state.issues] }));
      },

      markRead: (issueId) => {
        set((state) => ({
          issues: state.issues.map((i) =>
            i.id === issueId ? { ...i, read: true } : i
          ),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          issues: state.issues.map((i) => ({ ...i, read: true })),
        }));
      },

      updateIssueStatus: (issueId, status) => {
        set((state) => ({
          issues: state.issues.map((i) =>
            i.id === issueId
              ? { ...i, status, updatedAt: new Date().toISOString() }
              : i
          ),
        }));
      },

      replyToIssue: (issueId, reply, status = 'resolved') => {
        set((state) => ({
          issues: state.issues.map((i) =>
            i.id === issueId
              ? { ...i, adminReply: reply, status, read: true, updatedAt: new Date().toISOString() }
              : i
          ),
        }));
      },

      getUnreadCount: () => get().issues.filter((i) => !i.read).length,
    }),
    { name: 'kasthuribai-issues-v1' },
  ),
);

// ── Cross-tab sync: when another tab writes issues to localStorage, re-hydrate ──
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'kasthuribai-issues-v1') {
      useIssues.persist.rehydrate();
    }
  });
}
