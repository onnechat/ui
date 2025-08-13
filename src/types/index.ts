export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'warning'
  | 'success'
  | 'ghost'
  | 'link'
  | 'outline'
  | 'default';

export type ComponentSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';
