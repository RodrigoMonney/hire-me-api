export interface Exception {
  title: string;
  status: number;
  detail: string | undefined;
  stack?: string[] | undefined;
  instance: string;
}
