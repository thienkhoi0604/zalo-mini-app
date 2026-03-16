import { useEffect } from "react";
import useSnackbar from "zmp-ui/useSnackbar";
import { setGlobalSnackbar } from "utils/notification";

export function useSnackbarInit() {
  const snackbar = useSnackbar();

  useEffect(() => {
    setGlobalSnackbar(snackbar);
  }, [snackbar]);
}
