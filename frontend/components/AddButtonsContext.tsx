"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "show-add-buttons";

interface AddButtonsState {
  showAddButtons: boolean;
  setShowAddButtons: (show: boolean) => void;
}

const AddButtonsContext = createContext<AddButtonsState>({
  showAddButtons: true,
  setShowAddButtons: () => {},
});

// Per-viewer preference for showing the "Add …" buttons. Saved in
// localStorage, so it is only remembered in this browser.
export function AddButtonsProvider({ children }: { children: React.ReactNode }) {
  const [showAddButtons, setShowState] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "false") setShowState(false);
    } catch {
      // Storage can be unavailable (private window, blocked site data); keep the default.
    }
  }, []);

  function setShowAddButtons(show: boolean) {
    setShowState(show);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(show));
    } catch {
      // Ignore: the setting still applies for this page view.
    }
  }

  return (
    <AddButtonsContext.Provider value={{ showAddButtons, setShowAddButtons }}>
      {children}
    </AddButtonsContext.Provider>
  );
}

export function useAddButtons() {
  return useContext(AddButtonsContext);
}
