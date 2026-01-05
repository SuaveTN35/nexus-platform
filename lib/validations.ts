/**
 * Validation Schemas and Functions
 * Form validation utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email: string, fieldName: string = 'Email'): ValidationError | null {
  if (!email) return null; // Use validateRequired for required check
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: fieldName.toLowerCase(),
      message: 'Please enter a valid email address',
    };
  }
  return null;
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): ValidationError | null {
  if (value && value.length < minLength) {
    return {
      field: fieldName.toLowerCase(),
      message: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return null;
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationError | null {
  if (value && value.length > maxLength) {
    return {
      field: fieldName.toLowerCase(),
      message: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }
  return null;
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationError | null {
  if (value < min || value > max) {
    return {
      field: fieldName.toLowerCase(),
      message: `${fieldName} must be between ${min} and ${max}`,
    };
  }
  return null;
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string, fieldName: string = 'Phone'): ValidationError | null {
  if (!phone) return null; // Use validateRequired for required check
  
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const cleaned = phone.replace(/\D/g, '');
  
  if (!phoneRegex.test(phone) || cleaned.length < 10) {
    return {
      field: fieldName.toLowerCase(),
      message: 'Please enter a valid phone number',
    };
  }
  return null;
}

/**
 * Validate contact form data
 */
export function validateContactForm(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const firstNameError = validateRequired(data.firstName, 'First name');
  if (firstNameError) errors.push(firstNameError);

  const lastNameError = validateRequired(data.lastName, 'Last name');
  if (lastNameError) errors.push(lastNameError);

  if (data.email) {
    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);
  }

  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.push(phoneError);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate deal form data
 */
export function validateDealForm(data: {
  name: string;
  contactId: string;
  value: number;
  stage: string;
  probability: number;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.name, 'Deal name');
  if (nameError) errors.push(nameError);

  const contactError = validateRequired(data.contactId, 'Contact');
  if (contactError) errors.push(contactError);

  const valueError = validateNumberRange(data.value, 1, 100000000, 'Deal value');
  if (valueError) errors.push(valueError);

  const probabilityError = validateNumberRange(data.probability, 0, 100, 'Probability');
  if (probabilityError) errors.push(probabilityError);

  return {
    valid: errors.length === 0,
    errors,
  };
}

