import { Request, Response } from 'express';
import { swapDetails, extractQueryParams } from './swapDetailsController';
import { getSwapDetails } from '../service/swapDetailsService';
import { logInfo, logError } from '../logger';
import { httpStatusCode } from '../types/enum/httpStatusCode';

// Mock the dependencies
jest.mock('../service/swapDetailsService');
jest.mock('../logger');

const mockRequest = (query: any = {}): Request =>
  ({
    query,
  } as unknown as Request);

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('extractQueryParams', () => {
  it('should extract and convert all valid query parameters', () => {
    const req = mockRequest({
      SwapCd: '123',
      Brand: '456',
      Channel: 'web',
      Term: '789',
      StartUt: '2023-01-01T00:00:00Z',
      EndUt: '2023-01-02T00:00:00Z',
    });

    const result = extractQueryParams(req);

    expect(result).toEqual({
      SwapCd: 123,
      Brand: 456,
      Channel: 'web',
      Term: 789,
      StartUt: new Date('2023-01-01T00:00:00Z'),
      EndUt: new Date('2023-01-02T00:00:00Z'),
    });
  });

  it('should handle undefined values when parameters are missing', () => {
    const req = mockRequest({
      Channel: 'mobile',
    });

    const result = extractQueryParams(req);

    expect(result).toEqual({
      SwapCd: undefined,
      Brand: undefined,
      Channel: 'mobile',
      Term: undefined,
      StartUt: undefined,
      EndUt: undefined,
    });
  });

  it('should handle invalid number values', () => {
    const req = mockRequest({
      SwapCd: 'invalid',
      Brand: '456',
    });

    const result = extractQueryParams(req);

    expect(result.SwapCd).toBeNaN();
    expect(result.Brand).toBe(456);
  });
});

describe('swapDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return swap details when data is available', async () => {
    const mockData = [{ id: 1, name: 'Test Swap' }];
    (getSwapDetails as jest.Mock).mockResolvedValue(mockData);

    const req = mockRequest({ SwapCd: '123' });
    const res = mockResponse();

    await swapDetails(req, res);

    expect(logInfo).toHaveBeenCalledWith({
      message: expect.stringContaining('Request received for getSwapDetails'),
      source: 'swapDetailsController.ts >> getSwapDetails',
      statusCode: `${httpStatusCode.OK}`,
    });

    expect(getSwapDetails).toHaveBeenCalledWith({
      SwapCd: 123,
      Brand: undefined,
      Channel: undefined,
      Term: undefined,
      StartUt: undefined,
      EndUt: undefined,
    });

    expect(res.status).toHaveBeenCalledWith(httpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return 404 when no data is available', async () => {
    (getSwapDetails as jest.Mock).mockResolvedValue([]);

    const req = mockRequest({ SwapCd: '123' });
    const res = mockResponse();

    await swapDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatusCode.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'No items available.' });
  });

  it('should handle errors and return 500', async () => {
    const mockError = new Error('Database error');
    (getSwapDetails as jest.Mock).mockRejectedValue(mockError);

    const req = mockRequest({ SwapCd: '123' });
    const res = mockResponse();

    await swapDetails(req, res);

    expect(logError).toHaveBeenCalledWith(mockError, {
      message: 'Error occurred while fetching swap details.',
      source: 'swapDetailsController.ts >> getSwapDetails >> Catch Block',
      statusCode: `${httpStatusCode.INTERNAL_SERVER_ERROR}`,
      reasonCode: 'FETCH_SWAP_DETAILS_ERROR',
    });

    expect(res.status).toHaveBeenCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error occurred while fetching swap details.',
      error: 'Database error',
    });
  });

  it('should handle unknown errors', async () => {
    (getSwapDetails as jest.Mock).mockRejectedValue('Some non-error value');

    const req = mockRequest({ SwapCd: '123' });
    const res = mockResponse();

    await swapDetails(req, res);

    expect(logError).toHaveBeenCalledWith(expect.any(Error), {
      message: 'Error occurred while fetching swap details.',
      source: 'swapDetailsController.ts >> getSwapDetails >> Catch Block',
      statusCode: `${httpStatusCode.INTERNAL_SERVER_ERROR}`,
      reasonCode: 'FETCH_SWAP_DETAILS_ERROR',
    });

    expect(res.status).toHaveBeenCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error occurred while fetching swap details.',
      error: 'Unknown error.',
    });
  });
});
