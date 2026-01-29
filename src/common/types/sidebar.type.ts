export interface MenuType {
  name: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
  isActive: boolean;
}
