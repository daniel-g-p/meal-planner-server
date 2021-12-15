const result = (valid, response) => {
  return valid ? { valid, data: response } : { valid, error: response };
};

export const condition = (condition, errorMessage) => {
  return condition ? result(true) : result(false, errorMessage);
};

export const validate = (data, ...conditions) => {
  for (let condition of conditions) {
    if (!condition.valid) {
      return result(false, condition.error);
    }
  }
  return result(true, data);
};
