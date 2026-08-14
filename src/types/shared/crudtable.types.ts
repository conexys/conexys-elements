/**
 * @fileoverview
 */

import type { ButtonProps, StackProps } from '@mui/material';
import type { MRT_ColumnDef, MRT_VisibilityState } from 'material-react-table';

export interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  cancelText: string;
  submitText?: string;
  cancelColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  submitColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  isSubmitButton?: boolean;
  additionalButtons?: ButtonProps[];
  stackProps?: StackProps;
  /** Hide the <hr /> separator (use when rendered inside DialogActions which has its own border) */
  noHr?: boolean;
  /** Form ID to associate the submit button with (useful when buttons are outside the <form>) */
  formId?: string;
}

export interface TableProps {
  name: string;
  columns: MRT_ColumnDef<any>[];
  data: any[];
  isError?: boolean;
  renderRowActions?: (props: any) => React.ReactNode;
  renderTopToolbarCustomActions?: (props: any) => React.ReactNode;
  renderBottomToolbarCustomActions?: (props: any) => React.ReactNode;
  renderDetailPanel?: (props: any) => React.ReactNode;
  muiTableHeadCellProps?: any;
  muiTableBodyCellProps?: any;
  enableRowSelection?: boolean;
  enableColumnOrdering?: boolean;
  enablePinning?: boolean;
  enableRowActions?: boolean;
  enableColumnActions?: boolean;
  enableColumnFilters?: boolean;
  enableDensityToggle?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableFullScreenToggle?: boolean;
  enableHiding?: boolean;
  muiPaginationProps?: any;
  displayColumnDefOptions?: any;
  positionActionsColumn?: 'first' | 'last';
  enableExpandAll?: boolean;
  positionExpandColumn?: 'first' | 'last';
  muiTablePaperProps?: any;
  muiTableBodyProps?: any;
  paginationDisplayMode?: 'default' | 'pages';
  enableColumnDragging?: boolean;
  enableFilters?: boolean;
  initialColumnVisibility?: MRT_VisibilityState;
}

export interface UseTableDataReturn {
  formStatus: boolean;
  //setFormStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setFormStatus: (status: boolean) => void;
  triggerShow1: number;
  setTriggerShow1: React.Dispatch<React.SetStateAction<number>>;
  triggerEdit1: number;
  setTriggerEdit1: React.Dispatch<React.SetStateAction<number>>;
  triggerNew1: number;
  setTriggerNew1: React.Dispatch<React.SetStateAction<number>>;
  triggerPassword1: number;
  setTriggerPassword1: React.Dispatch<React.SetStateAction<number>>;
  triggerDel1: number;
  setTriggerDel1: React.Dispatch<React.SetStateAction<number>>;
  triggerDelMulti1: number;
  setTriggerDelMulti1: React.Dispatch<React.SetStateAction<number>>;
  triggerShow2: number;
  setTriggerShow2: React.Dispatch<React.SetStateAction<number>>;
  triggerEdit2: number;
  setTriggerEdit2: React.Dispatch<React.SetStateAction<number>>;
  triggerNew2: number;
  setTriggerNew2: React.Dispatch<React.SetStateAction<number>>;
  triggerPassword2: number;
  setTriggerPassword2: React.Dispatch<React.SetStateAction<number>>;
  triggerDel2: number;
  setTriggerDel2: React.Dispatch<React.SetStateAction<number>>;
  triggerDelMulti2: number;
  setTriggerDelMulti2: React.Dispatch<React.SetStateAction<number>>;
  triggerShowMs1: number;
  setTriggerShowMs1: React.Dispatch<React.SetStateAction<number>>;
  triggerShowMs2: number;
  setTriggerShowMs2: React.Dispatch<React.SetStateAction<number>>;
  triggerVarious1: number;
  setTriggerVarious1: React.Dispatch<React.SetStateAction<number>>;
  triggerVarious2: number;
  setTriggerVarious2: React.Dispatch<React.SetStateAction<number>>;
  triggerRes1: number;
  setTriggerRes1: React.Dispatch<React.SetStateAction<number>>;
  triggerRes2: number;
  setTriggerRes2: React.Dispatch<React.SetStateAction<number>>;
  triggerResMulti1: number;
  setTriggerResMulti1: React.Dispatch<React.SetStateAction<number>>;
  triggerResMulti2: number;
  setTriggerResMulti2: React.Dispatch<React.SetStateAction<number>>;
  triggerDis1: number;
  setTriggerDis1: React.Dispatch<React.SetStateAction<number>>;
  triggerDis2: number;
  setTriggerDis2: React.Dispatch<React.SetStateAction<number>>;
  triggerEna1: number;
  setTriggerEna1: React.Dispatch<React.SetStateAction<number>>;
  triggerEna2: number;
  setTriggerEna2: React.Dispatch<React.SetStateAction<number>>;
  trigger1: number;
  setTrigger1: React.Dispatch<React.SetStateAction<number>>;
  trigger2: number;
  setTrigger2: React.Dispatch<React.SetStateAction<number>>;
  trigger3: number;
  setTrigger3: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  idmulti: string;
  setIdMulti: React.Dispatch<React.SetStateAction<string>>;
  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  msgTitle: string;
  setMsgTitle: React.Dispatch<React.SetStateAction<string>>;
  msgAuthor: string;
  setMsgAuthor: React.Dispatch<React.SetStateAction<string>>;
  msgTarget: string;
  setMsgTarget: React.Dispatch<React.SetStateAction<string>>;
  msgDate: string;
  setMsgDate: React.Dispatch<React.SetStateAction<string>>;
  msgMessage: string;
  setMsgMessage: React.Dispatch<React.SetStateAction<string>>;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  handleFormSubmit: any;
  handleFormDelete: any;
  handleFormDeleteMulti: any;
  handleFormRestoreMulti: any;
  handleInputChange: any;
  handleFormRestore: any;
  formInputs: any;
}

export interface UseTableDataInstallReturn {
  formStatus: boolean;
  //setFormStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setFormStatus: (status: boolean) => void;
  triggerShow1: number;
  setTriggerShow1: React.Dispatch<React.SetStateAction<number>>;
  triggerEdit1: number;
  setTriggerEdit1: React.Dispatch<React.SetStateAction<number>>;
  triggerNew1: number;
  setTriggerNew1: React.Dispatch<React.SetStateAction<number>>;
  triggerPassword1: number;
  setTriggerPassword1: React.Dispatch<React.SetStateAction<number>>;
  triggerDel1: number;
  setTriggerDel1: React.Dispatch<React.SetStateAction<number>>;
  triggerDelMulti1: number;
  setTriggerDelMulti1: React.Dispatch<React.SetStateAction<number>>;
  triggerShow2: number;
  setTriggerShow2: React.Dispatch<React.SetStateAction<number>>;
  triggerEdit2: number;
  setTriggerEdit2: React.Dispatch<React.SetStateAction<number>>;
  triggerNew2: number;
  setTriggerNew2: React.Dispatch<React.SetStateAction<number>>;
  triggerPassword2: number;
  setTriggerPassword2: React.Dispatch<React.SetStateAction<number>>;
  triggerDel2: number;
  setTriggerDel2: React.Dispatch<React.SetStateAction<number>>;
  triggerDelMulti2: number;
  setTriggerDelMulti2: React.Dispatch<React.SetStateAction<number>>;
  triggerShowMs1: number;
  setTriggerShowMs1: React.Dispatch<React.SetStateAction<number>>;
  triggerShowMs2: number;
  setTriggerShowMs2: React.Dispatch<React.SetStateAction<number>>;
  triggerVarious1: number;
  setTriggerVarious1: React.Dispatch<React.SetStateAction<number>>;
  triggerVarious2: number;
  setTriggerVarious2: React.Dispatch<React.SetStateAction<number>>;
  triggerRes1: number;
  setTriggerRes1: React.Dispatch<React.SetStateAction<number>>;
  triggerRes2: number;
  setTriggerRes2: React.Dispatch<React.SetStateAction<number>>;
  triggerResMulti1: number;
  setTriggerResMulti1: React.Dispatch<React.SetStateAction<number>>;
  triggerResMulti2: number;
  setTriggerResMulti2: React.Dispatch<React.SetStateAction<number>>;
  triggerDis1: number;
  setTriggerDis1: React.Dispatch<React.SetStateAction<number>>;
  triggerDis2: number;
  setTriggerDis2: React.Dispatch<React.SetStateAction<number>>;
  triggerEna1: number;
  setTriggerEna1: React.Dispatch<React.SetStateAction<number>>;
  triggerEna2: number;
  setTriggerEna2: React.Dispatch<React.SetStateAction<number>>;
  trigger1: number;
  setTrigger1: React.Dispatch<React.SetStateAction<number>>;
  trigger2: number;
  setTrigger2: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  idmulti: string;
  setIdMulti: React.Dispatch<React.SetStateAction<string>>;
  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  msgTitle: string;
  setMsgTitle: React.Dispatch<React.SetStateAction<string>>;
  msgAuthor: string;
  setMsgAuthor: React.Dispatch<React.SetStateAction<string>>;
  msgTarget: string;
  setMsgTarget: React.Dispatch<React.SetStateAction<string>>;
  msgDate: string;
  setMsgDate: React.Dispatch<React.SetStateAction<string>>;
  msgMessage: string;
  setMsgMessage: React.Dispatch<React.SetStateAction<string>>;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  handleFormSubmit: any;
  handleFormDelete: any;
  handleInputChange: any;
}
