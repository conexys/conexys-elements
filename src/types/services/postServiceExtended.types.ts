/**
 * @fileoverview
 */

export interface FormItem {
  items?: any[];
  url?: string;
  itemKey?: string;
  textitemKey?: string;
  [key: string]: any;
}

export interface DataConverted {
  item: any;
  textitem: string;
}

export interface RenderResponse {
  data: string;
  code: any;
  permission: any;
}
