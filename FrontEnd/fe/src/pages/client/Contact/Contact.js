import React from 'react';
import { Form, Input, Button, Row, Col, Typography, Image } from 'antd';
import './Contact.scss';
import contactImg from '../../../assets/images/contactImg.jpg'; 
const { TextArea } = Input;
const { Title } = Typography;

function Contact() {
  const onFinish = (values) => {
    console.log('Form values:', values);
    // Handle form submission logic here
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <Title className="contact-title">Contact us</Title>
        
        <div className="contact-content">
          <div className="contact-image">
            <Image 
              src= {contactImg} 
              alt="Child playing with dog"
              preview={false}
            />
          </div>
          
          <div className="contact-form">
            <Form
              name="contact-form"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              
              <Form.Item
                name="subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input placeholder="Subject" />
              </Form.Item>
              
              <Form.Item
                name="message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea placeholder="Message" rows={4} />
              </Form.Item>
              
              <Form.Item className="form-button">
                <Button type="primary" htmlType="submit" className="send-button">
                  Send
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      
      {/* About Us section - moved to separate component or page based on image design */}
    </div>
  );
}

export default Contact;