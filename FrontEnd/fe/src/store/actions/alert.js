export const showAlert = (message, type = 'info') => ({
  type: 'SHOW_ALERT',
  payload: { message, type }
});

export const hideAlert = () => ({
  type: 'HIDE_ALERT'
}); 