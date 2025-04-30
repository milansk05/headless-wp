import { useState, useEffect } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        questionType: 'algemeen', // Default waarde
        message: '',
        otherQuestionType: '' // Extra veld voor 'Anders' optie
    });
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Lijst van vraagtypen voor dropdown
    const questionTypes = [
        { value: 'algemeen', label: 'Algemene vraag' },
        { value: 'product', label: 'Product informatie' },
        { value: 'ondersteuning', label: 'Technische ondersteuning' },
        { value: 'samenwerking', label: 'Zakelijke samenwerking' },
        { value: 'anders', label: 'Anders...' }
    ];

    // Valideer de formuliergegevens
    const validateForm = () => {
        const newErrors = {};
        
        // Naam validatie
        if (!formData.name.trim()) {
            newErrors.name = 'Naam is verplicht';
        }
        
        // Email validatie
        if (!formData.email.trim()) {
            newErrors.email = 'E-mailadres is verplicht';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Vul een geldig e-mailadres in';
        }
        
        // Telefoon validatie (optioneel, maar moet geldig formaat hebben indien ingevuld)
        if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
            newErrors.phone = 'Vul een geldig telefoonnummer in';
        }
        
        // Onderwerp validatie
        if (!formData.subject.trim()) {
            newErrors.subject = 'Onderwerp is verplicht';
        }
        
        // Bericht validatie
        if (!formData.message.trim()) {
            newErrors.message = 'Bericht is verplicht';
        }
        
        // Extra validatie voor 'Anders' optie
        if (formData.questionType === 'anders' && !formData.otherQuestionType.trim()) {
            newErrors.otherQuestionType = 'Specificeer het type vraag';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        
        // Markeer veld als aangeraakt
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleBlur = e => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Valideer onmiddellijk aangeraakte velden
    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            validateForm();
        }
    }, [formData, touched]);

    const handleSubmit = async e => {
        e.preventDefault();
        
        // Valideer alle velden bij verzending
        const isValid = validateForm();
        if (!isValid) {
            // Markeer alle velden als aangeraakt om fouten te tonen
            const allTouched = Object.keys(formData).reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {});
            setTouched(allTouched);
            return;
        }
        
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

        try {
            // Voorbereid formulierdata
            const submitData = {
                ...formData,
                // Als de vraagtype "anders" is, gebruik het aangepaste veld
                questionTypeDisplay: formData.questionType === 'anders' 
                    ? formData.otherQuestionType 
                    : questionTypes.find(q => q.value === formData.questionType)?.label || formData.questionType
            };

            // API endpoint voor het versturen van het formulier
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const data = await res.json();

            if (res.status === 200) {
                setStatus({
                    submitted: true,
                    submitting: false,
                    info: { error: false, msg: data.message }
                });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    questionType: 'algemeen',
                    message: '',
                    otherQuestionType: ''
                });
                setTouched({});
                setErrors({});
            } else {
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: true, msg: data.message || 'Er is iets misgegaan. Probeer het later opnieuw.' }
                });
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg: 'Er is iets misgegaan. Controleer je internetverbinding en probeer het later opnieuw.' }
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">Neem contact op</h2>

            {status.submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-6 text-center">
                    <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">Bericht verzonden!</h3>
                    <p>{status.info.msg}</p>
                    <button
                        type="button"
                        onClick={() => setStatus({ submitted: false, submitting: false, info: { error: false, msg: null } })}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Nieuw bericht versturen
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status.info.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                            <p>{status.info.msg}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Naam <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {touched.name && errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {touched.email && errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Telefoonnummer
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Optioneel"
                                className={`w-full px-4 py-2 border ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {touched.phone && errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-1">
                                Type vraag <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="questionType"
                                name="questionType"
                                value={formData.questionType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {questionTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {formData.questionType === 'anders' && (
                        <div>
                            <label htmlFor="otherQuestionType" className="block text-sm font-medium text-gray-700 mb-1">
                                Specificeer type vraag <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="otherQuestionType"
                                name="otherQuestionType"
                                type="text"
                                value={formData.otherQuestionType}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border ${touched.otherQuestionType && errors.otherQuestionType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {touched.otherQuestionType && errors.otherQuestionType && (
                                <p className="mt-1 text-sm text-red-600">{errors.otherQuestionType}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                            Onderwerp <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border ${touched.subject && errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {touched.subject && errors.subject && (
                            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Bericht <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border ${touched.message && errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        ></textarea>
                        {touched.message && errors.message && (
                            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                        )}
                    </div>

                    <div className="text-sm text-gray-500">
                        <p>Velden gemarkeerd met een <span className="text-red-500">*</span> zijn verplicht.</p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={status.submitting}
                            className="inline-flex items-center justify-center w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
                        >
                            {status.submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verzenden...
                                </>
                            ) : 'Verstuur bericht'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ContactForm;