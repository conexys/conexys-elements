/**
 * @fileoverview
 */

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  inParagraph?: boolean;
}

export interface CardDashboardProps {
  title: string;
  children: React.ReactNode;
}

export interface CardUserProps {
  children: React.ReactNode;
  user: string;
  username?: string;
  profilepicture?: string;
  coverpicture?: string;
  fpHash: string;
}

export interface CoverStyles {
  backgroundImage: string;
  backgroundSize: string;
}

export interface LoadingProps {
  type?: string;
  error?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export interface MailboxProps {
  msgTitle: string;
  msgAuthor: string;
  msgTarget: string;
  msgDate: string;
  theObj: {
    __html: string;
  };
  t?: any;
}

export interface MailTemplateWidgetProps {
  id: string;
  fpHash: string;
}

export interface ThemeData {
  id: string | number;
  module: string | null;
  code: string | null;
  templateName: string | null;
  language: string | null;
  html: string | null;
  title: string | null;
}

export interface MessagesBlockProps {
  children: React.ReactNode;
  fpHash: string;
}

export interface UnreadCountTheme {
  message: number | string;
  notification: number | string;
  [key: string]: any;
}

export interface SpeedDialActionType {
  icon: React.JSX.Element;
  name: string;
}

export interface DateformatProps {
  date: string;
}

export interface HourformatProps {
  hour: string;
}

export interface UserLogItem {
  id: string;
  date: string;
  log: string;
  ip: string;
}

export interface UserWidgetProps {
  username: string;
  useravatar: string;
  fpHash: string;
}

export interface UserDataTheme {
  name: string;
  lastname: string;
  username: string;
  email: string;
  biography: string;
  profile_pic: string | null;
  cover_pic: string | null;
  user_type: string | number;
  [key: string]: any;
}
