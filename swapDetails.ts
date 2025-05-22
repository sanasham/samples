import { Request, Response } from 'express';
import swapDetails from '../src/controller/getSwapDetails';
import { getSwapDetailsData } from '../src/service/swapDetailsService';
import { logInfo, logError } from '../src/logger';
import { httpStatusCode } from '../src/types/enum/httpStatusCode';

// Mock dependencies
jest.mock('../src/service/swapDetailsService');
jest.mock('../src/logger');
jest.mock('../src/middleware/paramsValidator', () => ({
  extractQueryParams: jest.fn(),
}));

const mockExtractQueryParams = require('../src/middleware/paramsValidator').extractQueryParams;

describe('swapDetails controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    
    req = {
      query: { id: '123' },
    };
    
    res = {
      status: mockStatus,
      json: mockJson,
    };

    jest.clearAllMocks();
  });

  it('should successfully get swap details and return 200 status', async () => {
    const mockQueryParams = { id: '123' };
    const mockSwapDetails = { id: '123', amount: 100 };
    
    mockExtractQueryParams.mockReturnValue(mockQueryParams);
    (getSwapDetailsData as jest.Mock).mockResolvedValue(mockSwapDetails);

    await swapDetails(req as Request, res as Response);

    expect(mockExtractQueryParams).toHaveBeenCalledWith(req);
    expect(logInfo).toHaveBeenCalledWith({
      message: 'Request received for getSwapDetails with query params: {"id":"123"}',
      source: 'swapDetailsController.ts >> getSwapDetails',
      statusCode: httpStatusCode.OK,
    });
    expect(getSwapDetailsData).toHaveBeenCalledWith(mockQueryParams);
    expect(mockStatus).toHaveBeenCalledWith(httpStatusCode.OK);
    expect(mockJson).toHaveBeenCalledWith(mockSwapDetails);
  });

  it('should handle "No matching swap details found" error and return 404 status', async () => {
    const mockQueryParams = { id: '123' };
    const error = new Error('No matching swap details found.');
    
    mockExtractQueryParams.mockReturnValue(mockQueryParams);
    (getSwapDetailsData as jest.Mock).mockRejectedValue(error);

    await swapDetails(req as Request, res as Response);

    expect(logError).toHaveBeenCalledWith(error, {
      message: 'Error occurred while fetching swap details.',
      source: 'swapDetailsController.ts >> getSwapDetails >> Catch Block',
      statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
      reasonCode: 'FETCH_SWAP_DETAILS_ERROR',
    });
    expect(mockStatus).toHaveBeenCalledWith(httpStatusCode.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'No matching swap details found.',
    });
  });

  it('should handle general errors and return 500 status', async () => {
    const mockQueryParams = { id: '123' };
    const error = new Error('Database connection failed');
    
    mockExtractQueryParams.mockReturnValue(mockQueryParams);
    (getSwapDetailsData as jest.Mock).mockRejectedValue(error);

    await swapDetails(req as Request, res as Response);

    expect(logError).toHaveBeenCalledWith(error, {
      message: 'Error occurred while fetching swap details.',
      source: 'swapDetailsController.ts >> getSwapDetails >> Catch Block',
      statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
      reasonCode: 'FETCH_SWAP_DETAILS_ERROR',
    });
    expect(mockStatus).toHaveBeenCalledWith(httpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Internal server error occurred while fetching swap details.',
      error: 'Database connection failed',
    });
  });

  it('should handle unknown errors and return 500 status', async () => {
    const mockQueryParams = { id: '123' };
    const error = 'Some string error';
    
    mockExtractQueryParams.mockReturnValue(mockQueryParams);
    (getSwapDetailsData as jest.Mock).mockRejectedValue(error);

    await swapDetails(req as Request, res as Response);

    expect(logError).toHaveBeenCalledWith(new Error('Unknown error occurred'), {
      message: 'Error occurred while fetching swap details.',
      source: 'swapDetailsController.ts >> getSwapDetails >> Catch Block',
      statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
      reasonCode: 'FETCH_SWAP_DETAILS_ERROR',
    });
    expect(mockStatus).toHaveBeenCalledWith(httpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Internal server error occurred while fetching swap details.',
      error: 'Unknown error',
    });
  });

  it('should handle errors in query parameter extraction', async () => {
    const error = new Error('Invalid query parameters');
    mockExtractQueryParams.mockImplementation(() => {
      throw error;
    });

    await swapDetails(req as Request, res as Response);

    expect(logError).toHaveBeenCalledWith(error, {
      message: 'Error occurred while fetching swap details.',
      source: 'swapDetailsController.ts >> getSwapDetails >> Catch Block',
      statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
      reasonCode: 'FETCH_SWAP_DETAILS_ERROR',
    });
    expect(mockStatus).toHaveBeenCalledWith(httpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Internal server error occurred while fetching swap details.',
      error: 'Invalid query parameters',
    });
  });
});
