import { validateSwipeDetails } from './swapDetails';
import Joi from 'joi';

describe('validateSwipeDetails', () => {
  const validInput = {
    SwapCd: 'SW123',
    Branch: 'NY001',
    Channel: 'Online',
    Term: 12,
    StartDt: '2023-01-01',
    EndDt: '2023-12-31'
  };

  it('should validate correct input successfully', () => {
    const { error } = validateSwipeDetails.validate(validInput);
    expect(error).toBeUndefined();
  });

  describe('SwapCd validation', () => {
    it('should accept string value', () => {
      const input = { ...validInput, SwapCd: 'SW123' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error).toBeUndefined();
    });

    it('should accept number value', () => {
      const input = { ...validInput, SwapCd: 123 };
      const { error } = validateSwipeDetails.validate(input);
      expect(error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const input = { ...validInput, SwapCd: '' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Field swapCd must be either a number or non-empty');
    });

    it('should reject when missing', () => {
      const { SwapCd, ...input } = validInput;
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Missing field swapCd');
    });
  });

  describe('Branch validation', () => {
    it('should accept string value', () => {
      const input = { ...validInput, Branch: 'NY001' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error).toBeUndefined();
    });

    it('should accept number value', () => {
      const input = { ...validInput, Branch: 1001 };
      const { error } = validateSwipeDetails.validate(input);
      expect(error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const input = { ...validInput, Branch: '' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Field brand cannot be an empty string');
    });

    it('should reject when missing', () => {
      const { Branch, ...input } = validInput;
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Missing field brand');
    });
  });

  describe('Channel validation', () => {
    it('should accept valid string', () => {
      const input = { ...validInput, Channel: 'Mobile' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const input = { ...validInput, Channel: '' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Field Channel cannot be an empty string');
    });

    it('should reject when missing', () => {
      const { Channel, ...input } = validInput;
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Missing field Channel');
    });
  });

  describe('Term validation', () => {
    it('should accept valid number', () => {
      const input = { ...validInput, Term: 6 };
      const { error } = validateSwipeDetails.validate(input);
      expect(error).toBeUndefined();
    });

    it('should reject non-number value', () => {
      const input = { ...validInput, Term: 'six' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Field Term must be a number');
    });

    it('should reject when missing', () => {
      const { Term, ...input } = validInput;
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Missing field Term');
    });
  });

  describe('Date validation', () => {
    it('should accept valid ISO dates', () => {
      const input = { 
        ...validInput, 
        StartDt: '2023-01-01',
        EndDt: '2023-12-31'
      };
      const { error } = validateSwipeDetails.validate(input);
      expect(error).toBeUndefined();
    });

    it('should reject invalid StartDt format', () => {
      const input = { ...validInput, StartDt: '01-01-2023' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: StartDt is not a valid date');
    });

    it('should reject invalid EndDt format', () => {
      const input = { ...validInput, EndDt: '31-12-2023' };
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: EndDt is not a valid date');
    });

    it('should reject when StartDt is missing', () => {
      const { StartDt, ...input } = validInput;
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Missing field StartDt');
    });

    it('should reject when EndDt is missing', () => {
      const { EndDt, ...input } = validInput;
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: Missing field EndDt');
    });

    it('should reject when EndDt is before StartDt', () => {
      const input = { 
        ...validInput, 
        StartDt: '2023-12-31',
        EndDt: '2023-01-01'
      };
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toBe('Validation failed: StartDt cannot be after EndDt');
    });
  });
});
