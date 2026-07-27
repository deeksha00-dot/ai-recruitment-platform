export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

export const isStrongPassword = (password) => String(password || '').length >= 8;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = 'Email is required.';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  return errors;
}

export function validateRegister({ name, email, password, confirmPassword, role }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!email) errors.email = 'Email is required.';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (!isStrongPassword(password)) errors.password = 'Password must be at least 8 characters.';
  if (confirmPassword !== undefined && confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!role) errors.role = 'Select an account type.';
  return errors;
}

export function validateResumeFile(file, acceptedTypes, maxSizeMb) {
  const errors = [];
  if (!file) {
    errors.push('Please choose a file to upload.');
    return errors;
  }
  if (acceptedTypes && !acceptedTypes.includes(file.type)) {
    errors.push('Only PDF and DOCX files are supported.');
  }
  if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
    errors.push(`File must be smaller than ${maxSizeMb}MB.`);
  }
  return errors;
}

export function validateJob({ title, company, description, location, type }) {
  const errors = {};
  if (!title || title.trim().length < 3) errors.title = 'Job title must be at least 3 characters.';
  if (!company || company.trim().length < 2) errors.company = 'Company name is required.';
  if (!description || description.trim().length < 20) errors.description = 'Description must be at least 20 characters.';
  if (!location) errors.location = 'Location is required.';
  if (!type) errors.type = 'Select a job type.';
  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
