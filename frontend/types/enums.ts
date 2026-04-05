export enum OrderStatus {
  Pending    = 'pending',
  Confirmed  = 'confirmed',
  Processing = 'processing',
  Shipped    = 'shipped',
  Delivered  = 'delivered',
  Cancelled  = 'cancelled',
}

export enum UserRole {
  Admin   = 'admin',
  Manager = 'manager',
  Viewer  = 'viewer',
}

export enum ProductUnit {
  Piece   = 'шт',
  Kg      = 'кг',
  Liter   = 'л',
  Package = 'уп',
}

export enum NotificationType {
  Success = 'success',
  Error   = 'error',
  Warning = 'warning',
  Info    = 'info',
}
