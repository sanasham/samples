const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

// Updated Joi validation schema with specific message format
const swapDetailsSchema = Joi.object({
  swapCd: Joi.number().required().messages({
    'number.base': 'Validation failed: Field swapCd must be a number',
    'any.required': 'Validation failed: Missing field swapCd',
  }),
  brand: Joi.string().trim().required().messages({
    'string.empty': 'Validation failed: Field brand cannot be an empty string',
    'any.required': 'Validation failed: Missing field brand', // This matches your expected response
  }),
  Channel: Joi.string().trim().required().messages({
    'string.empty':
      'Validation failed: Field Channel cannot be an empty string',
    'any.required': 'Validation failed: Missing field Channel',
  }),
  Term: Joi.number().required().messages({
    'number.base': 'Validation failed: Field Term must be a number',
    'any.required': 'Validation failed: Missing field Term',
  }),
  StartDt: Joi.date().iso().required().messages({
    'date.base': 'Validation failed: StartDt is not a valid date',
    'any.required': 'Validation failed: Missing field StartDt',
  }),
  EndDt: Joi.date().iso().greater(Joi.ref('StartDt')).required().messages({
    'date.base': 'Validation failed: EndDt is not a valid date',
    'date.greater': 'Validation failed: StartDt cannot be after EndDt',
    'any.required': 'Validation failed: Missing field EndDt',
  }),
});

// Swap details endpoint
app.post('/api/swap', async (req, res) => {
  try {
    await swapDetailsSchema.validateAsync(req.body, { abortEarly: false });
    console.log('Validation passed for input:', req.body);
    res.status(200).json({ isValid: true, message: 'Validation passed' });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      // Return the first error message in the exact required format
      const firstError = error.details[0];
      console.error('Validation failed:', firstError.message);
      return res.status(400).json({
        message: firstError.message, // Matches your response format exactly
      });
    }
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
