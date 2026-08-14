/**
 * @fileoverview
 */

interface DeleteEvent {
  id: string;
}

export interface UseCustomFormMultiReturn {
  handleFormDeleteMulti: (event: DeleteEvent) => Promise<void>;
  handleFormRestoreMulti: (event: DeleteEvent) => Promise<void>;
  formStatus: boolean;
  loading: boolean;
  error: boolean;
}
