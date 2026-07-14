```javascript
window.CouponViews = window.CouponViews || {};

window.CouponViews.register = {
  districts: [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad'
  ],

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

  isSaving: false,
  formState: {
    name: '',
    mobile: '',
    location: '',
    district: ''
  },

  init: function() {
    this.render();
    this.setupForm();
    this.restoreSessionData();
    this.checkFormValidity();
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
            <p class="register-subtitle">Complete your profile to access exclusive coupons</p>
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
                required
              />
              <div id="customerNameError" class="form-error" role="alert" aria-live="polite"></div>
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
                  required
                />
              </div>
              <div id="customerMobileError" class="form-error" role="alert" aria-live="polite"></div>
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
                required
              />
              <div id="customerLocationError" class="form-error" role="alert" aria-live="polite"></div>
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
                required
              >
                <option value="">Select your district</option>
              </select>
              <div id="customerDistrictError" class="form-error" role="alert" aria-live="polite"></div>
            </div>

            <div id="formError" class="form-error form-error-block" role="alert" style="display: none;"></div>

            <button type="submit" id="submitBtn" class="btn btn-primary btn-block" disabled>
              <span>Continue to Scanner</span>
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
        this.formState.name = e.target.value;
        this.validateField('name');
        this.checkFormValidity();
      });
    }

    const mobileInput = document.getElementById('customerMobile');
    if (mobileInput) {
      mobileInput.addEventListener('blur', () => this.validateField('mobile'));
      mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        this.formState.mobile = e.target.value;
        this.validateField('mobile');
        this.checkFormValidity();
      });
    }

    const locationInput = document.getElementById('customerLocation');
    if (locationInput) {
      locationInput.addEventListener('blur', () => this.validateField('location'));
      locationInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.slice(0, 100);
        this.formState.location = e.target.value;
        this.validateField('location');
        this.checkFormValidity();
      });
    }

    const districtSelect = document.getElementById('customerDistrict');
    if (districtSelect) {
      districtSelect.addEventListener('change', (e) => {
        this.formState.district = e.target.value;
        this.validateField('district');
        this.checkFormValidity();
      });
      districtSelect.addEventListener('blur', () => this.validateField('district'));
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
    let firstInvalidField = null;

    fields.forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        allValid = false;
        if (!firstInvalidField) {
          const fieldElementMap = {
            name: 'customerName',
            mobile: 'customerMobile',
            location: 'customerLocation',
            district: 'customerDistrict'
          };
          firstInvalidField = document.getElementById(fieldElementMap[fieldName]);
        }
      }
    });

    if (firstInvalidField && !allValid) {
      firstInvalidField.focus();
    }

    return allValid;
  },

  checkFormValidity: function() {
    const fields = ['name', 'mobile', 'location', 'district'];
    let allValid = true;

    fields.forEach(fieldName => {
      const fieldElementMap = {
        name: 'customerName',
        mobile: 'customerMobile',
        location: 'customerLocation',
        district: 'customerDistrict'
      };

      const field = document.getElementById(fieldElementMap[fieldName]);
      if (!field) return;

      const value = field.value.trim();
      const rules = this.validationRules[fieldName];

      if (!rules || !rules.required) {
        return;
      }

      if (!value) {
        allValid = false;
        return;
      }

      if (fieldName === 'name') {
        if (value.length < rules.minLength || value.length > rules.maxLength || !rules.pattern.test(value)) {
          allValid = false;
        }
      } else if (fieldName === 'mobile') {
        if (value.length !== rules.length || !rules.pattern.test(value)) {
          allValid = false;
        }
      } else if (fieldName === 'location') {
        if (value.length < rules.minLength || value.length > rules.maxLength || !rules.pattern.test(value)) {
          allValid = false;
        }
      }
    });

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = !allValid;
    }
  },

  async onFormSubmit(e) {
    e.preventDefault();

    if (this.isSaving) {
      return;
    }

    if (!this.validateAllFields()) {
      const formError = document.getElementById('formError');
      if (formError) {
        formError.textContent = 'Please fill all required fields correctly';
        formError.style.display = 'block';
      }
      CouponUtils.toast('Please correct the errors and try again', 'error');
      return;
    }

    this.isSaving = true;
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;

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
      sessionId: this.generateSessionId(),
      isRegistered: true
    };

    try {
      if (typeof CouponDB === 'undefined') {
        throw new Error('CouponDB not initialized');
      }

      if (typeof CouponDB.customerSession === 'undefined') {
        CouponDB.customerSession = {};
      }

      Object.assign(CouponDB.customerSession, customerData);

      const formError = document.getElementById('formError');
      if (formError) {
        formError.style.display = 'none';
        formError.textContent = '';
      }

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
      const formError = document.getElementById('formError');
      if (formError) {
        formError.textContent = 'Failed to save registration. Please try again.';
        formError.style.display = 'block';
      }
      CouponUtils.toast('Failed to save registration. Please try again.', 'error');
      submitBtn.disabled = false;
    } finally {
      this.isSaving = false;
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
          this.formState.name = session.name;
        }
      }

      if (session.mobile) {
        const mobileField = document.getElementById('customerMobile');
        if (mobileField) {
          mobileField.value = session.mobile;
          this.formState.mobile = session.mobile;
        }
      }

      if (session.location) {
        const locationField = document.getElementById('customerLocation');
        if (locationField) {
          locationField.value = session.location;
          this.formState.location = session.location;
        }
      }

      if (session.district) {
        const districtField = document.getElementById('customerDistrict');
        if (districtField) {
          districtField.value = session.district;
          this.formState.district = session.district;
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
```