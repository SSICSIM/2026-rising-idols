"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "show-previous-periods";

interface ShowPreviousPeriodsState {
  showPreviousPeriods: boolean;
  setShowPreviousPeriods: (show: boolean) => void;
}

const ShowPreviousPeriodsContext = createContext<ShowPreviousPeriodsState>({
  showPreviousPeriods: false,
  setShowPreviousPeriods: () => {},
});

// Per-viewer preference for listing posts, notices and shop items from earlier
// periods too. Saved in localStorage, so it is only remembered in this browser.
export function ShowPreviousPeriodsProvider({ children }: { children: React.ReactNode }) {
  const [showPreviousPeriods, setShowState] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "true") setShowState(true);
    } catch {
      // Storage can be unavailable (private window, blocked site data); keep the default.
    }
  }, []);

  function setShowPreviousPeriods(show: boolean) {
    setShowState(show);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(show));
    } catch {
      // Ignore: the setting still applies for this page view.
    }
  }

  return (
    <ShowPreviousPeriodsContext.Provider value={{ showPreviousPeriods, setShowPreviousPeriods }}>
      {children}
    </ShowPreviousPeriodsContext.Provider>
  );
}

export function useShowPreviousPeriods() {
  return useContext(ShowPreviousPeriodsContext);
}
