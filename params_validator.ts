import Joi from 'joi';
import { Request } from 'express';

// Define the Joi validation schema
const queryParamsSchema = Joi.object({
  SwapCd: Joi.number().integer().optional(),
  Brand: Joi.number().integer().optional(),
  Channel: Joi.string().optional(),
  Term: Joi.number().integer().optional(),
  StartDt: Joi.date().iso().optional(),
  EndDt: Joi.date().iso().optional(),
}).options({ allowUnknown: false });

export const extractQueryParams = (req: Request) => {
  // Validate the query parameters
  const { error, value } = queryParamsSchema.validate(req.query);

  if (error) {
    throw new Error(`Invalid query parameters: ${error.message}`);
  }

  // Convert string values to appropriate types
  return {
    SwapCd: value.SwapCd ? parseInt(value.SwapCd as string, 10) : undefined,
    Brand: value.Brand ? parseInt(value.Brand as string, 10) : undefined,
    Channel: value.Channel as string | undefined,
    Term: value.Term ? parseInt(value.Term as string, 10) : undefined,
    StartDt: value.StartDt ? new Date(value.StartDt as string) : undefined,
    EndDt: value.EndDt ? new Date(value.EndDt as string) : undefined,
  };
};

// Usage in an Express Route
// Here's how you would use this in an Express route:

import express from 'express';
import { extractQueryParams } from './your-module';

const app = express();

app.get('/api/data', (req, res) => {
  try {
    const params = extractQueryParams(req);
    // Use the validated params...
    res.json(params);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Enhanced Version with Better Error Handling
// For a more robust implementation, you might want to create a middleware:

import { RequestHandler } from 'express';

export const validateQueryParams: RequestHandler = (req, res, next) => {
  try {
    req.validatedQuery = extractQueryParams(req);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Then in your route:
app.get('/api/data', validateQueryParams, (req, res) => {
  const params = req.validatedQuery;
  // Use the validated params...
  res.json(params);
});
