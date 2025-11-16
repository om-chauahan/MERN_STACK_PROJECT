import React, { useEffect, useState } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roleFeatures = [
    {
      title: "Admin",
      icon: "👨‍💼",
      features: [
        "Manage users & roles",
        "Monitor all events",
        "Generate reports",
        "System oversight"
      ]
    },
    {
      title: "Organizer",
      icon: "🎤",
      features: [
        "Create and edit events",
        "View registered attendees",
        "Manage event details",
        "Event analytics"
      ]
    },
    {
      title: "Attendee",
      icon: "🙋",
      features: [
        "Browse available events",
        "Register for events",
        "Cancel participation",
        "View event details"
      ]
    }
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)', 
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)', 
      color: '#ffffff',
      marginTop: '0'
    }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a202c 0%, #2b6cb9 50%, #3182ce 100%)'
      }}>
        <div style={{
          position: 'absolute',
          inset: '0',
          background: 'rgba(0,0,0,0.3)'
        }}></div>
        <div style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '96px 16px'
        }}>
          <div style={{
            textAlign: 'center',
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 1s ease'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              Event Management System
            </h1>
            <p style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              color: '#e2e8f0',
              marginBottom: '2rem',
              maxWidth: '768px',
              margin: '0 auto 2rem'
            }}>
              Manage, Organize, and Participate in Events Seamlessly
            </p>
            {/* CTAs removed as requested */}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{padding: '5rem 1rem'}}>
        <div style={{maxWidth: '1024px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 1s ease'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '2rem'
            }}>
              About Our Platform
            </h2>
            <div style={{
              background: '#2d3748',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              border: '1px solid #4a5568'
            }}>
              <p style={{
                fontSize: '1.125rem',
                color: '#e2e8f0',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                The Event Management System is a comprehensive platform where administrators, 
                organizers, and attendees can collaborate to make event planning and participation easier.
              </p>
              <p style={{
                fontSize: '1.125rem',
                color: '#e2e8f0',
                lineHeight: '1.7'
              }}>
                It allows organizers to create and manage events, attendees to browse and register 
                for events, and admins to oversee the entire system with powerful management tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Features */}
      <section style={{
        padding: '5rem 1rem',
        background: 'rgba(45, 55, 72, 0.5)'
      }}>
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0,
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '1rem'
            }}>
              Role-Based Features
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#cbd5e0',
              maxWidth: '512px',
              margin: '0 auto'
            }}>
              Our system is designed to serve different user types with tailored features and capabilities
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {roleFeatures.map((role, index) => (
              <div key={role.title} style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                opacity: isVisible ? 1 : 0
              }}>
                <div style={{
                  background: role.title === 'Admin' ? 
                    'linear-gradient(135deg, #742a2a 0%, #9c4a4a 100%)' : 
                    role.title === 'Organizer' ? 
                    'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' : 
                    'linear-gradient(135deg, #065f46 0%, #059669 100%)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '2rem',
                  height: '100%',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                  }}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{
                      background: '#ffffff',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      transition: 'transform 0.3s ease'
                    }}>
                      <span style={{fontSize: '2rem'}}>{role.icon}</span>
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '1.5rem'
                    }}>
                      {role.title}
                    </h3>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                      {role.features.map((feature, featureIndex) => (
                        <li key={featureIndex} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '0.75rem',
                          color: '#e2e8f0'
                        }}>
                          <svg style={{
                            width: '20px',
                            height: '20px',
                            color: '#10b981',
                            marginRight: '12px',
                            flexShrink: 0
                          }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
      }}>
        <div style={{maxWidth: '1024px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '2rem'
            }}>
              Our Mission
            </h2>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <p style={{
                fontSize: '1.25rem',
                color: '#ffffff',
                lineHeight: '1.7'
              }}>
                The purpose of this system is to provide an{' '}
                <span style={{fontWeight: 'bold', color: '#fbbf24'}}>
                  intuitive and efficient platform
                </span>{' '}
                for event coordination, making event creation and participation{' '}
                <span style={{fontWeight: 'bold', color: '#fbbf24'}}>
                  simple for everyone
                </span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{padding: '5rem 1rem'}}>
        <div style={{maxWidth: '1024px', margin: '0 auto'}}>
          <div style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0,
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '1rem'
            }}>
              Need Help?
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#cbd5e0'
            }}>
              Get in touch with our support team
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0
          }}>
            {/* Email Card */}
            <div style={{
              background: '#2d3748',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              border: '1px solid #4a5568',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  background: '#3b82f6',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  transition: 'transform 0.3s ease'
                }}>
                  <span style={{fontSize: '1.5rem'}}>📧</span>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '1rem'
                }}>
                  Email Support
                </h3>
                <p style={{
                  color: '#cbd5e0',
                  marginBottom: '1rem'
                }}>
                  Send us an email for detailed inquiries
                </p>
                <a 
                  href="mailto:chauhanom1312.com" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: '#60a5fa',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#93c5fd'}
                  onMouseOut={(e) => e.target.style.color = '#60a5fa'}>
                  chauhanom1312.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div style={{
              background: '#2d3748',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              border: '1px solid #4a5568',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  background: '#10b981',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  transition: 'transform 0.3s ease'
                }}>
                  <span style={{fontSize: '1.5rem'}}>📞</span>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '1rem'
                }}>
                  Phone Support
                </h3>
                <p style={{
                  color: '#cbd5e0',
                  marginBottom: '1rem'
                }}>
                  Call us for immediate assistance
                </p>
                <a 
                  href="tel:+919313050993" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: '#34d399',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#6ee7b7'}
                  onMouseOut={(e) => e.target.style.color = '#34d399'}>
                  +91-9313050993
                </a>
              </div>
            </div>
          </div>

          {/* Contact Admin button removed as requested */}
        </div>
      </section>
    </div>
  );
};

export default About;