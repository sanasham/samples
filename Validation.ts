import { validateSwipeDetails } from '../validations/swapDetails';
import Joi from 'joi';

describe('validateSwipeDetails', () => {
  const validInput = {
    SwapCd: 'SW123',
    Branch: 'NY001',  // Note: Make sure this matches exactly with your schema
    Channel: 'Online',
    Term: 12,
    StartDt: '2023-01-01',
    EndDt: '2023-12-31'
  };

  it('should validate correct input successfully', () => {
    const { error } = validateSwipeDetails.validate(validInput);
    expect(error).toBeUndefined();  // Fixed typo here
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
      expect(error?.details[0].message).toMatch(/swapCd/);
    });

    it('should reject when missing', () => {
      const { SwapCd, ...input } = validInput;
      const { error } = validateSwipeDetails.validate(input);
      expect(error?.details[0].message).toMatch(/swapCd/);
    });
  });

  // ... rest of the test cases remain similar but ensure field names match
});
