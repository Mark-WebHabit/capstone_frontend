// middleware.js
const abortMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (action.payload && action.payload.abortController) {
      action.payload.abortController.signal.addEventListener("abort", () => {
        // Handle cancellation, e.g., dispatch an action indicating cancellation
        dispatch({ type: "ASYNC_ACTION_CANCELLED" });
      });
    }
    return next(action);
  };

export default abortMiddleware;
