// Centralised regex-based validators used across Login/Register/Checkout forms.

export const REGEX = {
  name: /^[A-Za-z][A-Za-z ]{1,49}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  // At least 8 chars, one letter, one number
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/,
  // 10 digit Indian mobile number starting 6-9
  phone: /^[6-9]\d{9}$/,
  pincode: /^\d{6}$/,
};

export function validateName(value) {
  if (!value.trim()) return "Name is required";
  if (!REGEX.name.test(value.trim())) return "Enter a valid name (letters only, min 2 chars)";
  return "";
}

export function validateEmail(value) {
  if (!value.trim()) return "Email is required";
  if (!REGEX.email.test(value.trim())) return "Enter a valid email address";
  return "";
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (!REGEX.password.test(value)) return "Password must be 8+ chars with at least one letter and one number";
  return "";
}

export function validatePhone(value) {
  if (!value.trim()) return "Phone number is required";
  if (!REGEX.phone.test(value.trim())) return "Enter a valid 10-digit mobile number";
  return "";
}

export function validatePincode(value) {
  if (!value.trim()) return "Pincode is required";
  if (!REGEX.pincode.test(value.trim())) return "Enter a valid 6-digit pincode";
  return "";
}

export function validateAddress(value) {
  if (!value.trim() || value.trim().length < 5) return "Enter a complete address";
  return "";
}
