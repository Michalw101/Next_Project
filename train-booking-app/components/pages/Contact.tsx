"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';

const adminEmail = 'michal24263@gmail.com';

interface FormData {
    email: string;
    subject: string;
    message: string;
}

const Contact: React.FC = () => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSendEmail = () => {
        const emailData = {
            to: adminEmail,
            subject: `פנייה מהאתר: ${formData.subject}`,
            html: `
            <h1>שלום,</h1>
            <p>התקבלה פנייה חדשה מאתר צור קשר:</p>
            <p><strong>כתובת מייל:</strong> ${formData.email}</p>
            <p><strong>הודעה:</strong><br>${formData.message}</p>
            `,
        };

        // serverRequests('post', 'send-mail', emailData)
        //     .then(response => response.json())
        //     .then(data => {
        //         if (!data.success) {
        //             throw new Error(data.message);
        //         } else {
        //             mailSentNotify();
        //             setFormData({
        //                 email: '',
        //                 subject: '',
        //                 message: ''
        //             });
        //         }
        //     })
        //     .catch(error => {
        //         errorSendingMailNotify(error.message);
        //     }).finally(() => {
        //         setIsSending(false);
        //     });

        console.log('Email sent with content:', formData.message);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        handleSendEmail();
    };

    return (
        <section className="bg-white">
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <p className="mb-4 text-4xl tracking-tight font-light font-extrabold text-center text-gray-900 dark:text-black">Contact Us</p>
                <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
                    Have a technical issue? Want to send feedback? Need details about our program? Let us know.
                </p>
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="shadow-sm bg-gray-50 placeholder:text-center border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                            placeholder="mail@example.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="block p-3 w-full placeholder:text-center text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                            placeholder="Anything you'd like to say"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            className="block p-2.5 w-full placeholder:text-center text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Your message here"
                            value={formData.message}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <button
                        disabled={isSending}
                        type="submit"
                        className={`py-3 px-5 text-sm font-medium text-center text-white rounded-lg sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700'}`}
                    >
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
