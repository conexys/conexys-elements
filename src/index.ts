/**
 * Conexys Components - React UI Library
 * @module conexys-elements
 */

// Export main components
export {
  AppDataSettings,
  AppDataSettingsHTML,
  AppError,
  AppFormFields,
  AppFormFieldsFromConfig,
  AppFormFieldsNoUser,
  AppFormFieldsTable,
  AppHeaderPage,
  AppHeaderPage404,
  AppSetHeaderTitle,
  ErrorBoundary,
  NotFound,
  Uservalidationerror,
  AppDialogModal,
  LanguageSet,
} from './components';

// Export BackendStatus components
export {
  BackendStatusProvider,
  useBackendStatus,
  BackendOfflinePage,
} from './components/BackendStatus';

// Export theme components
export {
  Card,
  CardDashboard,
  CardUser,
  Loading,
  Mailbox,
  MailTemplateWidget,
  MessagesBlock,
  Timeline,
  UserWidget,
} from './components/theme';

// Export ActionButtons
export { ActionButtons } from './shared/crudtable/ActionButtons';
export { Table } from './shared/crudtable/Table';
export { useTableData } from './shared/crudtable/useTableData';
export { useTableDataInstall } from './shared/crudtable/useTableDataInstall';

export { ThemeContextProvider } from './ThemeContext';
export { AuthContext, useAuth } from './Auth';

// Export shared services
export { initializeSharedServices } from './shared/sharedServicesAPI';
export { initializeSharedComponents } from './shared/sharedComponentsAPI';

// Export form components
export { default as RenderForm } from './components/form/RenderForm';
export {
  Button,
  Checkbox,
  Heading,
  Image,
  Info,
  InputFile,
  InputPassword,
  InputText,
  InputWYSIWYG,
  Radiobutton,
  Select,
  Switch,
  Text,
} from './components/form/components';

// Export API services
export {
  servicePostBasic,
  serviceData,
  servicePost,
  servicePost2,
  servicePostData,
  serviceLockscreen,
  serviceLogout,
  serviceFavorites,
  serviceGetFavorites,
} from './services/postServiceExtended';

export { servicePatch2 } from './services/patchServiceExtended';

export { patchservice } from './services/patchService';

export { default as patchFormService } from './services/patchFormService';

export { serviceDelete2 } from './services/deleteServiceExtended';

export { deleteservice } from './services/deleteService';

export { default as deleteFormService } from './services/deleteFormService';

export { postservice } from './services/postService';

export { getservice } from './services/getService';

export {
  getServiceBasic,
  getservice2,
  getServiceData,
} from './services/getServiceExtended';

// Export postFormService
export { default as postFormService } from './services/postFormService';

// Export utilities
export { getOrSetFingerprint } from './shared/baseFingerprintService';
export { Url } from './constants/global';
export { authStorage } from './utilities/authStorage';
export { checkAuth } from './utilities/checkAuth';
export { logConsole } from './utilities/logConsole';
export { default as GenerateRandomPassword } from './utilities/GenerateRandomPassword';

// Export configuration
export {
  ConexysConfigProvider,
  useConexysConfig,
  isDevelopmentMode,
  type ConexysConfig,
} from './config/ConexysConfig';

// Export hooks
export { default as useCustomFormNormal } from './hooks/FormHooksNormal';
export { default as useCustomFormGetPost } from './hooks/FormHooksNormalGetPost';
export { default as useCustomFormMulti } from './hooks/FormHooksNormalMulti';
export { default as useCustomFormUpload } from './hooks/FormHooksUpload';
export { default as useCustomFormUploadPatch } from './hooks/FormHooksUploadPatch';
export { default as useCustomFormNormalNoUser } from './hooks/FormHooksNormalNoUser';
export { useFingerprintJS } from './hooks/useFingerprintJS';
export { useLanguageSync } from './hooks/useLanguageSync';
export { useZoomPrevention } from './hooks/useZoomPrevention';
export { useSocket } from './hooks/useSocket';
export type { SocketState } from './hooks/useSocket';
export { default as MRT_Localization } from './hooks/MRT_Localization';

// ── Permission System (Fase 2) ────────────────────────────────
export { usePermission } from './hooks/usePermission';
export { PermissionGate } from './components/PermissionGate';
export {
  PermissionProvider,
  usePermissionContext,
} from './context/PermissionContext';

// Permission types
export type {
  PermissionLevel,
  PermissionValue,
  ModulePermission,
  ModulePermissions,
  PermissionRequired,
  PermissionResult,
  UsePermissionOptions,
} from './types/permission.types';
