import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import './aboutUs.css'; 
import profileImg from "./MorroneSimoneFototessera.jpeg"

const { Title, Paragraph } = Typography;

const AboutUs = () => {
    return (
        <div className="about-page">
            <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <div className="image-container">
                        <Card
                            hoverable
                            style={{ width: '100%' }}
                            cover={<img alt="example" src={profileImg} className="profile-image" />}
                        >
                            <Card.Meta title="Simone Morrone" description="Student in Computer Science" />
                        </Card>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Title level={2}>WHO WE ARE</Title>
                    <Paragraph>
                        I'm a college student who used the opportunity to study these things to create a cutting-edge web app.
                    </Paragraph>

                    <Title level={3}>GET TO KNOW US</Title>
                    <Paragraph>
                        <strong>Name:</strong> Simone<br />
                        <strong>Surname:</strong> Morrone<br />
                        <strong>Age:</strong> 21<br />
                        <strong>Profession:</strong> Student in Computer Science<br />
                        <strong>University:</strong> University of Pisa<br />
                        <strong>Course:</strong> A<br />
                        <strong>Year of course:</strong> 3<br />
                        <strong>Registered in:</strong> 2021/2022<br />
                        <strong>High school diploma in:</strong> 2021
                    </Paragraph>
                </Col>
            </Row>
        </div>
    );
};

export default AboutUs;
