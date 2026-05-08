export type Locale = 'en' | 'es'

export interface Translations {
  nav: {
    home: string
    services: string
    about: string
    doctors: string
    forms: string
    referrals: string
    contact: string
  }
  hero: {
    tagline1: string
    tagline2: string
    patientForms: string
    patientPortal: string
    billPay: string
    doctorReferrals: string
  }
  services: {
    label: string
    heading: string
    subheading: string
    cataract: string
    cataractDesc: string
    glaucoma: string
    glaucomaDesc: string
    retina: string
    retinaDesc: string
    lasik: string
    lasikDesc: string
    exams: string
    examsDesc: string
    oculoplastics: string
    oculoplasticsDesc: string
  }
  about: {
    label: string
    heading: string
    text1: string
    text2: string
    yearsExp: string
    patients: string
    certified: string
    locations: string
  }
  doctors: {
    label: string
    heading: string
    subheading: string
    specialties: string
    education: string
    certifications: string
  }
  forms: {
    label: string
    heading: string
    subheading: string
    tabRegistration: string
    tabMedical: string
    tabInsurance: string
    tabConsent: string
    submitBtn: string
    submitting: string
    successTitle: string
    successMsg: string
    firstName: string
    lastName: string
    dob: string
    phone: string
    email: string
    streetAddress: string
    city: string
    stateZip: string
    state: string
    zip: string
    reasonForVisit: string
    eyeConditions: string
    previousSurgeries: string
    currentMedications: string
    drugAllergies: string
    hasDiabetes: string
    familyEyeDisease: string
    select: string
    no: string
    type1: string
    type2: string
    glaucoma: string
    macularDegen: string
    other: string
    insuranceProvider: string
    policyNumber: string
    groupNumber: string
    policyholderName: string
    relationship: string
    self: string
    spouse: string
    parent: string
    secondaryInsurance: string
    hipaaTitle: string
    hipaaText: string
    hipaaCheck: string
    consentTitle: string
    consentText: string
    consentCheck: string
    signatureName: string
    signatureDate: string
    placeholderFirstName: string
    placeholderLastName: string
    placeholderPhone: string
    placeholderEmail: string
    placeholderStreet: string
    placeholderCity: string
    placeholderState: string
    placeholderZip: string
    placeholderReason: string
    placeholderEyeConditions: string
    placeholderSurgeries: string
    placeholderMedications: string
    placeholderAllergies: string
    placeholderInsurance: string
    placeholderPolicy: string
    placeholderGroup: string
    placeholderPolicyholder: string
    placeholderSecondary: string
    placeholderSignature: string
  }
  referral: {
    label: string
    heading: string
    text: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
    formTitle: string
    referringPhysician: string
    patientInfo: string
    physicianName: string
    practiceName: string
    fax: string
    patientName: string
    patientPhone: string
    urgency: string
    reasonForReferral: string
    selectUrgency: string
    routine: string
    urgent: string
    emergent: string
    submitBtn: string
    submitting: string
    successTitle: string
    successMsg: string
    placeholderDoctor: string
    placeholderPractice: string
    placeholderPhone: string
    placeholderFax: string
    placeholderPatient: string
    placeholderPatientPhone: string
    placeholderReason: string
  }
  contact: {
    label: string
    heading: string
    subheading: string
    phoneTitle: string
    poweredBy: string
    emailTitle: string
    locationTitle: string
    locationValue: string
    hoursTitle: string
    hoursWeekday: string
    hoursWeekend: string
    portalLink: string
    billPayLink: string
    formTitle: string
    name: string
    phone: string
    email: string
    subject: string
    message: string
    selectTopic: string
    appointment: string
    billing: string
    records: string
    general: string
    submitBtn: string
    submitting: string
    successTitle: string
    successMsg: string
    placeholderName: string
    placeholderPhone: string
    placeholderEmail: string
    placeholderMessage: string
  }
  footer: {
    brandText: string
    quickLinks: string
    servicesTitle: string
    cataract: string
    glaucoma: string
    retina: string
    lasik: string
    eyeExams: string
    contactTitle: string
    addressPlaceholder: string
    copyright: string
  }
  templateReview: {
    heading: string
    subheading: string
    recommended: string
    matchedTraits: string
    useTemplate: string
    selectTemplate: string
    otherOptions: string
    changeTemplate: string
  }
}

const en: Translations = {
  nav: {
    home: 'Home',
    services: 'Services',
    about: 'About',
    doctors: 'Our Doctors',
    forms: 'Patient Forms',
    referrals: 'Referrals',
    contact: 'Contact',
  },
  hero: {
    tagline1: 'Comprehensive eye care with a personal touch.',
    tagline2: 'Your vision is our priority.',
    patientForms: 'Patient Forms',
    patientPortal: 'Patient Portal',
    billPay: 'Bill Pay',
    doctorReferrals: 'Doctor Referrals',
  },
  services: {
    label: 'Our Services',
    heading: 'Expert Eye Care for Every Need',
    subheading: 'From routine exams to complex surgical procedures, our team provides comprehensive ophthalmology services with precision and care.',
    cataract: 'Cataract Surgery',
    cataractDesc: 'Advanced lens replacement procedures using the latest techniques for clearer vision and faster recovery.',
    glaucoma: 'Glaucoma Treatment',
    glaucomaDesc: 'Comprehensive screening, monitoring, and treatment options to protect against vision loss.',
    retina: 'Retina Care',
    retinaDesc: 'Specialized diagnosis and treatment of retinal conditions including macular degeneration and diabetic eye disease.',
    lasik: 'LASIK & Refractive',
    lasikDesc: 'Vision correction procedures to reduce dependence on glasses and contact lenses.',
    exams: 'Comprehensive Eye Exams',
    examsDesc: 'Thorough evaluations using state-of-the-art diagnostic technology for patients of all ages.',
    oculoplastics: 'Oculoplastics',
    oculoplasticsDesc: 'Eyelid surgery, tear duct procedures, and cosmetic treatments by experienced specialists.',
  },
  about: {
    label: 'About Our Practice',
    heading: 'Dedicated to Excellence in Eye Care',
    text1: 'MEC Eye Specialists brings together a team of board-certified ophthalmologists committed to delivering exceptional eye care. With state-of-the-art technology and a patient-first approach, we provide everything from routine eye exams to advanced surgical procedures.',
    text2: 'Our specialists are trained in the latest techniques and technologies, ensuring you receive the highest standard of care for your vision needs.',
    yearsExp: 'Years of Experience',
    patients: 'Patients Served',
    certified: 'Certified Specialists',
    locations: 'Locations',
  },
  doctors: {
    label: 'Our Doctors',
    heading: 'Meet Our Specialists',
    subheading: 'Our board-certified ophthalmologists bring decades of combined experience and subspecialty training to provide you with the highest quality eye care.',
    specialties: 'Specialties',
    education: 'Education & Training',
    certifications: 'Board Certifications',
  },
  forms: {
    label: 'Patient Forms',
    heading: 'Complete Your Forms Online',
    subheading: 'Save time at your visit by filling out intake forms ahead of your appointment. All information is transmitted securely.',
    tabRegistration: 'New Patient Registration',
    tabMedical: 'Medical History',
    tabInsurance: 'Insurance Info',
    tabConsent: 'Consent Forms',
    submitBtn: 'Submit Form',
    submitting: 'Submitting...',
    successTitle: 'Form Submitted Successfully',
    successMsg: 'Thank you. Our team will review your information before your appointment.',
    firstName: 'First Name',
    lastName: 'Last Name',
    dob: 'Date of Birth',
    phone: 'Phone Number',
    email: 'Email Address',
    streetAddress: 'Street Address',
    city: 'City',
    stateZip: 'State / ZIP',
    state: 'State',
    zip: 'ZIP',
    reasonForVisit: 'Reason for Visit',
    eyeConditions: 'Do you currently have any eye conditions?',
    previousSurgeries: 'Previous eye surgeries or treatments',
    currentMedications: 'Current medications',
    drugAllergies: 'Drug allergies',
    hasDiabetes: 'Do you have diabetes?',
    familyEyeDisease: 'Family history of eye disease?',
    select: 'Select',
    no: 'No',
    type1: 'Yes - Type 1',
    type2: 'Yes - Type 2',
    glaucoma: 'Glaucoma',
    macularDegen: 'Macular Degeneration',
    other: 'Other',
    insuranceProvider: 'Insurance Provider',
    policyNumber: 'Policy Number',
    groupNumber: 'Group Number',
    policyholderName: 'Policyholder Name',
    relationship: 'Relationship to Patient',
    self: 'Self',
    spouse: 'Spouse',
    parent: 'Parent',
    secondaryInsurance: 'Secondary Insurance (if applicable)',
    hipaaTitle: 'HIPAA Privacy Acknowledgment',
    hipaaText: 'I acknowledge that I have been provided with a copy of the Notice of Privacy Practices, which describes how my health information may be used and disclosed, and how I can access this information. I understand that MEC Eye Specialists has the right to change the Notice of Privacy Practices at any time.',
    consentTitle: 'Consent to Treatment',
    consentText: 'I consent to the examination and treatment by the ophthalmologist(s) at MEC Eye Specialists. I understand that no guarantees have been made regarding the outcome of any examination or treatment.',
    hipaaCheck: 'I acknowledge receipt of the Notice of Privacy Practices',
    consentCheck: 'I consent to examination and treatment',
    signatureName: 'Patient Signature (type full name)',
    signatureDate: 'Date',
    placeholderFirstName: 'Enter first name',
    placeholderLastName: 'Enter last name',
    placeholderPhone: '(555) 555-5555',
    placeholderEmail: 'email@example.com',
    placeholderStreet: '123 Main Street',
    placeholderCity: 'City',
    placeholderState: 'State',
    placeholderZip: 'ZIP',
    placeholderReason: 'Please describe the reason for your visit',
    placeholderEyeConditions: 'List any current eye conditions or concerns',
    placeholderSurgeries: 'List any past eye surgeries, laser treatments, etc.',
    placeholderMedications: 'List all current medications including eye drops',
    placeholderAllergies: 'List any known drug allergies',
    placeholderInsurance: 'e.g., Blue Cross Blue Shield',
    placeholderPolicy: 'Policy number',
    placeholderGroup: 'Group number',
    placeholderPolicyholder: 'Name on policy',
    placeholderSecondary: 'Secondary insurance provider',
    placeholderSignature: 'Full legal name',
  },
  referral: {
    label: 'Doctor Referrals',
    heading: 'Refer a Patient',
    text: 'Referring physicians can submit patient referrals directly through our secure online form. Our team will process referrals promptly and coordinate scheduling with the patient.',
    step1Title: 'Submit Referral',
    step1Desc: 'Complete the referral form with patient details and diagnosis',
    step2Title: 'Team Review',
    step2Desc: 'Our specialists review the referral and determine next steps',
    step3Title: 'Patient Contact',
    step3Desc: 'We contact the patient to schedule their appointment',
    formTitle: 'Physician Referral Form',
    referringPhysician: 'Referring Physician',
    patientInfo: 'Patient Information',
    physicianName: 'Physician Name',
    practiceName: 'Practice Name',
    fax: 'Fax',
    patientName: 'Patient Name',
    patientPhone: 'Patient Phone',
    urgency: 'Urgency Level',
    reasonForReferral: 'Reason for Referral / Diagnosis',
    selectUrgency: 'Select urgency',
    routine: 'Routine',
    urgent: 'Urgent (within 1 week)',
    emergent: 'Emergent (within 24 hours)',
    submitBtn: 'Submit Referral',
    submitting: 'Submitting...',
    successTitle: 'Referral Submitted',
    successMsg: 'We will process this referral and contact the patient within 24 hours.',
    placeholderDoctor: 'Dr. Name',
    placeholderPractice: 'Practice name',
    placeholderPhone: '(555) 555-5555',
    placeholderFax: '(555) 555-5555',
    placeholderPatient: 'Full name',
    placeholderPatientPhone: '(555) 555-5555',
    placeholderReason: 'Please describe the reason for referral, relevant findings, and any specific requests',
  },
  contact: {
    label: 'Contact Us',
    heading: 'Get in Touch',
    subheading: 'Reach us by phone, email, or visit us at one of our locations.',
    phoneTitle: 'Phone',
    poweredBy: 'Powered by RingCentral',
    emailTitle: 'Email',
    locationTitle: 'Location',
    locationValue: 'Office address will appear here',
    hoursTitle: 'Office Hours',
    hoursWeekday: 'Mon - Fri: 8:00 AM - 5:00 PM',
    hoursWeekend: 'Sat - Sun: Closed',
    portalLink: 'Patient Portal (Nextech)',
    billPayLink: 'Bill Pay Online',
    formTitle: 'Send a Message',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    selectTopic: 'Select a topic',
    appointment: 'Appointment Inquiry',
    billing: 'Billing Question',
    records: 'Medical Records Request',
    general: 'General Inquiry',
    submitBtn: 'Send Message',
    submitting: 'Sending...',
    successTitle: 'Message Sent',
    successMsg: 'We will get back to you as soon as possible.',
    placeholderName: 'Your name',
    placeholderPhone: '(555) 555-5555',
    placeholderEmail: 'email@example.com',
    placeholderMessage: 'How can we help you?',
  },
  footer: {
    brandText: 'Comprehensive eye care with a personal touch. Providing expert ophthalmology services for our community.',
    quickLinks: 'Quick Links',
    servicesTitle: 'Services',
    cataract: 'Cataract Surgery',
    glaucoma: 'Glaucoma Treatment',
    retina: 'Retina Care',
    lasik: 'LASIK',
    eyeExams: 'Eye Exams',
    contactTitle: 'Contact',
    addressPlaceholder: 'Office address here',
    copyright: 'MEC Eye Specialists. All rights reserved.',
  },
  templateReview: {
    heading: 'Choose Your Website Template',
    subheading: 'Based on the design preferences you shared, we recommend:',
    recommended: 'Recommended',
    matchedTraits: 'Matched:',
    useTemplate: 'Use This Template',
    selectTemplate: 'Select',
    otherOptions: 'Other options:',
    changeTemplate: 'Change Template',
  },
}

const es: Translations = {
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    about: 'Nosotros',
    doctors: 'Doctores',
    forms: 'Formularios',
    referrals: 'Referencias',
    contact: 'Contacto',
  },
  hero: {
    tagline1: 'Cuidado integral de los ojos con un toque personal.',
    tagline2: 'Su vision es nuestra prioridad.',
    patientForms: 'Formularios',
    patientPortal: 'Portal del Paciente',
    billPay: 'Pagar Factura',
    doctorReferrals: 'Referencias Medicas',
  },
  services: {
    label: 'Nuestros Servicios',
    heading: 'Cuidado Ocular Experto para Cada Necesidad',
    subheading: 'Desde examenes de rutina hasta procedimientos quirurgicos complejos, nuestro equipo brinda servicios oftalmologicos integrales con precision y cuidado.',
    cataract: 'Cirugia de Cataratas',
    cataractDesc: 'Procedimientos avanzados de reemplazo de lente utilizando las tecnicas mas recientes para una vision mas clara y una recuperacion mas rapida.',
    glaucoma: 'Tratamiento de Glaucoma',
    glaucomaDesc: 'Deteccion integral, monitoreo y opciones de tratamiento para proteger contra la perdida de vision.',
    retina: 'Cuidado de Retina',
    retinaDesc: 'Diagnostico y tratamiento especializado de condiciones de la retina, incluyendo degeneracion macular y enfermedad ocular diabetica.',
    lasik: 'LASIK y Refractiva',
    lasikDesc: 'Procedimientos de correccion visual para reducir la dependencia de lentes y lentes de contacto.',
    exams: 'Examenes Oculares Completos',
    examsDesc: 'Evaluaciones exhaustivas utilizando tecnologia de diagnostico de vanguardia para pacientes de todas las edades.',
    oculoplastics: 'Oculoplastia',
    oculoplasticsDesc: 'Cirugia de parpados, procedimientos de conducto lagrimal y tratamientos cosmeticos por especialistas experimentados.',
  },
  about: {
    label: 'Sobre Nuestra Practica',
    heading: 'Dedicados a la Excelencia en el Cuidado Ocular',
    text1: 'MEC Eye Specialists reune a un equipo de oftalmologos certificados comprometidos con brindar un cuidado ocular excepcional. Con tecnologia de vanguardia y un enfoque centrado en el paciente, ofrecemos desde examenes oculares de rutina hasta procedimientos quirurgicos avanzados.',
    text2: 'Nuestros especialistas estan capacitados en las tecnicas y tecnologias mas recientes, asegurando que usted reciba el mas alto estandar de atencion para sus necesidades visuales.',
    yearsExp: 'Anos de Experiencia',
    patients: 'Pacientes Atendidos',
    certified: 'Especialistas Certificados',
    locations: 'Ubicaciones',
  },
  doctors: {
    label: 'Nuestros Doctores',
    heading: 'Conozca a Nuestros Especialistas',
    subheading: 'Nuestros oftalmologos certificados aportan decadas de experiencia combinada y formacion subespecializada para brindarle la mas alta calidad en cuidado ocular.',
    specialties: 'Especialidades',
    education: 'Educacion y Formacion',
    certifications: 'Certificaciones',
  },
  forms: {
    label: 'Formularios del Paciente',
    heading: 'Complete Sus Formularios en Linea',
    subheading: 'Ahorre tiempo en su visita completando los formularios de admision antes de su cita. Toda la informacion se transmite de forma segura.',
    tabRegistration: 'Registro de Nuevo Paciente',
    tabMedical: 'Historial Medico',
    tabInsurance: 'Informacion de Seguro',
    tabConsent: 'Formularios de Consentimiento',
    submitBtn: 'Enviar Formulario',
    submitting: 'Enviando...',
    successTitle: 'Formulario Enviado Exitosamente',
    successMsg: 'Gracias. Nuestro equipo revisara su informacion antes de su cita.',
    firstName: 'Nombre',
    lastName: 'Apellido',
    dob: 'Fecha de Nacimiento',
    phone: 'Numero de Telefono',
    email: 'Correo Electronico',
    streetAddress: 'Direccion',
    city: 'Ciudad',
    stateZip: 'Estado / Codigo Postal',
    state: 'Estado',
    zip: 'C.P.',
    reasonForVisit: 'Motivo de la Visita',
    eyeConditions: 'Tiene actualmente alguna condicion ocular?',
    previousSurgeries: 'Cirugias o tratamientos oculares anteriores',
    currentMedications: 'Medicamentos actuales',
    drugAllergies: 'Alergias a medicamentos',
    hasDiabetes: 'Tiene diabetes?',
    familyEyeDisease: 'Historial familiar de enfermedades oculares?',
    select: 'Seleccionar',
    no: 'No',
    type1: 'Si - Tipo 1',
    type2: 'Si - Tipo 2',
    glaucoma: 'Glaucoma',
    macularDegen: 'Degeneracion Macular',
    other: 'Otro',
    insuranceProvider: 'Proveedor de Seguro',
    policyNumber: 'Numero de Poliza',
    groupNumber: 'Numero de Grupo',
    policyholderName: 'Nombre del Titular',
    relationship: 'Relacion con el Paciente',
    self: 'Yo mismo',
    spouse: 'Conyuge',
    parent: 'Padre/Madre',
    secondaryInsurance: 'Seguro Secundario (si aplica)',
    hipaaTitle: 'Reconocimiento de Privacidad HIPAA',
    hipaaText: 'Reconozco que se me ha proporcionado una copia del Aviso de Practicas de Privacidad, que describe como mi informacion de salud puede ser utilizada y divulgada, y como puedo acceder a esta informacion. Entiendo que MEC Eye Specialists tiene el derecho de cambiar el Aviso de Practicas de Privacidad en cualquier momento.',
    consentTitle: 'Consentimiento para Tratamiento',
    consentText: 'Doy mi consentimiento para el examen y tratamiento por el/los oftalmologo(s) en MEC Eye Specialists. Entiendo que no se han hecho garantias con respecto al resultado de cualquier examen o tratamiento.',
    hipaaCheck: 'Reconozco haber recibido el Aviso de Practicas de Privacidad',
    consentCheck: 'Doy mi consentimiento para examen y tratamiento',
    signatureName: 'Firma del Paciente (escriba nombre completo)',
    signatureDate: 'Fecha',
    placeholderFirstName: 'Ingrese su nombre',
    placeholderLastName: 'Ingrese su apellido',
    placeholderPhone: '(555) 555-5555',
    placeholderEmail: 'correo@ejemplo.com',
    placeholderStreet: 'Calle 123',
    placeholderCity: 'Ciudad',
    placeholderState: 'Estado',
    placeholderZip: 'C.P.',
    placeholderReason: 'Describa el motivo de su visita',
    placeholderEyeConditions: 'Liste cualquier condicion ocular actual o preocupacion',
    placeholderSurgeries: 'Liste cirugias oculares anteriores, tratamientos laser, etc.',
    placeholderMedications: 'Liste todos los medicamentos actuales incluyendo gotas para los ojos',
    placeholderAllergies: 'Liste cualquier alergia a medicamentos conocida',
    placeholderInsurance: 'ej., Blue Cross Blue Shield',
    placeholderPolicy: 'Numero de poliza',
    placeholderGroup: 'Numero de grupo',
    placeholderPolicyholder: 'Nombre en la poliza',
    placeholderSecondary: 'Proveedor de seguro secundario',
    placeholderSignature: 'Nombre legal completo',
  },
  referral: {
    label: 'Referencias Medicas',
    heading: 'Referir a un Paciente',
    text: 'Los medicos que refieren pueden enviar referencias de pacientes directamente a traves de nuestro formulario seguro en linea. Nuestro equipo procesara las referencias rapidamente y coordinara la programacion con el paciente.',
    step1Title: 'Enviar Referencia',
    step1Desc: 'Complete el formulario de referencia con los datos del paciente y el diagnostico',
    step2Title: 'Revision del Equipo',
    step2Desc: 'Nuestros especialistas revisan la referencia y determinan los siguientes pasos',
    step3Title: 'Contacto al Paciente',
    step3Desc: 'Contactamos al paciente para programar su cita',
    formTitle: 'Formulario de Referencia Medica',
    referringPhysician: 'Medico que Refiere',
    patientInfo: 'Informacion del Paciente',
    physicianName: 'Nombre del Medico',
    practiceName: 'Nombre del Consultorio',
    fax: 'Fax',
    patientName: 'Nombre del Paciente',
    patientPhone: 'Telefono del Paciente',
    urgency: 'Nivel de Urgencia',
    reasonForReferral: 'Motivo de la Referencia / Diagnostico',
    selectUrgency: 'Seleccionar urgencia',
    routine: 'Rutina',
    urgent: 'Urgente (dentro de 1 semana)',
    emergent: 'Emergente (dentro de 24 horas)',
    submitBtn: 'Enviar Referencia',
    submitting: 'Enviando...',
    successTitle: 'Referencia Enviada',
    successMsg: 'Procesaremos esta referencia y contactaremos al paciente dentro de 24 horas.',
    placeholderDoctor: 'Dr. Nombre',
    placeholderPractice: 'Nombre del consultorio',
    placeholderPhone: '(555) 555-5555',
    placeholderFax: '(555) 555-5555',
    placeholderPatient: 'Nombre completo',
    placeholderPatientPhone: '(555) 555-5555',
    placeholderReason: 'Describa el motivo de la referencia, hallazgos relevantes y solicitudes especificas',
  },
  contact: {
    label: 'Contactenos',
    heading: 'Comuniquese con Nosotros',
    subheading: 'Contactenos por telefono, correo electronico, o visitenos en una de nuestras ubicaciones.',
    phoneTitle: 'Telefono',
    poweredBy: 'Powered by RingCentral',
    emailTitle: 'Correo Electronico',
    locationTitle: 'Ubicacion',
    locationValue: 'La direccion de la oficina aparecera aqui',
    hoursTitle: 'Horario de Oficina',
    hoursWeekday: 'Lun - Vie: 8:00 AM - 5:00 PM',
    hoursWeekend: 'Sab - Dom: Cerrado',
    portalLink: 'Portal del Paciente (Nextech)',
    billPayLink: 'Pagar Factura en Linea',
    formTitle: 'Enviar un Mensaje',
    name: 'Nombre',
    phone: 'Telefono',
    email: 'Correo Electronico',
    subject: 'Asunto',
    message: 'Mensaje',
    selectTopic: 'Seleccione un tema',
    appointment: 'Consulta de Cita',
    billing: 'Pregunta de Facturacion',
    records: 'Solicitud de Expediente Medico',
    general: 'Consulta General',
    submitBtn: 'Enviar Mensaje',
    submitting: 'Enviando...',
    successTitle: 'Mensaje Enviado',
    successMsg: 'Nos comunicaremos con usted lo antes posible.',
    placeholderName: 'Su nombre',
    placeholderPhone: '(555) 555-5555',
    placeholderEmail: 'correo@ejemplo.com',
    placeholderMessage: 'Como podemos ayudarle?',
  },
  footer: {
    brandText: 'Cuidado integral de los ojos con un toque personal. Brindando servicios oftalmologicos expertos para nuestra comunidad.',
    quickLinks: 'Enlaces Rapidos',
    servicesTitle: 'Servicios',
    cataract: 'Cirugia de Cataratas',
    glaucoma: 'Tratamiento de Glaucoma',
    retina: 'Cuidado de Retina',
    lasik: 'LASIK',
    eyeExams: 'Examenes Oculares',
    contactTitle: 'Contacto',
    addressPlaceholder: 'Direccion de oficina aqui',
    copyright: 'MEC Eye Specialists. Todos los derechos reservados.',
  },
  templateReview: {
    heading: 'Elija su plantilla de sitio web',
    subheading: 'Segun las preferencias de diseno que compartio, le recomendamos:',
    recommended: 'Recomendada',
    matchedTraits: 'Coincidencias:',
    useTemplate: 'Usar esta plantilla',
    selectTemplate: 'Seleccionar',
    otherOptions: 'Other options:',
    changeTemplate: 'Cambiar plantilla',
  },
}

export const translations: Record<Locale, Translations> = { en, es }
