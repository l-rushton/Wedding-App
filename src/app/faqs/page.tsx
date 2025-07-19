'use client';

import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Paper, Alert } from '@mui/material';
import emailjs from '@emailjs/browser';
import PageFade from '../components/PageFade';

const FAQsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
        question: "What time should I arrive?",
        answer: "Please arrive by 12:15pm."
    },
    {
      question: "Are kids welcome?",
      answer: "We kindly ask that you leave the little ones at home. Please reach out if you have any questions!"
    },
    {
      question: "Dress code",
      answer: "Dress to impress! We&apos;re going for an autumnal theme, so not a black tie affair. Think earthy tones!"
    },
    {
      question: "RSVP deadline",
      answer: "Please RSVP by the 18th of August. You can RSVP by scanning the QR code on your invitation with your phone, or by going to the RSVP page on this website."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await emailjs.send('service_04bnhgq', 'template_89eou4q', {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.question,
      }, 'l6R3r-Ma4SfUu8wUs');
      setSubmitted(true);
    } catch {
      // Still show success message for now
      setSubmitted(true);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <PageFade>
      <Box 
        sx={{ mt: 5, mb: 8 }}
        px={{ xs: 2, md: 16 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'secondary.main' }}>
          Frequently Asked Questions
        </Typography>

        {faqs.map((faq, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {faq.question}
            </Typography>
            <Typography paragraph>
              {faq.answer}
            </Typography>
          </Box>
        ))}

        {/* Contact Card */}
        <Box sx={{ mt: 6 }}>
          <Paper elevation={2} sx={{ p: 4, bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', mb: 3 }}>
              Still have questions?
            </Typography>
            
            {submitted ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Thank you! We&apos;ll get back to you soon.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Your Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'secondary.main',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'secondary.main',
                      },
                    }}
                  />
                  <TextField
                    label="Your Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'secondary.main',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'secondary.main',
                      },
                    }}
                  />
                  <TextField
                    label="Your Question"
                    value={formData.question}
                    onChange={handleChange('question')}
                    required
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'secondary.main',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'secondary.main',
                      },
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ 
                        bgcolor: 'secondary.main',
                        '&:hover': { bgcolor: 'secondary.dark' },
                        color: 'primary.main'
                      }}
                    >
                      Send Question
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
          </Paper>
        </Box>
      </Box>
    </PageFade>
  );
};

export default FAQsPage; 