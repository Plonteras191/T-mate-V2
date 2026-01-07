// Validation utility functions

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * Requirements: at least 8 characters
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

/**
 * Get password validation error message
 */
export const getPasswordError = (password: string): string | null => {
    if (password.length === 0) {
        return null;
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    return null;
};

/**
 * Validate passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};

/**
 * Validate full name
 * Requirements: at least 2 characters, no numbers
 */
export const isValidName = (name: string): boolean => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return false;
    // Check for only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(trimmedName);
};

/**
 * Get name validation error message
 */
export const getNameError = (name: string): string | null => {
    if (name.length === 0) {
        return null;
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
        return 'Name must be at least 2 characters';
    }
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(trimmedName)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
};

/**
 * Get email validation error message
 */
export const getEmailError = (email: string): string | null => {
    if (email.length === 0) {
        return null;
    }
    if (!isValidEmail(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

/**
 * Validate all signup fields
 */
export interface SignUpValidation {
    isValid: boolean;
    errors: {
        fullName: string | null;
        email: string | null;
        password: string | null;
        confirmPassword: string | null;
    };
}

export const validateSignUp = (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
): SignUpValidation => {
    const errors = {
        fullName: getNameError(fullName) || (!fullName.trim() ? 'Full name is required' : null),
        email: getEmailError(email) || (!email.trim() ? 'Email is required' : null),
        password: getPasswordError(password) || (!password ? 'Password is required' : null),
        confirmPassword: !confirmPassword
            ? 'Please confirm your password'
            : !passwordsMatch(password, confirmPassword)
                ? 'Passwords do not match'
                : null,
    };

    const isValid = Object.values(errors).every((error) => error === null);

    return { isValid, errors };
};

/**
 * Validate login fields
 */
export interface LoginValidation {
    isValid: boolean;
    errors: {
        email: string | null;
        password: string | null;
    };
}

export const validateLogin = (email: string, password: string): LoginValidation => {
    const errors = {
        email: !email.trim() ? 'Email is required' : getEmailError(email),
        password: !password ? 'Password is required' : null,
    };

    const isValid = Object.values(errors).every((error) => error === null);

    return { isValid, errors };
};
