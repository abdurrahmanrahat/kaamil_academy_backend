import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { QuranLCBasicServices } from './quran-lc-basic.service';

const createQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req.body;

  const result = await QuranLCBasicServices.createQuranLCBasicIntoDb(userInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration successfully done',
    data: result,
  });
});

const getAllQuranLCBasics = catchAsync(async (req: Request, res: Response) => {
  const result = await QuranLCBasicServices.getQuranLCBasicsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All students retrieved successfully',
    data: result,
  });
});

const updateQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const result = await QuranLCBasicServices.updateQuranLCBasicsIntoDb(
    studentId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student status updated successfully',
    data: result,
  });
});

const deleteQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const result = await QuranLCBasicServices.deleteQuranLCBasicIntoDb(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

// const makePDFQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
//   await QuranLCBasicServices.makePdfQuranLCBasicsFromDb(res);
// });

export const QuranLCBasicControllers = {
  createQuranLCBasic,
  getAllQuranLCBasics,
  updateQuranLCBasic,
  deleteQuranLCBasic,
};
