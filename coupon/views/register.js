window.CouponViews = window.CouponViews || {};

window.CouponViews.register = {
  districts: [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad'
]
  validationRules: {
    name: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      required: true,
      errors: {
        required: 'Full name is required',
        minLength: 'Name must be at least 3 characters',
        maxLength: 'Name cannot exceed 50 characters',
        pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes'
      }
    },
    mobile: {
      length: 10,
      pattern: /^\d{10}$/,
      required: true,
      errors: {
        required: 'Mobile number is required',
        length: 'Mobile number must be exactly 10 digits',
        pattern: 'Mobile number must contain only digits'
      }
    },
    location: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s,.\-/]+$/,
      required: true,
      errors: {
        required: 'Location is required',
        minLength: 'Location must be at least 2 characters',
        maxLength: 'Location cannot exceed 100 characters',
        pattern: 'Location contains invalid characters'
      }
    },
    district: {
      required: true,
      errors: {
        required: 'District is required'
      }
    }
  },

  init: function() {
    this.render();
    this.setupForm();
    this.restoreSessionData();
  },

  render: function() {
    const container = document.getElementById('app');
    if (!container) {
      console.error('[Register] App container not found');
      return;
    }

    container.innerHTML = `
      <div class="register-wrapper">
        <div class="register-container">
          <div class="register-header">
            <h1 class="register-title">Customer Registration</h1>
            <p class="register-subtitle">Join our rewards program and get exclusive offers</p>
          </div>

          <form id="registerForm" class="register-form" novalidate>
            <div class="form-group">
              <label for="customerName" class="form-label">
                Full Name
                <span class="form-required">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                class="form-control"
                placeholder="Enter your full name"
                autocomplete="name"
                spellcheck="false"
                maxlength="50"
                aria-label="Full Name"
                aria-describedby="customerNameError"
              />
              <div id="customerNameError" class="form-error" role="alert"></div>
            </div>

            <div class="form-group">
              <label for="customerMobile" class="form-label">
                Mobile Number
                <span class="form-required">*</span>
              </label>
              <div class="input-group">
                <span class="input-prefix">+91</span>
                <input
                  type="tel"
                  id="customerMobile"
                  class="form-control"
                  placeholder="10-digit mobile number"
                  inputmode="numeric"
                  autocomplete="tel"
                  maxlength="10"
                  aria-label="Mobile Number"
                  aria-describedby="customerMobileError"
                />
              </div>
              <div id="customerMobileError" class="form-error" role="alert"></div>
            </div>

            <div class="form-group">
              <label for="customerLocation" class="form-label">
                Location / Area
                <span class="form-required">*</span>
              </label>
              <input
                type="text"
                id="customerLocation"
                class="form-control"
                placeholder="Enter your area or locality"
                autocomplete="address-level3"
                maxlength="100"
                aria-label="Location"
                aria-describedby="customerLocationError"
              />
              <div id="customerLocationError" class="form-error" role="alert"></div>
            </div>

            <div class="form-group">
              <label for="customerDistrict" class="form-label">
                District
                <span class="form-required">*</span>
              </label>
              <select
                id="customerDistrict"
                class="form-control form-select"
                aria-label="District"
                aria-describedby="customerDistrictError"
              >
                <option value="">Select your district</option>
              </select>
              <div id="customerDistrictError" class="form-error" role="alert"></div>
            </div>

            <button type="submit" class="btn btn-primary btn-block">
              Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          <div class="register-footer">
            <p class="footer-text">Your information is stored securely and locally on this device.</p>
          </div>
        </div>
      </div>
    `;
  },

  setupForm: function() {
    this.populateDistricts();
    this.attachFormListeners();
  },

  populateDistricts: function() {
    const districtSelect = document.getElementById('customerDistrict');
    if (!districtSelect) {
      console.error('[Register] District select element not found');
      return;
    }

    this.districts.forEach(district => {
      const option = document.createElement('option');
      option.value = district.toLowerCase();
      option.textContent = district;
      districtSelect.appendChild(option);
    });
  },

  attachFormListeners: function() {
    const form = document.getElementById('registerForm');
    if (!form) {
      console.error('[Register] Form element not found');
      return;
    }

    form.addEventListener('submit', (e) => this.onFormSubmit(e));

    const nameInput = document.getElementById('customerName');
    if (nameInput) {
      nameInput.addEventListener('blur', () => this.validateField('name'));
      nameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
      });
    }

    const mobileInput = document.getElementById('customerMobile');
    if (mobileInput) {
      mobileInput.addEventListener('blur', () => this.validateField('mobile'));
      mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      });
    }

    const locationInput = document.getElementById('customerLocation');
    if (locationInput) {
      locationInput.addEventListener('blur', () => this.validateField('location'));
      locationInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.slice(0, 100);
      });
    }

    const districtSelect = document.getElementById('customerDistrict');
    if (districtSelect) {
      districtSelect.addEventListener('change', () => this.validateField('district'));
    }
  },

  validateField: function(fieldName) {
    const fieldElementMap = {
      name: 'customerName',
      mobile: 'customerMobile',
      location: 'customerLocation',
      district: 'customerDistrict'
    };

    const elementId = fieldElementMap[fieldName];
    const field = document.getElementById(elementId);
    const errorElement = document.getElementById(elementId + 'Error');

    if (!field || !errorElement) {
      return false;
    }

    const value = field.value.trim();
    const rules = this.validationRules[fieldName];

    if (!rules) {
      return true;
    }

    let error = '';

    if (rules.required && !value) {
      error = rules.errors.required;
    } else if (value) {
      if (fieldName === 'name') {
        if (value.length < rules.minLength) {
          error = rules.errors.minLength;
        } else if (value.length > rules.maxLength) {
          error = rules.errors.maxLength;
        } else if (!rules.pattern.test(value)) {
          error = rules.errors.pattern;
        }
      } else if (fieldName === 'mobile') {
        if (value.length !== rules.length) {
          error = rules.errors.length;
        } else if (!rules.pattern.test(value)) {
          error = rules.errors.pattern;
        }
      } else if (fieldName === 'location') {
        if (value.length < rules.minLength) {
          error = rules.errors.minLength;
        } else if (value.length > rules.maxLength) {
          error = rules.errors.maxLength;
        } else if (!rules.pattern.test(value)) {
          error = rules.errors.pattern;
        }
      }
    }

    errorElement.textContent = error;
    field.classList.toggle('is-invalid', error.length > 0);
    field.classList.toggle('is-valid', !error && value.length > 0);

    return error.length === 0;
  },

  validateAllFields: function() {
    const fields = ['name', 'mobile', 'location', 'district'];
    let allValid = true;

    fields.forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        allValid = false;
      }
    });

    return allValid;
  },

  onFormSubmit: function(e) {
    e.preventDefault();

    if (!this.validateAllFields()) {
      CouponUtils.toast('Please fill all fields correctly', 'error');
      return;
    }

    const nameValue = document.getElementById('customerName').value.trim();
    const mobileValue = document.getElementById('customerMobile').value.trim();
    const locationValue = document.getElementById('customerLocation').value.trim();
    const districtValue = document.getElementById('customerDistrict').value;

    const customerData = {
      name: nameValue,
      mobile: mobileValue,
      location: locationValue,
      district: districtValue,
      registeredAt: new Date().toISOString(),
      sessionId: this.generateSessionId()
    };

    try {
      if (typeof CouponDB === 'undefined') {
        throw new Error('CouponDB not initialized');
      }

      if (typeof CouponDB.customerSession === 'undefined') {
        CouponDB.customerSession = {};
      }

      Object.assign(CouponDB.customerSession, customerData);

      CouponUtils.toast('Registration successful!', 'success');

      setTimeout(() => {
        if (typeof CouponRouter !== 'undefined' && typeof CouponRouter.navigate === 'function') {
          CouponRouter.navigate('#/customer-scan');
        } else {
          console.error('[Register] CouponRouter not available');
        }
      }, 600);
    } catch (error) {
      console.error('[Register] Error saving customer data:', error);
      CouponUtils.toast('Failed to save registration. Please try again.', 'error');
    }
  },

  restoreSessionData: function() {
    try {
      if (typeof CouponDB === 'undefined' || typeof CouponDB.customerSession === 'undefined') {
        return;
      }

      const session = CouponDB.customerSession;

      if (session.name) {
        const nameField = document.getElementById('customerName');
        if (nameField) {
          nameField.value = session.name;
        }
      }

      if (session.mobile) {
        const mobileField = document.getElementById('customerMobile');
        if (mobileField) {
          mobileField.value = session.mobile;
        }
      }

      if (session.location) {
        const locationField = document.getElementById('customerLocation');
        if (locationField) {
          locationField.value = session.location;
        }
      }

      if (session.district) {
        const districtField = document.getElementById('customerDistrict');
        if (districtField) {
          districtField.value = session.district;
        }
      }
    } catch (error) {
      console.error('[Register] Error restoring session data:', error);
    }
  },

  generateSessionId: function() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return 'sess_' + timestamp + '_' + randomStr;
  }
};