import reportService from '../services/reportService.js';
import catchAsync from '../utils/catchAsync.js';
import { sendResponse } from '../utils/response.js';

export const getIncentiveReport = catchAsync(async (req, res) => {
    const { agent_name, rating, sortBy, order } = req.query;
    const report = await reportService.getIncentiveReport({ agent_name, rating, sortBy, order });
    sendResponse(res, 200, report);
});
