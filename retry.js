async function retry(fn, maxAttempts = 3, delay = 1000) {
    let attempts = 0;
    while (attempts < maxAttempts) {
      try {
        return await fn();
      } catch (error) {
        console.error(error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error(`Maximum attempts reached`);
  }
  
  module.exports = retry;