import { analyzeComplaintWithAI } from '../utils/groqService.js';

// @desc    Analyze complaint title and description using Groq AI
// @route   POST /api/ai/analyzeComplaint
// @access  Public / Private
export const analyzeComplaint = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and description for AI analysis'
      });
    }

    const aiAnalysis = await analyzeComplaintWithAI(title, description);

    res.status(200).json({
      success: true,
      data: aiAnalysis
    });
  } catch (error) {
    next(error);
  }
};
