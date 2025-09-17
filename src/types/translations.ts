export type Language = 'pl' | 'en';

export interface Translations {
  nav: {
    home: string;
    news: string;
    register: string;
    login: string;
    logout: string;
    participantInfo: string;
    regulations: string;
    essentials: string;
    faq: string;
    contacts: string;
  partners: string;
  };
  home: {
    title: string;
    subtitle: string;
    theme: string;
    countdown: string;
    latestNews: string;
    viewAllNews: string;
    sponsors: string;
    welcomeMessage: string;
    eventDescription: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    loginWithGoogle: string;
    registerWithGoogle: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    loginSuccess: string;
    registerSuccess: string;
    emailConfirmation: string;
    emailConfirmationText: string;
    checkSpamFolder: string;
    understand: string;
  };
  forms: {
    participantData: string;
    studentData: string;
    additionalInfo: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    phone: string;
    pesel: string;
    gender: string;
    faculty: string;
    studentNumber: string;
    fieldOfStudy: string;
    studyLevel: string;
    studyYear: string;
    diet: string;
    tshirtSize: string;
    invoice: string;
    howDidYouKnow: string;
    acceptRegulations: string;
    dataProcessingConsent: string;
    privacyPolicy: string;
    submit: string;
    status: string;
    qualified: string;
    notQualified: string;
    pending: string;
    formCompleted: string;
  };
  payment: {
    title: string;
    studentStatus: string;
    politechnika: string;
    otherUniversity: string;
    noStudent: string;
    emergencyContact: string;
    transport: string;
    medicalConditions: string;
    medications: string;
    transferConfirmation: string;
    ageConfirmation: string;
    cancellationPolicy: string;
    accountDetails: string;
    passwordRequired: string;
  };
  supabaseErrors: {
    permissionDenied: string;
    notFound: string;
    alreadyExists: string;
    unauthenticated: string;
    default: string;
  };
  errors: {
    unexpected: string;
    required: string;
    invalidEmail: string;
    passwordTooShort: string;
    passwordsDontMatch: string;
  };
}
