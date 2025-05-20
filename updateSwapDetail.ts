import { Request, Response } from 'express';
import { updateSwapDetail } from './yourControllerFile';
import { updateSwapData } from '../service/swapDetailsService';
import { logInfo, logError } from '../logger';
import { httpStatusCode } from '../types/enum/httpStatusCode';

// Mock the dependencies
jest.mock('../service/swapDetailsService');
jest.mock('../logger');

describe('updateSwapDetail Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
    };

    responseJson = jest.fn();
    responseStatus = jest.fn(() => ({ json: responseJson }));

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Spy on console.error for unexpected errors
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should return 400 if swapCd is missing', async () => {
    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(responseJson).toHaveBeenCalledWith({
      message: 'SwapCd is required to update a swap detail.',
    });
  });

  it('should return 400 if updateData is empty', async () => {
    mockRequest.params = { swapCd: '123' };
    mockRequest.body = {};

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(responseJson).toHaveBeenCalledWith({
      message: 'Updated data is required to update a swap detail.',
    });
  });

  it('should call updateSwapData with correct parameters', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1', field2: 'value2' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    const mockUpdatedSwapDetail = { id: 123, ...updateData };
    (updateSwapData as jest.Mock).mockResolvedValue(mockUpdatedSwapDetail);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(updateSwapData).toHaveBeenCalledWith(Number(swapCd), updateData);
    expect(logInfo).toHaveBeenCalled();
  });

  it('should return 200 with updated data on success', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    const mockUpdatedSwapDetail = { id: 123, ...updateData };
    (updateSwapData as jest.Mock).mockResolvedValue(mockUpdatedSwapDetail);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toHaveBeenCalledWith(httpStatusCode.OK);
    expect(responseJson).toHaveBeenCalledWith({
      message: `Swap detail with SwapCd ${swapCd} updated successfully.`,
      data: mockUpdatedSwapDetail,
    });
  });

  it('should return 404 if swap detail not found', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    (updateSwapData as jest.Mock).mockResolvedValue(null);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toHaveBeenCalledWith(httpStatusCode.NOT_FOUND);
    expect(responseJson).toHaveBeenCalledWith({
      message: `Swap detail with SwapCd ${swapCd} not found.`,
    });
  });

  it('should handle errors and return 500', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    const mockError = new Error('Database error');
    (updateSwapData as jest.Mock).mockRejectedValue(mockError);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toHaveBeenCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(responseJson).toHaveBeenCalledWith({
      message: 'Failed to update swap detail.',
      error: 'Database error',
    });
    expect(logError).toHaveBeenCalled();
  });

  it('should handle unknown errors', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    (updateSwapData as jest.Mock).mockRejectedValue('Not an error object');

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toHaveBeenCalledWith(
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(responseJson).toHaveBeenCalledWith({
      message: 'Failed to update swap detail.',
      error: 'Unknown error',
    });
    expect(logError).toHaveBeenCalled();
  });

  it('should log with correct logOptions when request is received', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    const mockUpdatedSwapDetail = { id: 123, ...updateData };
    (updateSwapData as jest.Mock).mockResolvedValue(mockUpdatedSwapDetail);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(logInfo).toHaveBeenCalledWith({
      message: `Request received for update SwapDetail with query params: ${JSON.stringify(
        swapCd
      )}`,
      source: 'update swapDetails Controller.ts >> update SwapDetail',
      statusCode: `${httpStatusCode.OK}`,
    });
  });
});



















======================================================


describe('Error Handling with Custom Properties', () => {
  it('should extract statusCode when present on error object', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    const mockError = new Error('Custom error');
    (mockError as any).statusCode = httpStatusCode.FORBIDDEN; // Custom status code
    (updateSwapData as jest.Mock).mockRejectedValue(mockError);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(logError).toHaveBeenCalledWith(
      mockError,
      expect.objectContaining({
        statusCode: `${httpStatusCode.FORBIDDEN}`, // Should use the custom status code
        reasonCode: 'UNKNOWN_REASON' // Default reason code
      })
    );
  });

  it('should extract reasonCode when present on error object', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    const mockError = new Error('Custom error');
    (mockError as any).reasonCode = 'VALIDATION_FAILED'; // Custom reason code
    (updateSwapData as jest.Mock).mockRejectedValue(mockError);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(logError).toHaveBeenCalledWith(
      mockError,
      expect.objectContaining({
        statusCode: `${httpStatusCode.INTERNAL_SERVER_ERROR}`, // Default status code
        reasonCode: 'VALIDATION_FAILED' // Should use the custom reason code
      })
    );
  });

  it('should handle error with both custom statusCode and reasonCode', async () => {
    const swapCd = '123';
    const updateData = { field1: 'value1' };
    mockRequest.params = { swapCd };
    mockRequest.body = updateData;

    const mockError = new Error('Complete custom error');
    (mockError as any).statusCode = httpStatusCode.CONFLICT;
    (mockError as any).reasonCode = 'DATA_CONFLICT';
    (updateSwapData as jest.Mock).mockRejectedValue(mockError);

    await updateSwapDetail(mockRequest as Request, mockResponse as Response);

    expect(logError).toHaveBeenCalledWith(
      mockError,
      expect.objectContaining({
        statusCode: `${httpStatusCode.CONFLICT}`,
        reasonCode: 'DATA_CONFLICT'
      })
    );
  });
});