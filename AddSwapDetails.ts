import { Request, Response } from 'express';
import { addSwapDetails } from './addSwapDetails';
import { addSwipeDetails } from './service/swapDetailsService';
import { validateSwipeDetails } from '../utils/validations/SwapDetails';
import { logInfo, logError } from '../logger';
import { httpStatusCode } from '../types/enum/httpStatusCode';

// Mock all dependencies
jest.mock('./service/swapDetailsService');
jest.mock('../utils/validations/SwapDetails');
jest.mock('../logger');

const mockAddSwipeDetails = addSwipeDetails as jest.MockedFunction<typeof addSwipeDetails>;
const mockValidateSwipeDetails = validateSwipeDetails as jest.MockedFunction<typeof validateSwipeDetails>;
const mockLogInfo = logInfo as jest.MockedFunction<typeof logInfo>;
const mockLogError = logError as jest.MockedFunction<typeof logError>;

describe('addSwapDetails Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: jest.Mock;
  let json: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        SwapCd: 6501,
        Brand: 4,
        Channel: "offline",
        Term: 15,
        StartDr: "2025-06-10",
        EndDr: "2025-07-20"
      }
    };

    status = jest.fn().mockReturnThis();
    json = jest.fn();

    res = {
      status,
      json
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should successfully add swap details and return 201 status', async () => {
    // Mock validation to succeed
    mockValidateSwipeDetails.validate.mockReturnValueOnce({
      error: null,
      value: req.body
    });

    // Mock service to return success
    const mockResponse = { id: '789', ...req.body };
    mockAddSwipeDetails.mockResolvedValueOnce(mockResponse);

    await addSwapDetails(req as Request, res as Response);

    // Verify validation was called with correct input
    expect(mockValidateSwipeDetails.validate).toHaveBeenCalledWith({
      SwapCd: 6501,
      Brand: 4,
      Channel: "offline",
      Term: 15,
      StartDr: "2025-06-10",
      EndDr: "2025-07-20"
    });

    // Verify service was called with correct input
    expect(mockAddSwipeDetails).toHaveBeenCalledWith({
      SwapCd: 6501,
      Brand: 4,
      Channel: "offline",
      Term: 15,
      StartDr: "2025-06-10",
      EndDr: "2025-07-20"
    });

    // Verify logging was called
    expect(mockLogInfo).toHaveBeenCalledWith({
      message: `Request received for adding SwapDetail with query params: ${JSON.stringify(req.body)}`,
      source: `addSwapDetails.ts >> addSwapDetail`,
      statusCode: `${httpStatusCode.OK}`
    });

    // Verify response
    expect(status).toHaveBeenCalledWith(httpStatusCode.CREATED);
    expect(json).toHaveBeenCalledWith({
      message: `Swipe details added successfully.`,
      data: mockResponse
    });
  });

  it('should return 400 status when validation fails for SwapCd', async () => {
    // Mock validation to fail for SwapCd
    const mockError = {
      error: {
        details: [{ message: '"SwapCd" must be a number' }]
      }
    };
    mockValidateSwipeDetails.validate.mockReturnValueOnce(mockError as any);

    // Test with invalid SwapCd (string instead of number)
    req.body.SwapCd = "invalid";

    await addSwapDetails(req as Request, res as Response);

    // Verify response
    expect(status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      message: '"SwapCd" must be a number'
    });
  });

  it('should return 400 status when required field is missing', async () => {
    // Mock validation to fail for missing Brand
    const mockError = {
      error: {
        details: [{ message: '"Brand" is required' }]
      }
    };
    mockValidateSwipeDetails.validate.mockReturnValueOnce(mockError as any);

    // Remove Brand from request
    delete req.body.Brand;

    await addSwapDetails(req as Request, res as Response);

    // Verify response
    expect(status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      message: '"Brand" is required'
    });
  });

  it('should handle service errors and return 500 status', async () => {
    // Mock validation to succeed
    mockValidateSwipeDetails.validate.mockReturnValueOnce({
      error: null,
      value: req.body
    });

    // Mock service to throw error
    const mockError = new Error('Database connection failed');
    mockAddSwipeDetails.mockRejectedValueOnce(mockError);

    await addSwapDetails(req as Request, res as Response);

    // Verify error logging
    expect(mockLogError).toHaveBeenCalledWith(mockError, {
      message: `Error in addSwipeDetails with query params: ${JSON.stringify(req.body)}`,
      source: `addSwapDetails.ts >> addSwapDetail`,
      statusCode: `${httpStatusCode.INTERNAL_SERVER_ERROR}`
    });

    // Verify response
    expect(status).toHaveBeenCalledWith(httpStatusCode.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({
      message: `Failed to add swipe details.`,
      error: 'Database connection failed'
    });
  });

  it('should validate date format for StartDr and EndDr', async () => {
    // Mock validation to fail for date format
    const mockError = {
      error: {
        details: [{ message: '"StartDr" must be in YYYY-MM-DD format' }]
      }
    };
    mockValidateSwipeDetails.validate.mockReturnValueOnce(mockError as any);

    // Test with invalid date format
    req.body.StartDr = "10-06-2025";

    await addSwapDetails(req as Request, res as Response);

    // Verify response
    expect(status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      message: '"StartDr" must be in YYYY-MM-DD format'
    });
  });

  it('should validate Term is a positive number', async () => {
    // Mock validation to fail for Term
    const mockError = {
      error: {
        details: [{ message: '"Term" must be a positive number' }]
      }
    };
    mockValidateSwipeDetails.validate.mockReturnValueOnce(mockError as any);

    // Test with negative Term
    req.body.Term = -5;

    await addSwapDetails(req as Request, res as Response);

    // Verify response
    expect(status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      message: '"Term" must be a positive number'
    });
  });
});
