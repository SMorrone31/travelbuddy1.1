import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuth } from "../../AuthContext";
import emailjs from "emailjs-com";
import './contactUs.css';

const { TextArea } = Input;

const ContactUs = () => {
  // Utilizzo del contesto di autenticazione per ottenere l'utente corrente
  const { user } = useAuth();
  const [form] = Form.useForm();
  // Stato per tracciare lo stato della connessione
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

 // Funzione chiamata quando il form viene inviato
  const onFinish = (values) => {
    const templateParams = {
      from_name: values.name,
      subject: values.subject,
      message: values.description,
      from_email: user.email
    };

    // Invio dell'e-mail utilizzando Email.js
    emailjs.send('service_6sa8dxt', 'template_e8d9h2e', templateParams, 'T1_HwPs7ffCtybVjQ')
      .then((response) => {
        console.log('Email sent successfully', response.status, response.text);
        notification.success({
          message: 'Form Submitted',
          description: 'Your message has been sent successfully. We will get back to you soon!',
        });
        form.resetFields();
      }, (err) => {
        console.error('Failed to send email', err);
      });
  };

   // Gestione degli eventi di connessione online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Aggiunta degli ascoltatori di eventi online/offline
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Rimozione degli ascoltatori quando il componente viene smontato
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);



  return (
    <div className="contact-form">
      <Form
        name="contact"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: 'Please enter a subject!' }]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Subject of your message" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter your message!' }]}
        >
          <TextArea prefix={<MessageOutlined className="site-form-item-icon" />} rows={4} placeholder="Write your message here" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={isOffline}>
            Send Message
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

}


export default ContactUs;
