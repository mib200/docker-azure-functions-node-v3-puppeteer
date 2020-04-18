const sendResponse = (ctx, response) => {
  const context = ctx;
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: response,
  };
};

const sendErrorResponse = (ctx, code, errorMessage) => {
  const context = ctx;
  let message = 'Server error';
  if (code === 401) message = 'Unauthorized';
  else if (code === 400) message = 'Bad request';
  context.res = {
    status: code,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      error: message,
      message: errorMessage || 'Error occurred.',
    },
  };
};

module.exports = {
  sendResponse,
  sendErrorResponse,
};
