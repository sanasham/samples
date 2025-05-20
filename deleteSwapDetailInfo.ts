import deleteSwapDetailInfo from '../src/controller/deleteSwapDetails';
import { Request, Response } from 'express';
import { deleteSwapDetail } from '../src/service/swapDetailsService';
import { httpStatusCode } from '../src/types/enum/httpStatusCode';
import { logInfo, logError } from '../src/logger';

// Mock the dependencies
jest.mock('../src/service/swapDetailsService');
jest.mock('../src/logger');

const mockedDeleteSwapDetail = deleteSwapDetail as jest.MockedFunction<
  typeof deleteSwapDetail
>;
const mockedLogInfo = logInfo as jest.MockedFunction<typeof logInfo>;
const mockedLogError = logError as jest.MockedFunction<typeof logError>;

describe('deleteSwapDetailInfo', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: jest.Mock;
  let json: jest.Mock;

  beforeEach(() => {
    status = jest.fn().mockReturnThis();
    json = jest.fn().mockReturnThis();

    res = {
      status,
      json,
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should return 400 if swapCd is not provided', async () => {
    req = { params: {} };

    await deleteSwapDetailInfo(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      message: 'SwapCd is required to delete a swap detail.',
    });
  });

  it('should call deleteSwapDetail service with correct swapCd', async () => {
    const swapCd = '123';
    req = { params: { swapCd } };
    mockedDeleteSwapDetail.mockResolvedValue(true);

    await deleteSwapDetailInfo(req as Request, res as Response);

    expect(mockedDeleteSwapDetail).toHaveBeenCalledWith(Number(swapCd));
  });

  it('should log the request information', async () => {
    const swapCd = '123';
    req = { params: { swapCd } };
    mockedDeleteSwapDetail.mockResolvedValue(true);

    await deleteSwapDetailInfo(req as Request, res as Response);

    expect(mockedLogInfo).toHaveBeenCalled();
    const logOptions = mockedLogInfo.mock.calls[0][0];
    expect(logOptions.message).toContain(
      'Request received for deleteSwapDetail'
    );
    expect(logOptions.source).toContain(
      'swapDetailsController.ts >> deleteSwapDetail'
    );
  });

  it('should return 404 if swap detail is not found', async () => {
    const swapCd = '123';
    req = { params: { swapCd } };
    mockedDeleteSwapDetail.mockResolvedValue(false);

    await deleteSwapDetailInfo(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(httpStatusCode.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      message: `Swap detail with SwapCd ${swapCd} not found in the table.`,
    });
  });

  it('should return 200 and success message if deletion is successful', async () => {
    const swapCd = '123';
    req = { params: { swapCd } };
    mockedDeleteSwapDetail.mockResolvedValue(true);

    await deleteSwapDetailInfo(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(httpStatusCode.OK);
    expect(json).toHaveBeenCalledWith({
      message: `Swap detail with SwapCd ${swapCd} deleted successfully.`,
    });
  });

  it('should handle errors and return 500', async () => {
    const swapCd = '123';
    req = { params: { swapCd } };
    const testError = new Error('Test error');
    mockedDeleteSwapDetail.mockRejectedValue(testError);

    await deleteSwapDetailInfo(req as Request, res as Response);

    expect(mockedLogError).toHaveBeenCalledWith(testError, expect.any(Object));
    expect(status).toHaveBeenCalledWith(httpStatusCode.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({
      message: 'Failed to delete swap detail.',
      error: 'Test error',
    });
  });

  it('should handle unknown errors and return generic error message', async () => {
    const swapCd = '123';
    req = { params: { swapCd } };
    mockedDeleteSwapDetail.mockRejectedValue('Some non-Error value');

    await deleteSwapDetailInfo(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(httpStatusCode.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({
      message: 'Failed to delete swap detail.',
      error: 'Unknown error.',
    });
  });
});
