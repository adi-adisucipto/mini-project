"use client";

import { SnackbarProvider } from "notistack";

function NotistackProvider(
    { children } : { children : React.ReactNode }
) {
  return (
    <SnackbarProvider
        maxSnack={2}
        transitionDuration={300}
        anchorOrigin={{
            horizontal: "right",
            vertical: "top"
        }}
    >
        { children }
    </SnackbarProvider>
  )
}

export default NotistackProvider
