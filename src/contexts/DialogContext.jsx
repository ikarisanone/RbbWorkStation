import React, { createContext, useContext, useState, useCallback } from 'react';

const DialogContext = createContext();

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);

  const openDialog = useCallback((id, props = {}) => {
    setDialogs((prevDialogs) => [...prevDialogs, { id, props }]);
  }, []);

  const closeDialog = useCallback((id) => {
    setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== id));
  }, []);

  const value = { dialogs, openDialog, closeDialog };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
};