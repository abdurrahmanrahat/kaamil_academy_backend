import express from 'express';
import ValidateRequest from '../../middlewares/ValidateRequest';
import { QuranLCBasicControllers } from './quran-lc-basic.controller';
import { QuranLCBasicValidations } from './quran-lc-basic.validation';

const router = express.Router();

router.post(
  '/create-quran-lc-basic-student',
  ValidateRequest(QuranLCBasicValidations.createQuranLCBasicValidationSchema),
  QuranLCBasicControllers.createQuranLCBasic,
);

router.get('/', QuranLCBasicControllers.getAllQuranLCBasics);

router.patch(
  '/:studentId',
  ValidateRequest(QuranLCBasicValidations.updateQuranLCBasicValidationSchema),
  QuranLCBasicControllers.updateQuranLCBasic,
);

router.delete('/:studentId', QuranLCBasicControllers.deleteQuranLCBasic);

// router.get('/download-pdf', QuranLCBasicControllers.makePDFQuranLCBasic);

// payment api
router.post('/payment', QuranLCBasicControllers.createQuranLCBasicPayment);
router.get('/payment/callback', QuranLCBasicControllers.quranLCBasicCallback);

export const QuranLCBasicRoutes = router;
