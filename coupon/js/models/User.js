/**
 * User Model - Base class for all user types (Admin, Dealer, Customer, etc)
 */

class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.username = data.username || '';
    this.email = data.email || '';
    this.mobile = data.mobile || '';
    this.fullName = data.fullName || '';
    this.password = data.password || '';
    this.role = data.role || 'customer'; // admin, dealer, customer
    this.status = data.status || 'active'; // active, inactive, suspended, pending
    this.profilePhoto = data.profilePhoto || null;
    this.lastLogin = data.lastLogin || null;
    this.preferences = data.preferences || {};
  }

  static getRequiredFields() {
    return ['username', 'email', 'mobile', 'fullName', 'password'];
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isDealer() {
    return this.role === 'dealer';
  }

  isCustomer() {
    return this.role === 'customer';
  }

  isActive() {
    return this.status === 'active';
  }

  hasPermission(permission) {
    const rolePermissions = {
      admin: ['*'], // All permissions
      dealer: ['scan', 'view_orders', 'view_wallet'],
      customer: ['scan', 'view_wallet']
    };

    const permissions = rolePermissions[this.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  }
}