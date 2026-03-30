import React, { FC } from "react";
import { createPortal } from "react-dom";
import { Sheet as OrginalSheet } from "zmp-ui";
import { ActionSheetProps, SheetProps } from "zmp-ui/sheet";

export const Sheet: FC<Omit<SheetProps, "ref">> = (props) => {
  return createPortal(<OrginalSheet {...props} />, document.body);
};

export const ActionSheet: FC<Omit<ActionSheetProps, "ref">> = (props) => {
  return createPortal(<OrginalSheet.Actions {...props} />, document.body);
};
